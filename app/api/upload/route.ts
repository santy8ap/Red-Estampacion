import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación (opcional, pero recomendado para admin)
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { image, folder = 'red-estampacion' } = body

    if (!image) {
      return NextResponse.json(
        { error: 'No se proporcionó imagen' },
        { status: 400 }
      )
    }

    // Subir a Cloudinary con optimizaciones
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })

    return NextResponse.json({
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      width: uploadResponse.width,
      height: uploadResponse.height,
      format: uploadResponse.format
    })
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500 }
    )
  }
}

// DELETE para eliminar imagen de Cloudinary (opcional)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json(
        { error: 'No se proporcionó publicId' },
        { status: 400 }
      )
    }

    const result = await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return NextResponse.json(
      { error: 'Error al eliminar imagen' },
      { status: 500 }
    )
  }
}