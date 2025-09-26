export interface IResponse<TData = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: TData;
  timestamp?: string;
}

export interface IErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  details?: any;
  timestamp?: string;
}

export interface IPaginatedData<TData = any> {
  data: TData[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
