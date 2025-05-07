class ApiError extends Error {
  statusCode: number;
  customErrorCode?: string;
  constructor(statusCode: number, message: string, customErrorCode?: string) {
    super(message);
    this.statusCode = statusCode;
    this.customErrorCode = customErrorCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
