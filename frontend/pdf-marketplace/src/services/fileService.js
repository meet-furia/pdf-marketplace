const SUPPORTED_FILE_TYPES = new Set(['PRODUCT', 'THUMBNAIL'])
const MAX_FILE_SIZE = 10 * 1024 * 1024
const VIDEO_EXTENSIONS = new Set([
  '3g2',
  '3gp',
  'asf',
  'avi',
  'flv',
  'm2ts',
  'm4v',
  'mkv',
  'mov',
  'mp4',
  'mpeg',
  'mpg',
  'mts',
  'ogv',
  'rm',
  'rmvb',
  'ts',
  'vob',
  'webm',
  'wmv',
])

// Returns the browser-provided MIME type or a safe generic fallback.
const getContentType = (file) => file.type || 'application/octet-stream'

// Extracts a lowercase extension from a filename.
const getExtension = (fileName = '') =>
  fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : ''

// Guards callers against unsupported validation modes.
const validateFileType = (fileType) => {
  if (!SUPPORTED_FILE_TYPES.has(fileType)) {
    throw new Error('fileType must be PRODUCT or THUMBNAIL')
  }
}

// Validates a product or thumbnail file before it is sent to the backend.
export const validateUploadFile = (file, fileType) => {
  validateFileType(fileType)

  if (!file) {
    throw new Error('Please select a file to upload')
  }

  const contentType = getContentType(file)

  // Some browsers provide only application/octet-stream, so extension checking
  // supplements MIME checking for common video formats.
  if (
    fileType === 'PRODUCT' &&
    (contentType.startsWith('video/') ||
      VIDEO_EXTENSIONS.has(getExtension(file.name)))
  ) {
    throw new Error('Video files are not supported yet')
  }

  if (fileType === 'THUMBNAIL' && !contentType.startsWith('image/')) {
    throw new Error('Please select a valid image thumbnail')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be 10 MB or less')
  }
}
