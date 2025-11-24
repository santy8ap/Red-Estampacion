'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Heart } from 'lucide-react'

export default function Footer() {
  const { locale, t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Red Estampación
              </span>
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              {locale === 'es'
                ? 'Las mejores camisas estampadas con diseños únicos y calidad premium.'
                : 'The best printed shirts with unique designs and premium quality.'}
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/10 p-2.5 rounded-full hover:bg-red-600 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4">
              {locale === 'es' ? 'Enlaces' : 'Links'}
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/productos', label: locale === 'es' ? 'Productos' : 'Products' },
                { href: '/colecciones', label: locale === 'es' ? 'Colecciones' : 'Collections' },
                { href: '/mis-ordenes', label: locale === 'es' ? 'Mis Órdenes' : 'My Orders' },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4">
              {locale === 'es' ? 'Información' : 'Information'}
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>{locale === 'es' ? 'Sobre Nosotros' : 'About Us'}</li>
              <li>{locale === 'es' ? 'Envíos' : 'Shipping'}</li>
              <li>{locale === 'es' ? 'Devoluciones' : 'Returns'}</li>
              <li>{locale === 'es' ? 'Términos y Condiciones' : 'Terms & Conditions'}</li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4">
              {locale === 'es' ? 'Contacto' : 'Contact'}
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2 hover:text-white transition">
                <Mail className="w-4 h-4 text-red-500" />
                info@redestampacion.com
              </li>
              <li className="flex items-center gap-2 hover:text-white transition">
                <Phone className="w-4 h-4 text-red-500" />
                +57 301 441 29 67
              </li>
              <li className="flex items-center gap-2 hover:text-white transition">
                <MapPin className="w-4 h-4 text-red-500" />
                {locale === 'es' ? 'Medellín, Colombia' : 'Medellín, Colombia'}
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-700 mt-8 pt-8 text-center"
        >
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
            &copy; {currentYear} Red Estampación.{' '}
            {locale === 'es' ? 'Hecho con' : 'Made with'}{' '}
            <Heart className="w-4 h-4 text-red-500 fill-current" />{' '}
            {locale === 'es' ? 'en Medellin Colombia' : 'in Medellin Colombia'}.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}