import type {
  AnalyzeRequest,
  AnalyzeResponse,
  APIError,
  APIInfoResponse,
  FeedbackRequest,
  FeedbackResponse,
  HealthResponse,
} from './types'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://prompt-injection-detection-system-backend.onrender.com'
).replace(/\/+$/, '')

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options?.body
          ? {
              'Content-Type': 'application/json',
            }
          : {}),
        ...options?.headers,
      },
    })

    if (!response.ok) {
      let message = 'The request could not be completed.'

      try {
        const errorBody = (await response.json()) as {
          detail?: string
          message?: string
        }

        message =
          errorBody.detail ||
          errorBody.message ||
          message
      } catch {
        // Keep the default message.
      }

      const error: APIError = {
        message,
        status: response.status,
      }

      throw error
    }

    return (await response.json()) as T
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error
    ) {
      throw error
    }

    throw {
      message: 'Detection service unavailable.',
    } satisfies APIError
  }
}

export async function getAPIInfo(): Promise<APIInfoResponse> {
  return request('/')
}

export async function getHealth(): Promise<HealthResponse> {
  return request('/health')
}

export async function analyzePrompt(
  payload: AnalyzeRequest,
): Promise<AnalyzeResponse> {
  return request('/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function submitFeedback(
  payload: FeedbackRequest,
): Promise<FeedbackResponse> {
  return request('/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function scanDocument(file: File): Promise<never> {
  void file

  throw {
    message: 'Document scanning API integration pending.',
  } satisfies APIError
}

export function getAPIBaseURL(): string {
  return API_BASE_URL
}