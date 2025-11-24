'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { Truck, Shield, DollarSign, Award } from 'lucide-react'

export default function FeaturesSection() {
    const { t } = useLanguage()

    const features = [
        {
            icon: Truck,
            title: t('home.features.shipping.title'),
            desc: t('home.features.shipping.desc'),
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: Shield,
            title: t('home.features.secure.title'),
            desc: t('home.features.secure.desc'),
            color: 'from-green-500 to-green-600'
        },
        {
            icon: DollarSign,
            title: t('home.features.price.title'),
            desc: t('home.features.price.desc'),
            color: 'from-yellow-500 to-yellow-600'
        },
        {
            icon: Award,
            title: t('home.features.quality.title'),
            desc: t('home.features.quality.desc'),
            color: 'from-red-500 to-red-600'
        }
    ]

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="text-center group"
                        >
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                <feature.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}