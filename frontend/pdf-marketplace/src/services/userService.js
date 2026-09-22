import { apiRequest } from './apiClient'

export const registerAuthenticatedUser = (user, accessToken) => {
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email

  return apiRequest('/api/v1/customer/auth/register', {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
    method: 'POST',
    body: JSON.stringify({
      name,
      emailVerified: Boolean(user.email_confirmed_at),
    }),
  })
}
