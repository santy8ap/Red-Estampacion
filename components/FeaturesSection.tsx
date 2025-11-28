'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { Truck, Shield, DollarSign, Award, ArrowRight } from 'lucide-react'

export default function FeaturesSection() {
    const { t, locale } = useLanguage()

    const features = [
        {
            icon: Truck,
            title: t('home.features.shipping.title'),
            desc: t('home.features.shipping.desc'),
            color: 'from-blue-500 to-blue-600',
            stats: '24-48h'
        },
        {
            icon: Shield,
            title: t('home.features.secure.title'),
            desc: t('home.features.secure.desc'),
            color: 'from-green-500 to-green-600',
            stats: '100%'
        },
        {
            icon: DollarSign,
            title: t('home.features.price.title'),
            desc: t('home.features.price.desc'),
            color: 'from-yellow-500 to-yellow-600',
            stats: locale === 'es' ? 'Mejores' : 'Best'
        },
        {
            icon: Award,
            title: t('home.features.quality.title'),
            desc: t('home.features.quality.desc'),
            color: 'from-red-500 to-red-600',
            stats: '5 ⭐'
        }
    ]

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/50 rounded-full blur-3xl -z-0"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-0"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                            {locale === 'es' ? 'Por qué elegirnos' : 'Why choose us'}
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {locale === 'es' 
                            ? 'Ofrecemos la mejor experiencia de compra con calidad premium y servicio excepcional'
                            : 'We offer the best shopping experience with premium quality and exceptional service'
                        }
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200">
                                {/* Icon Container */}
                                <motion.div
                                    whileHover={{ rotate: 12, scale: 1.1 }}
                                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:shadow-lg shadow-md transition-all`}
                                >
                                    <feature.icon className="w-10 h-10 text-white" />
                                </motion.div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                    {feature.desc}
                                </p>

                                {/* Stats */}
                                <div className="pt-6 border-t border-gray-100">
                                    <p className="text-2xl font-bold text-red-600">
                                        {feature.stats}
                                    </p>
                                </div>

                                {/* Arrow indicator */}
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-5 h-5 text-red-600" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-block bg-gradient-to-r from-red-600 to-red-700 rounded-full px-8 py-4 shadow-lg">
                        <p className="text-white font-semibold">
                            {locale === 'es' 
                                ? '✨ Más de 1000+ clientes satisfechos' 
                                : '✨ Over 1000+ satisfied customers'
                            }
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}