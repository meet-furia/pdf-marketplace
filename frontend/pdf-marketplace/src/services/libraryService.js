import { apiRequest } from './apiClient'

const LIBRARY_API = '/api/v1/customer/library'

export const getMyLibrary = () => apiRequest(LIBRARY_API)

export const checkProductAccess = (productId) =>
  apiRequest(`${LIBRARY_API}/products/${productId}/access`)

export const getProductDownload = (productId) =>
  apiRequest(`${LIBRARY_API}/products/${productId}/download`)

export const getPurchasedPdfDownloadUrl = async (productId) => {
  const response = await getProductDownload(productId)
  const download = response.data

  if (!download?.access) {
    throw new Error('You do not have access to download this product file.')
  }

  if (!download.downloadUrl) {
    throw new Error('Download link is not available for this product file.')
  }

  return download.downloadUrl
}

export const openSignedDownloadUrl = (downloadUrl) => {
  const downloadWindow = window.open(downloadUrl, '_blank', 'noopener,noreferrer')

  if (downloadWindow) {
    downloadWindow.opener = null
    return
  }

  const downloadLink = document.createElement('a')
  downloadLink.href = downloadUrl
  downloadLink.target = '_blank'
  downloadLink.rel = 'noopener noreferrer'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}
