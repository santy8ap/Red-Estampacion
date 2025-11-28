'use client'

import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, Lock, ArrowRight, Shirt, Star, Zap } from "lucide-react"

function SignInContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl)
    }
  }, [status, router, callbackUrl])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-red-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-red-600 border-t-red-300 rounded-full"
        />
      </div>
    )
  }

  if (status === "authenticated") {
    return null
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
      />

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="hidden lg:block space-y-8"
          >
            <motion.div variants={item}>
              <h1 className="text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Red Estampación
                </span>
              </h1>
              <p className="text-xl text-gray-300">
                Descubre la mejor colección de ropa estampada con diseños únicos y calidad premium
              </p>
            </motion.div>

            <motion.div variants={item} className="space-y-4">
              {[
                {
                  icon: Shirt,
                  title: "Diseños Únicos",
                  desc: "Colecciones exclusivas y personalizadas"
                },
                {
                  icon: Star,
                  title: "Calidad Premium",
                  desc: "Materiales de la más alta calidad"
                },
                {
                  icon: Zap,
                  title: "Envío Rápido",
                  desc: "Entregas ágiles a todo el país"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  className="flex gap-4 items-start"
                >
                  <div className="bg-red-600/20 p-3 rounded-lg">
                    <feature.icon className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-gray-400">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="bg-gray-900/50 backdrop-blur-xl border border-red-600/20 rounded-2xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-block mb-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shirt className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">Bienvenido</h2>
                <p className="text-gray-400">Inicia sesión para acceder a tu cuenta</p>
              </div>

              {/* Google Sign In */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("google", { callbackUrl })}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl group mb-6"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continuar con Google</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900/50 text-gray-400">
                    Acceso seguro
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex gap-2 items-start">
                  <Lock className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p>Tu información está protegida con encriptación SSL</p>
                </div>
                <div className="flex gap-2 items-start">
                  <Mail className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p>Usamos Google para garantizar tu privacidad</p>
                </div>
              </div>

              {/* Terms */}
              <p className="text-center text-xs text-gray-500 mt-6">
                Al iniciar sesión, aceptas nuestros{" "}
                <Link href="#" className="text-red-500 hover:text-red-400 transition">
                  términos y condiciones
                </Link>
              </p>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-400 text-sm mt-6">
              ¿Primera vez aquí?{" "}
              <Link href="/productos" className="text-red-500 hover:text-red-400 font-semibold transition">
                Explora nuestros productos
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-red-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-red-600 border-t-red-300 rounded-full"
        />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}