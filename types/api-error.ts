export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: Record<string, unknown>
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string
      error?: string
    }
    status?: number
  }
  message: string
}

export function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  )
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.response?.data?.message ?? error.response?.data?.error ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Une erreur inconnue s'est produite"
}
export function getErrorStatus(error: unknown): number | undefined {
  if (isApiError(error)) {
    return error.response?.status
  }

  return undefined
}