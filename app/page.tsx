'use client'

import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import {
  Sparkles,
  TrendingUp,
  Shield,
  Truck,
  ShoppingCart,
  Star,
  Award,
  CheckCircle,
  ArrowRight,
  Shirt,
  Users,
  Package,
  Heart,
  Zap,
  Target,
  Crown
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const categories = [
  {
    name: 'Casual',
    icon: Shirt,
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Estilo diario y cómodo'
  },
  {
    name: 'Deportiva',
    icon: Zap,
    gradient: 'from-green-500 to-emerald-500',
    description: 'Rendimiento y comodidad'
  },
  {
    name: 'Formal',
    icon: Crown,
    gradient: 'from-purple-500 to-pink-500',
    description: 'Elegancia profesional'
  },
  {
    name: 'Vintage',
    icon: Target,
    gradient: 'from-orange-500 to-red-500',
    description: 'Clásico atemporal'
  },
  {
    name: 'Estampada',
    icon: Sparkles,
    gradient: 'from-yellow-500 to-amber-500',
    description: 'Diseños únicos'
  },
]

const stats = [
  { value: '10K+', label: 'Clientes Felices', icon: Users },
  { value: '5K+', label: 'Productos Vendidos', icon: Package },
  { value: '4.9', label: 'Calificación Promedio', icon: Star },
  { value: '98%', label: 'Satisfacción', icon: Heart },
]

const testimonials = [
  {
    name: 'María González',
    role: 'Diseñadora',
    content: 'La calidad de las camisas es excepcional. Diseños únicos que no encuentras en otro lugar.',
    rating: 5,
    image: null
  },
  {
    name: 'Carlos Ruiz',
    role: 'Empresario',
    content: 'Excelente servicio al cliente y envíos rápidos. Totalmente recomendado.',
    rating: 5,
    image: null
  },
  {
    name: 'Ana López',
    role: 'Estudiante',
    content: 'Precios accesibles y gran variedad. Mi tienda favorita para camisas casuales.',
    rating: 5,
    image: null
  },
]

export default function Home() {
  const { t } = useLanguage()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const testimonialsRef = useRef(null)

  const statsInView = useInView(statsRef, { once: true, margin: '-100px' })
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: '-100px' })

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.8])

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data.slice(0, 6))
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading products:', error)
        setLoading(false)
      })
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterStatus('loading')

    // Simular envío (reemplazar con API real)
    setTimeout(() => {
      setNewsletterStatus('success')
      setEmail('')
      setTimeout(() => setNewsletterStatus('idle'), 3000)
    }, 1500)
  }

  const features = [
    {
      icon: Truck,
      title: t('home.features.shipping.title'),
      description: t('home.features.shipping.desc'),
      color: 'blue'
    },
    {
      icon: Shield,
      title: t('home.features.secure.title'),
      description: t('home.features.secure.desc'),
      color: 'green'
    },
    {
      icon: TrendingUp,
      title: t('home.features.price.title'),
      description: t('home.features.price.desc'),
      color: 'yellow'
    },
    {
      icon: Award,
      title: t('home.features.quality.title'),
      description: t('home.features.quality.desc'),
      color: 'red'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section con Parallax */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white overflow-hidden"
      >
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-lg rounded-full text-sm font-semibold border border-white/30"
            >
              <Sparkles className="w-4 h-4" />
              {t('home.hero.badge')}
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            >
              <span className="inline-block bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
                {t('home.hero.title')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              variants={itemVariants}
              className="max-w-3xl mx-auto mb-10"
            >
              <p className="text-xl md:text-2xl mb-3 text-red-100">
                {t('home.hero.subtitle')}
              </p>
              <p className="text-lg md:text-xl font-semibold text-white">
                {t('home.hero.description')}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/productos"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/50"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {t('home.hero.cta')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/colecciones"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30"
                >
                  {t('home.hero.explore')}
                  <Sparkles className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-wrap justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Envío gratis en compras +$50</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Devoluciones en 30 días</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Pago 100% seguro</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-xs font-medium">Desliza para explorar</span>
            <motion.div
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-3 bg-white rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="relative bg-white py-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow"
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={statsInView ? { opacity: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <div className="text-4xl font-black text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex items-center justify-center w-14 h-14 mb-4 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-xl`}
                  >
                    <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-current" />
            Más Populares
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {t('home.featured.title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('home.featured.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-80 rounded-2xl mb-4" />
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-2" />
                <div className="bg-gray-200 h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProducts.map((product: any, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-500">{t('common.noProducts')}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Ver Todos los Productos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              {t('home.categories.title')}
            </h2>
            <p className="text-gray-400 text-lg">
              {t('home.categories.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: -2 }}
              >
                <Link
                  href={`/productos?category=${category.name}`}
                  className="block group"
                >
                  <div className={`relative bg-gradient-to-br ${category.gradient} p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                      }} />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10 mb-4"
                    >
                      <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <category.icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="relative z-10 text-center">
                      <h3 className="font-bold text-white text-lg mb-1">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {category.description}
                      </p>
                    </div>

                    {/* Hover Effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.05 }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Star className="w-4 h-4 fill-current" />
              Testimonios
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Miles de clientes satisfechos confían en nosotros
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl p-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Suscríbete a Nuestro Newsletter
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Recibe ofertas exclusivas, nuevos productos y contenido especial directamente en tu correo
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none text-gray-900"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {newsletterStatus === 'loading' ? 'Enviando...' : 'Suscribirse'}
                </motion.button>
              </div>

              {newsletterStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center justify-center gap-2 text-green-600"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Suscripción exitosa</span>
                </motion.div>
              )}
            </form>

            <p className="text-sm text-gray-500 mt-4">
              No spam, solo las mejores ofertas y novedades
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden shadow-2xl"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0]
              }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Award className="w-10 h-10" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-red-100 max-w-2xl mx-auto">
              {t('home.cta.subtitle')}
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/productos"
                className="inline-flex items-center gap-3 bg-white text-red-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/50"
              >
                <ShoppingCart className="w-6 h-6" />
                {t('home.cta.button')}
                <ArrowRight className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}