export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8081'

export const getImageUrl = imagePath => {
  if (
    !imagePath ||
    imagePath.startsWith('blob:') ||
    imagePath.startsWith('http')
  ) {
    return imagePath || ''
  }

  return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}