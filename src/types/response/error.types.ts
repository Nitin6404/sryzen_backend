export interface ErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  errors?: ErrorDetail[];
  stack?: string;
}