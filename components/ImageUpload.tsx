'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

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

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return

        setUploading(true)
        const uploadedUrls: string[] = []

        for (let i = 0; i < acceptedFiles.length; i++) {
            const file = acceptedFiles[i]
            setUploadProgress((i / acceptedFiles.length) * 100)

            try {
                // Convertir a base64
                const base64 = await convertToBase64(file)

                // Subir a Cloudinary
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: base64,
                        folder: 'red-estampacion'
                    }),
                })

                if (!response.ok) throw new Error('Error al subir imagen')

                const data = await response.json()
                uploadedUrls.push(data.url)
            } catch (error) {
                console.error('Error uploading image:', error)
                alert(`Error al subir ${file.name}`)
            }
        }

        onChange([...value, ...uploadedUrls])
        setUploading(false)
        setUploadProgress(0)
    }, [value, onChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: maxFiles - value.length,
        disabled: uploading || value.length >= maxFiles
    })

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = error => reject(error)
        })
    }

    const removeImage = (index: number) => {
        const newImages = value.filter((_, i) => i !== index)
        onChange(newImages)
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
                <label className="block text-sm font-medium text-gray-700">
                    Imágenes del producto
                </label>
                <span className="text-sm text-gray-500">
                    {value.length} / {maxFiles} imágenes
                </span>
            </div>

            {/* Preview Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {value.map((url, index) => (
                        <div
                            key={`${url}-${index}`}
                            className="relative group aspect-square"
                        >
                            <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                            />

                            {/* Overlay con opciones */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                {/* Mover a la izquierda */}
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => moveImage(index, index - 1)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                                        title="Mover a la izquierda"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                )}

                                {/* Eliminar */}
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                    title="Eliminar"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Mover a la derecha */}
                                {index < value.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={() => moveImage(index, index + 1)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                                        title="Mover a la derecha"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Badge de imagen principal */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                    Principal
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Dropzone */}
            {value.length < maxFiles && (
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
                            <p className="text-gray-600">Subiendo imágenes... {Math.round(uploadProgress)}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                                <div
                                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    ) : isDragActive ? (
                        <div className="space-y-2">
                            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-red-600 font-semibold">¡Suelta las imágenes aquí!</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600">
                                <span className="font-semibold text-red-600">Click para seleccionar</span> o arrastra las imágenes aquí
                            </p>
                            <p className="text-xs text-gray-500">
                                JPG, PNG, WebP hasta 10MB cada una
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}