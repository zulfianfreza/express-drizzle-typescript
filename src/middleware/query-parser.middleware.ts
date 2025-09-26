import { Request, Response, NextFunction } from 'express';

interface PaginationOptions {
  page: number;
  pageSize: number;
}

interface SortOption {
  field: string;
  order: 'asc' | 'desc';
}

interface FilterOperator {
  eq?: any;
  ne?: any;
  gt?: any;
  gte?: any;
  lt?: any;
  lte?: any;
  like?: string;
  ilike?: string;
  in?: any[];
  nin?: any[];
  between?: [any, any];
  [key: string]: any;
}

interface ParsedQuery {
  filter: Record<string, FilterOperator>;
  pagination: PaginationOptions;
  sort: SortOption[];
  search?: {
    term: string;
    fields: string[];
  };
}

interface QueryParserOptions {
  allowedFilters?: string[];
  allowedSortFields?: string[];
  searchableFields?: string[];
  maxLimit?: number;
  defaultLimit?: number;
  defaultPage?: number;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      parsedQuery: ParsedQuery;
    }
  }
}

const VALID_OPERATORS = [
  'eq',
  'ne',
  'gt',
  'gte',
  'lt',
  'lte',
  'like',
  'ilike',
  'in',
  'nin',
  'between',
];

export const queryParserMiddleware = (options?: QueryParserOptions) => {
  const {
    allowedFilters,
    allowedSortFields,
    searchableFields,
    maxLimit = 100,
    defaultLimit = 10,
    defaultPage = 1,
  } = options || {};

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as Record<string, any>;
      const parsedQuery: ParsedQuery = {
        filter: {},
        pagination: {
          page: defaultPage,
          pageSize: defaultLimit,
        },
        sort: [],
      };

      // Parse search - only add if search term exists
      if (query.search && searchableFields && searchableFields?.length > 0) {
        parsedQuery.search = {
          term: query.search,
          fields: searchableFields,
        };
      }

      // Parse pagination
      if (query.page) {
        const page = parseInt(query.page, 10);
        if (isNaN(page) || page < 1) {
          throw new Error('Invalid page number');
        }
        parsedQuery.pagination.page = page;
      }

      if (query.pageSize) {
        const limit = parseInt(query.pageSize, 10);
        if (isNaN(limit) || limit < 1) {
          throw new Error('Invalid limit value');
        }
        parsedQuery.pagination.pageSize = Math.min(limit, maxLimit);
      }

      // Parse sorting
      if (query.sort) {
        const sortFields = Array.isArray(query.sort)
          ? query.sort
          : [query.sort];
        parsedQuery.sort = sortFields
          .map((sortField: string) => {
            const [field, order] = sortField.split(':');
            if (!field) return null;

            // Check if sort field is allowed
            if (allowedSortFields && !allowedSortFields.includes(field)) {
              return null;
            }

            return {
              field,
              order: order?.toLowerCase() === 'desc' ? 'desc' : 'asc',
            };
          })
          .filter((sort): sort is SortOption => sort !== null);
      }

      // Parse filters with new format: field=value or field=operator:value
      const reservedKeys = ['page', 'pageSize', 'sort', 'search'];

      for (const [key, value] of Object.entries(query)) {
        // Skip reserved query parameters
        if (reservedKeys.includes(key)) {
          continue;
        }

        // Check if filter field is allowed
        if (allowedFilters && !allowedFilters.includes(key)) {
          continue;
        }

        // Parse filter value
        const filterValue = String(value);

        // Check if value contains operator (format: operator:value)
        const operatorMatch = filterValue.match(
          /^(eq|ne|gt|gte|lt|lte|like|ilike|in|nin|between):(.+)$/,
        );

        if (operatorMatch) {
          const [, operator, operatorValue] = operatorMatch;

          // Validate operator
          if (!VALID_OPERATORS.includes(operator)) {
            throw new Error(`Invalid operator: ${operator}`);
          }

          // Initialize filter object for this field
          parsedQuery.filter[key] = parsedQuery.filter[key] || {};

          // Handle special operators
          if (operator === 'in' || operator === 'nin') {
            // Split comma-separated values and trim whitespace
            parsedQuery.filter[key][operator] = operatorValue
              .split(',')
              .map((v) => v.trim())
              .filter((v) => v !== ''); // Remove empty values
          } else if (operator === 'between') {
            // Split comma-separated values for range
            const [start, end] = operatorValue.split(',').map((v) => v.trim());
            if (!start || !end) {
              throw new Error(
                'Between operator requires two values separated by comma',
              );
            }
            parsedQuery.filter[key][operator] = [start, end];
          } else {
            // Regular operators (eq, ne, gt, gte, lt, lte, like, ilike)
            parsedQuery.filter[key][operator] = operatorValue;
          }
        } else {
          // No operator specified, default to 'eq'
          parsedQuery.filter[key] = { eq: filterValue };
        }
      }

      req.parsedQuery = parsedQuery;
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Bad Request',
        message:
          error instanceof Error ? error.message : 'Invalid query parameters',
      });
    }
  };
};
