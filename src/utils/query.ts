import { QueryOptions } from '@/repositories/base.repository';

export function convertToQueryOptions<T>(parsedQuery: any): QueryOptions<T> {
  const { filter, pagination, sort, search } = parsedQuery;

  const queryOptions: QueryOptions<T> = {
    filter: filter || {},
    pagination: pagination || { page: 1, pageSize: 10 },
  };

  // Convert sort fields
  if (sort && Array.isArray(sort)) {
    queryOptions.sort = sort.map((s) => ({
      field: s.field as keyof T,
      order: s.order as 'asc' | 'desc',
    }));
  }

  // Convert search fields
  if (search && search.term && Array.isArray(search.fields)) {
    queryOptions.search = {
      term: search.term,
      fields: search.fields as (keyof T)[],
    };
  }

  return queryOptions;
}
