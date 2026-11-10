import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID || ''
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || ''
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || ''
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'onelito-fish'
const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || ''

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { filename, contentType } = req.body
    if (!filename || !contentType) {
      return res.status(400).json({ error: 'Missing filename or contentType' })
    }

    const key = `fish-${Date.now()}-${filename}`
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })

    const uploadUrl = await getSignedUrl(S3, command, { expiresIn: 300 })
    const publicUrl = `${R2_PUBLIC_URL}/${key}`

    return res.status(200).json({ uploadUrl, publicUrl })
  } catch (err: any) {
    console.error('R2 Presigned URL error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error' })
  }
}
