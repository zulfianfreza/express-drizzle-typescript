import { Database, db } from '@/database';
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gt,
  gte,
  inArray,
  like,
  lt,
  lte,
  ne,
  notInArray,
  or,
  sql,
  SQL,
} from 'drizzle-orm';
import { MySqlColumn, MySqlTable } from 'drizzle-orm/mysql-core';

export type Model = {
  id?: string | number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
};

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface QueryOptions<T> {
  filter?: Record<string, any>;
  pagination?: PaginationOptions;
  sort?: { field: keyof T; order: 'asc' | 'desc' }[];
  where?: Partial<T>;
  search?: {
    term: string;
    fields: (keyof T)[];
  };
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export type CreateModel<T extends Model> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt'
>;

export interface DeleteOptions {
  where: Record<string, any>;
}

export class BaseRepository<T extends Model, TTable extends MySqlTable> {
  protected db: Database = db;

  constructor(protected table: TTable) {}

  async create(data: CreateModel<T>): Promise<T> {
    const [result] = await this.db.insert(this.table).values(data as any);

    const created = await this.findById((result as any).insertId as string);
    if (!created) {
      throw new Error('Failed to create record');
    }
    return created;
  }

  async findById(id: string | number): Promise<T | null> {
    const columns = getTableColumns(this.table);
    const idColumn = columns.id as MySqlColumn;

    const result = await this.db
      .select()
      .from(this.table)
      .where(eq(idColumn, id))
      .limit(1);

    return (result[0] as T) || null;
  }

  async findOne({ where }: QueryOptions<T>): Promise<T | null> {
    try {
      const baseQuery = this.db.select().from(this.table);

      if (where && Object.keys(where).length > 0) {
        const conditions = this.buildWhereConditions(where);
        if (conditions.length > 0) {
          const result = await baseQuery.where(and(...conditions)).limit(1);
          return (result[0] as T) || null;
        }
      }

      const result = await baseQuery.limit(1);
      return (result[0] as T) || null;
    } catch (error) {
      console.error('Error in findOne:', error);
      throw error;
    }
  }

  async findAll(options?: QueryOptions<T>): Promise<PaginatedResult<T>> {
    const {
      filter = {},
      pagination = { page: 1, pageSize: 10 },
      sort = [],
      search,
    } = options || {};

    const { page, pageSize } = pagination;
    const offset = (page - 1) * pageSize;

    try {
      // Build WHERE conditions
      const whereConditions = this.buildFilterConditions(filter, search);

      // Count query - use any to avoid type issues
      let countQuery: any = this.db.select({ count: count() }).from(this.table);
      if (whereConditions.length > 0) {
        countQuery = countQuery.where(and(...whereConditions));
      }

      // Data query - use any to avoid type issues
      let dataQuery: any = this.db.select().from(this.table);

      if (whereConditions.length > 0) {
        dataQuery = dataQuery.where(and(...whereConditions));
      }

      // Handle sorting
      if (sort.length > 0) {
        const columns = getTableColumns(this.table);
        const orderBy = sort.map((s) => {
          const column = columns[s.field as string];
          return s.order === 'desc' ? desc(column) : asc(column);
        });
        dataQuery = dataQuery.orderBy(...orderBy);
      }

      // Add pagination
      dataQuery = dataQuery.limit(pageSize).offset(offset);

      // Execute both queries with proper typing
      const [totalResult, data] = await Promise.all([
        countQuery as Promise<{ count: number }[]>,
        dataQuery as Promise<T[]>,
      ]);

      const total = totalResult[0]?.count || 0;

      return {
        data,
        meta: {
          total,
          totalPages: Math.ceil(total / pageSize),
          currentPage: page,
          pageSize,
        },
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findAllWithoutPaginate(where?: Partial<T>): Promise<T[]> {
    const baseQuery = this.db.select().from(this.table);

    if (where && Object.keys(where).length > 0) {
      const conditions = this.buildWhereConditions(where);
      if (conditions.length > 0) {
        const result = await baseQuery.where(and(...conditions));
        return result as T[];
      }
    }

    const result = await baseQuery;
    return result as T[];
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    const columns = getTableColumns(this.table);
    const idColumn = columns.id as MySqlColumn;

    await this.db
      .update(this.table)
      .set(data as any)
      .where(eq(idColumn, id));

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Failed to update record');
    }
    return updated;
  }

  async delete(id: string | number): Promise<boolean> {
    const columns = getTableColumns(this.table);
    const idColumn = columns.id as MySqlColumn;

    const [result] = await this.db.delete(this.table).where(eq(idColumn, id));

    return result.affectedRows > 0;
  }

  async deleteOptions(options: DeleteOptions): Promise<boolean> {
    try {
      const { where } = options;

      if (!Object.keys(where).length) {
        throw new Error('Where clause cannot be empty');
      }

      const conditions = this.buildWhereConditions(where);
      if (conditions.length === 0) {
        throw new Error('Invalid where conditions');
      }

      const [result] = await this.db
        .delete(this.table)
        .where(and(...conditions));

      return result.affectedRows > 0;
    } catch (error) {
      console.log(`Failed to delete records from table`);
      throw error;
    }
  }

  async bulkDelete(ids: (string | number)[]): Promise<number> {
    if (!ids.length) {
      return 0;
    }

    const columns = getTableColumns(this.table);
    const idColumn = columns.id as MySqlColumn;

    const [result] = await this.db
      .delete(this.table)
      .where(inArray(idColumn, ids));

    return result.affectedRows;
  }

  async query(sqlQuery: SQL): Promise<any[]> {
    return this.db.execute(sqlQuery);
  }

  private buildWhereConditions(where: Record<string, any>): SQL[] {
    const conditions: SQL[] = [];
    const columns = getTableColumns(this.table);

    Object.entries(where).forEach(([field, value]) => {
      const column = columns[field];
      if (!column) return;

      if (value === null) {
        conditions.push(sql`${column} IS NULL`);
      } else {
        conditions.push(eq(column, value));
      }
    });

    return conditions;
  }

  private buildFilterConditions(
    filter: Record<string, any>,
    search?: { term: string; fields: (keyof T)[] },
  ): SQL[] {
    const conditions: SQL[] = [];
    const columns = getTableColumns(this.table);

    // Handle filter conditions
    Object.entries(filter).forEach(([field, operators]) => {
      const column = columns[field];
      if (!column) return;

      Object.entries(operators).forEach(([operator, value]) => {
        switch (operator) {
          case 'eq':
            conditions.push(eq(column, value));
            break;
          case 'ne':
            conditions.push(ne(column, value));
            break;
          case 'gt':
            conditions.push(gt(column, value));
            break;
          case 'gte':
            conditions.push(gte(column, value));
            break;
          case 'lt':
            conditions.push(lt(column, value));
            break;
          case 'lte':
            conditions.push(lte(column, value));
            break;
          case 'like':
            conditions.push(like(column, `%${value}%`));
            break;
          case 'ilike':
            conditions.push(sql`LOWER(${column}) LIKE LOWER(${`%${value}%`})`);
            break;
          case 'in':
            if (Array.isArray(value) && value.length > 0) {
              conditions.push(inArray(column, value));
            }
            break;
          case 'nin':
            if (Array.isArray(value) && value.length > 0) {
              conditions.push(notInArray(column, value));
            }
            break;
          default:
            throw new Error(`Unsupported operator: ${operator}`);
        }
      });
    });

    // Handle search - simplified approach
    if (search && search.fields.length > 0) {
      const searchConditions = search.fields
        .map((field) => {
          const column = columns[field as string];
          if (!column) return null;
          return sql`LOWER(${column}) LIKE LOWER(${`%${search.term}%`})`;
        })
        .filter((condition): condition is SQL => condition !== null);

      if (searchConditions.length > 0) {
        // Use type assertion to fix the or() issue
        conditions.push((or as any)(...searchConditions));
      }
    }

    return conditions;
  }
}
