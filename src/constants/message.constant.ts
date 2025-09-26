export const message = {
  COMMON: {
    HEALTHCHECK: 'Server is alive',
    OK: 'Data retrieved successfully',
    CREATED: 'Data created successfully',
    UPDATED: 'Data updated successfully',
    DELETED: 'Data deleted successfully',
    NOT_FOUND: 'Data not found',
    FORBIDDEN: 'Forbidden',
    UNAUTHORIZED: 'Unauthorized',
    UNPROCESSABLE_ENTITY: 'Validation Error',
    VALIDATION_ERROR: 'Validation error',
  },
  AUTH: {
    LOGIN_SUCCESS: 'Login successfuly',
    REGISTER_SUCCESS: 'Register successfuly',
  },
} as const;
