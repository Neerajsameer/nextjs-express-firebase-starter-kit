//Error handler takes the error code and returns the error_code, error_message and http_status_code.
//You can also pass custom message to override the default

// CONSOLE LOGGING DEBUG

function errorHandler(
  code: ERROR_CODES,
  message?: string,
  metadata?: { stacktrace?: string; otherData?: Record<string, any> }
): ErrorHandlerType {
  let error_message = message;
  //if message is one word, then it is error code

  if (message?.split(" ").length === 1) {
    if (code === ERROR_CODES.MISSING_PARAMS) error_message = "Missing required field: " + message;
    if (code === ERROR_CODES.INVALID_PARAMS) error_message = "Invalid field: " + message;
    if (code === ERROR_CODES.EXTRA_PARAMS) error_message = "Extra field: " + message;
    if (code === ERROR_CODES.INVALID_PARAMS) error_message = "Invalid field: " + message;
    if (code === ERROR_CODES.RECORD_NOT_FOUND)
      error_message = message ? "Data not found with given: " + message : "Data not found";
  }

  const status = getHTTPStatusCode(code);

  return {
    status,
    error: {
      code,
      message: error_message ?? error_messages[code],
    },
    metadata,
  };
}

export default errorHandler;

export enum ERROR_CODES {
  TOKEN_EXPIRED = "token-expired",
  MISSING_TOKEN = "missing-token",
  INVALID_TOKEN = "invalid-token",
  INVALID_REFRESH_TOKEN = "invalid-refresh-token",

  MISSING_PARAMS = "missing-params",
  INVALID_PARAMS = "invalid-params",
  EXTRA_PARAMS = "extra_params",
  RECORD_ALREADY_EXISTS = "record-already-exists",
  OPERATION_DENIED = "operation-denied",

  INVALID_REQUEST_METHOD = "invalid-request-method",
  INTERNAL_ERROR = "internal-error",
  INTERNAL_SAVING_ERROR = "saving-error",
  INTERNAL_API_CALL_ERROR = "api-call-error",

  ACCESS_DENIED = "access-denied",
  RECORD_NOT_FOUND = "record-not-found",

  RATE_LIMIT_EXCEEDED = "rate-limit-exceeded",
}

const error_messages: Record<ERROR_CODES, string> = {
  //Authorization - 401
  [ERROR_CODES.TOKEN_EXPIRED]: "JWT Token Expired",
  [ERROR_CODES.INVALID_TOKEN]: "Token is invalid.",
  [ERROR_CODES.MISSING_TOKEN]: "JWT token is missing",
  [ERROR_CODES.INVALID_REFRESH_TOKEN]: "Refresh token is invalid",

  //Request Data not accepted - 400
  [ERROR_CODES.MISSING_PARAMS]: "Missing required params",
  [ERROR_CODES.INVALID_PARAMS]: "Invalid params",
  [ERROR_CODES.EXTRA_PARAMS]: "Extra params provided",
  [ERROR_CODES.RECORD_ALREADY_EXISTS]: "record already exists with the given ID",

  //Not found - 404
  [ERROR_CODES.RECORD_NOT_FOUND]: "No record exists with the given ID",

  //Invalid Method - 405
  [ERROR_CODES.INVALID_REQUEST_METHOD]: "API does not support current request method",

  //Invalid Method - 429
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: "Rate limit exceeded",

  //Internal Error - 500
  [ERROR_CODES.INTERNAL_ERROR]: "Something unknown went wrong. If this error keeps occurring, please contact support",
  [ERROR_CODES.INTERNAL_SAVING_ERROR]:
    "Something unknown went wrong. If this error keeps occurring, please contact support",
  [ERROR_CODES.INTERNAL_API_CALL_ERROR]:
    "Something unknown went wrong. If this error keeps occurring, please contact support",
  //permissions - 403
  [ERROR_CODES.ACCESS_DENIED]: "You are not authorized to perform this operation",
  [ERROR_CODES.OPERATION_DENIED]: "Operation denied",
};

function getHTTPStatusCode(error_code: ERROR_CODES): number {
  switch (error_code) {
    case ERROR_CODES.MISSING_PARAMS:
    case ERROR_CODES.INVALID_PARAMS:
    case ERROR_CODES.RECORD_ALREADY_EXISTS:
    case ERROR_CODES.EXTRA_PARAMS:
      return 400;
    case ERROR_CODES.TOKEN_EXPIRED:
    case ERROR_CODES.INVALID_TOKEN:
    case ERROR_CODES.MISSING_TOKEN:
    case ERROR_CODES.INVALID_REFRESH_TOKEN:
      return 401;
    case ERROR_CODES.RECORD_NOT_FOUND:
      return 404;
    case ERROR_CODES.INVALID_REQUEST_METHOD:
      return 405;
    case ERROR_CODES.INTERNAL_ERROR:
    case ERROR_CODES.INTERNAL_SAVING_ERROR:
    case ERROR_CODES.INTERNAL_API_CALL_ERROR:
      return 500;
    case ERROR_CODES.ACCESS_DENIED:
    case ERROR_CODES.OPERATION_DENIED:
      return 403;
    default:
      return 600;
  }
}
