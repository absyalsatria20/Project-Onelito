export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    // Fallback jika Cloudinary belum dikonfigurasi (menggunakan base64 lokal)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  // Tentukan resource type otomatis (image atau video)
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image'
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || 'Gagal mengunggah ke Cloudinary')
  }

  const data = await response.json()
  let url = data.secure_url

  // Otomatis tambahkan transformasi optimasi kompresi (f_auto, q_auto) untuk gambar
  if (resourceType === 'image' && url.includes('/upload/')) {
    url = url.replace('/upload/', '/upload/f_auto,q_auto/')
  }

  return url
}
