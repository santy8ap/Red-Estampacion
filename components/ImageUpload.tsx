'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'
import { Upload, X, ChevronLeft, ChevronRight } from 'lucide-react'

type ImageUploadProps = {
    value: string[]
    onChange: (urls: string[]) => void
    maxFiles?: number
}

export default function ImageUpload({
    value = [],
    onChange,
    maxFiles = 5
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    // Handle Cloudinary uploads
    const handleCloudinaryUpload = (result: any) => {
        if (result.event === 'success') {
            const imageUrl = result.info.secure_url
            onChange([...value, imageUrl])
            toast.success('Imagen subida exitosamente')
        }
    }

    // Handle drag and drop for additional uploads
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return
        if (value.length >= maxFiles) {
            toast.error(`Máximo ${maxFiles} imágenes permitidas`)
            return
        }

        setUploading(true)
        const uploadedUrls: string[] = []
        const loadingToast = toast.loading(`Subiendo ${acceptedFiles.length} imagen(es)...`)

        for (let i = 0; i < acceptedFiles.length; i++) {
            const file = acceptedFiles[i]
            setUploadProgress(((i + 1) / acceptedFiles.length) * 100)

            try {
                // Convert file to base64
                const reader = new FileReader()
                const base64Promise = new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string)
                    reader.onerror = reject
                    reader.readAsDataURL(file)
                })

                const base64 = await base64Promise

                // Upload via our API route
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: base64,
                        folder: 'red-estampacion/products'
                    }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Error al subir imagen')
                }

                const data = await response.json()
                uploadedUrls.push(data.url)
                toast.success(`✅ ${file.name} subida`, { duration: 2000 })
            } catch (error) {
                console.error('Error uploading image:', error)
                toast.error(`❌ Error al subir ${file.name}`)
            }
        }

        if (uploadedUrls.length > 0) {
            onChange([...value, ...uploadedUrls])
            toast.success(`${uploadedUrls.length} imagen(es) subida(s) exitosamente`, { id: loadingToast })
        } else {
            toast.error('No se pudieron subir las imágenes', { id: loadingToast })
        }

        setUploading(false)
        setUploadProgress(0)
    }, [value, onChange, maxFiles])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
        },
        maxFiles: maxFiles - value.length,
        disabled: uploading || value.length >= maxFiles
    })

    const removeImage = (index: number) => {
        const newImages = value.filter((_, i) => i !== index)
        onChange(newImages)
        toast.success('Imagen removida')
    }

    const moveImage = (from: number, to: number) => {
        const newImages = [...value]
        const [removed] = newImages.splice(from, 1)
        newImages.splice(to, 0, removed)
        onChange(newImages)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                    Imágenes del producto ({value.length}/{maxFiles})
                </label>
                {value.length > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        ✅ {value.length} cargadas
                    </span>
                )}
            </div>

            {/* Preview Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {value.map((url, index) => (
                        <div
                            key={`${url}-${index}`}
                            className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-red-500 transition"
                        >
                            <Image
                                src={url}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => moveImage(index, index - 1)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                                        title="Mover a la izquierda"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                    title="Eliminar"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {index < value.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={() => moveImage(index, index + 1)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                                        title="Mover a la derecha"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Badge */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-semibold">
                                    Principal
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Cloudinary Widget & Dropzone */}
            {value.length < maxFiles && (
                <div className="space-y-4">
                    {/* Cloudinary Upload Widget */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Subir con Cloudinary</h3>
                        <CldUploadWidget
                            uploadPreset="red_estampacion"
                            onSuccess={handleCloudinaryUpload}
                            options={{
                                maxFiles: maxFiles - value.length,
                                folder: 'red-estampacion/products',
                                sources: ['local', 'url', 'camera'],
                                multiple: true,
                                showPoweredBy: false,
                                clientAllowedFormats: ['jpg', 'png', 'webp', 'gif'],
                                maxFileSize: 10485760, // 10MB
                                cropping: true,
                                croppingAspectRatio: 1,
                                croppingShowDimensions: true,
                                croppingValidateDimensions: true,
                            }}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition font-semibold"
                                >
                                    <Upload className="w-5 h-5" />
                                    Seleccionar imágenes
                                </button>
                            )}
                        </CldUploadWidget>
                    </div>

                    {/* Dropzone Alternative */}
                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                            ${isDragActive
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300 hover:border-red-400 bg-gray-50 hover:bg-gray-100'
                            }
                            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <input {...getInputProps()} />

                        {uploading ? (
                            <div className="space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                                <p className="text-gray-600 font-medium">Subiendo... {Math.round(uploadProgress)}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto overflow-hidden">
                                    <div
                                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ) : isDragActive ? (
                            <div className="space-y-2">
                                <Upload className="mx-auto h-12 w-12 text-red-500" />
                                <p className="text-red-600 font-semibold">¡Suelta las imágenes aquí!</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="text-gray-600">
                                    <span className="font-semibold text-red-600">Click para seleccionar</span> o arrastra imágenes
                                </p>
                                <p className="text-xs text-gray-500">
                                    JPG, PNG, WebP, GIF • Máximo 10MB
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {value.length >= maxFiles && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 text-sm">
                    ⚠️ Máximo de imágenes alcanzado ({maxFiles})
                </div>
            )}
        </div>
    )
}