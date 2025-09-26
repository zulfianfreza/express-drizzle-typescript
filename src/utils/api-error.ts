class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public data: any;

  constructor(
    statusCode: number,
    message: string,
    data: any = null,
    isOperational: boolean = true,
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.data = data;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
