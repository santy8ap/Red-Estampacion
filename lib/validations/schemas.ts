import * as yup from 'yup'

// ============================================
// VALIDACIONES DE PRODUCTO
// ============================================
export const productSchema = yup.object({
  name: yup.string()
    .trim()
    .required('El nombre es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  
  description: yup.string()
    .trim()
    .required('La descripción es requerida')
    .min(10, 'Mínimo 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),
  
  price: yup.number()
    .typeError('El precio debe ser un número')
    .required('El precio es requerido')
    .positive('El precio debe ser positivo')
    .max(99999, 'Precio máximo: $99,999'),
  
  category: yup.string()
    .required('La categoría es requerida'),
  
  stock: yup.number()
    .typeError('El stock debe ser un número')
    .required('El stock es requerido')
    .integer('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .max(9999, 'Stock máximo: 9999'),
  
  images: yup.mixed(),
  sizes: yup.mixed(),
  colors: yup.mixed(),
  featured: yup.boolean(),
  active: yup.boolean(),
})

// ============================================
// VALIDACIONES DE ORDEN/CHECKOUT
// ============================================
export const checkoutSchema = yup.object({
  shippingName: yup.string()
    .trim()
    .required('Nombre completo requerido')
    .min(3, 'Mínimo 3 caracteres'),
  
  shippingEmail: yup.string()
    .trim()
    .required('Email requerido')
    .email('Email inválido'),
  
  shippingAddress: yup.string()
    .trim()
    .required('Dirección requerida')
    .min(5, 'Dirección muy corta'),
  
  shippingCity: yup.string()
    .trim()
    .required('Ciudad requerida')
    .min(3, 'Ciudad inválida'),
  
  shippingZip: yup.string()
    .trim()
    .required('Código postal requerido')
    .matches(/^[0-9]{5}$/, 'Código postal debe tener 5 dígitos'),
})

// ============================================
// VALIDACIONES DE FILTROS
// ============================================
export const filterSchema = yup.object({
  category: yup.string().optional(),
  color: yup.string().optional(),
  size: yup.string().optional(),
  minPrice: yup.number().min(0).optional(),
  maxPrice: yup.number().max(99999).optional(),
  search: yup.string().max(50).optional(),
  page: yup.number().min(1).optional(),
  limit: yup.number().min(1).max(50).optional(),
})

// ============================================
// HELPER PARA VALIDAR EN EL BACKEND
// ============================================
export async function validateRequest<T>(
  schema: yup.Schema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const validData = await schema.validate(data, { abortEarly: false })
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { success: false, errors: error.errors }
    }
    return { success: false, errors: ['Error de validación'] }
  }
}
