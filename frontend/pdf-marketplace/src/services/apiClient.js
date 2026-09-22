import { getAccessToken } from './tokenService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const buildApiUrl = (url) => {
  if (/^https?:\/\//i.test(url)) {
    return url
  }

  return `${API_BASE_URL}${url}`
}

export const apiRequest = async (url, options = {}) => {
  const accessToken = await getAccessToken()

  const response = await fetch(buildApiUrl(url), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  })

  const contentType = response.headers.get('content-type')
  const responseBody = contentType?.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const error = new Error(
      typeof responseBody === 'string'
        ? responseBody
        : responseBody?.message ||
            `API request failed with status ${response.status}`
    )
    error.status = response.status
    error.body = responseBody
    throw error
  }

  return responseBody
}

export const apiMultipartRequest = async (url, formData, options = {}) => {
  const accessToken = await getAccessToken()

  const response = await fetch(buildApiUrl(url), {
    ...options,
    method: options.method || 'POST',
    body: formData,
    headers: {
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  })

  const contentType = response.headers.get('content-type')
  const responseBody = contentType?.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const error = new Error(
      typeof responseBody === 'string'
        ? responseBody
        : responseBody?.message ||
            `API request failed with status ${response.status}`
    )
    error.status = response.status
    error.body = responseBody
    throw error
  }

  return responseBody
}
