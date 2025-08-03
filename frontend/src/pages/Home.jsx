import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HeroBanner from '../components/ui/HeroBanner'
import { ServiceCategoryCard, PopularServiceCard } from '../components/ui/ServiceCard'
import { ServiceIcons, NepalieBusIcon } from '../components/ui/NepaliIcons'
import { 
  Star,
  Shield,
  Clock,
  MapPin,
  ArrowRight,
  Users,
  Award,
  Zap
} from 'lucide-react'

const Home = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const serviceCategories = [
    { 
      name: 'Plumber', 
      nameNe: 'प्लम्बर',
      description: 'Water pipe repairs & installations',
      descriptionNe: 'पानीको पाइप मर्मत र स्थापना'
    },
    { 
      name: 'Electrician', 
      nameNe: 'इलेक्ट्रिसियन',
      description: 'Electrical repairs & wiring',
      descriptionNe: 'बिजुली मर्मत र तार जडान'
    },
    { 
      name: 'Cleaner', 
      nameNe: 'सफाई कर्मचारी',
      description: 'House cleaning services',
      descriptionNe: 'घर सफाई सेवाहरू'
    },
    { 
      name: 'Tutor', 
      nameNe: 'शिक्षक',
      description: 'Educational tutoring',
      descriptionNe: 'शैक्षिक ट्यूशन'
    },
    { 
      name: 'Mechanic', 
      nameNe: 'मेकानिक',
      description: 'Vehicle repairs',
      descriptionNe: 'गाडी मर्मत'
    },
    { 
      name: 'Handyman', 
      nameNe: 'हस्तकारी',
      description: 'General repairs & maintenance',
      descriptionNe: 'सामान्य मर्मत र मर्मतसम्भार'
    }
  ]

  const features = [
    {
      icon: Shield,
      title: i18n.language === 'ne' ? 'भरपर्दो प्रदायकहरू' : 'Trusted Providers',
      description: i18n.language === 'ne' 
        ? 'सबै सेवा प्रदायकहरू प्रमाणित र ग्राहकहरूद्वारा मूल्याङ्कन गरिएका छन्'
        : 'All service providers are verified and rated by customers'
    },
    {
      icon: Star,
      title: i18n.language === 'ne' ? 'गुणस्तरीय सेवा' : 'Quality Service',
      description: i18n.language === 'ne'
        ? 'वास्तविक ग्राहकहरूबाट समीक्षा र मूल्याङ्कनहरू पढ्नुहोस्'
        : 'Read reviews and ratings from real customers'
    },
    {
      icon: Clock,
      title: i18n.language === 'ne' ? 'छिटो बुकिङ' : 'Quick Booking',
      description: i18n.language === 'ne'
        ? 'लचिलो समयतालिकासँग तुरुन्त सेवाहरू बुक गर्नुहोस्'
        : 'Book services instantly with flexible scheduling'
    },
    {
      icon: MapPin,
      title: i18n.language === 'ne' ? 'स्थानीय विशेषज्ञहरू' : 'Local Experts',
      description: i18n.language === 'ne'
        ? 'तपाईंको छिमेकमा सेवा प्रदायकहरू फेला पार्नुहोस्'
        : 'Find service providers in your neighborhood'
    }
  ]

  const stats = [
    {
      icon: Users,
      value: '1000+',
      label: i18n.language === 'ne' ? 'खुसी ग्राहकहरू' : 'Happy Customers'
    },
    {
      icon: Award,
      value: '500+',
      label: i18n.language === 'ne' ? 'प्रमाणित प्रदायकहरू' : 'Verified Providers'
    },
    {
      icon: Zap,
      value: '24/7',
      label: i18n.language === 'ne' ? 'सेवा उपलब्ध' : 'Service Available'
    },
    {
      icon: Star,
      value: '4.8',
      label: i18n.language === 'ne' ? 'औसत रेटिङ' : 'Average Rating'
    }
  ]

  const handleSearch = (query) => {
    navigate(`/services?search=${encodeURIComponent(query)}`)
  }

  const handleServiceClick = (service) => {
    navigate(`/services?category=${service.name}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroBanner onSearch={handleSearch} />

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {i18n.language === 'ne' ? 'लोकप्रिय सेवाहरू' : 'Popular Services'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {i18n.language === 'ne' 
                ? 'विभिन्न व्यावसायिक सेवाहरूबाट छनोट गर्नुहोस्'
                : 'Choose from a wide range of professional services'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {serviceCategories.map((service, index) => (
              <ServiceCategoryCard
                key={index}
                service={service}
                onClick={handleServiceClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <IconComponent className="text-primary" size={32} />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {i18n.language === 'ne' ? 'किन SewaGo छान्नुहोस्?' : 'Why Choose SewaGo?'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {i18n.language === 'ne'
                ? 'हामी स्थानीय सेवाहरू फेला पार्न र बुक गर्न सरल र सुरक्षित बनाउँछौं'
                : 'We make finding and booking local services simple and secure'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="nepal-card p-6 text-center group hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 nepal-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <div className="nepal-card p-12 bg-white/90 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {i18n.language === 'ne' ? 'सुरु गर्न तयार हुनुहुन्छ?' : 'Ready to Get Started?'}
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {i18n.language === 'ne'
                ? 'हजारौं सन्तुष्ट ग्राहकहरूसँग सामेल हुनुहोस् जसले आफ्ना सेवा आवश्यकताहरूको लागि SewaGo मा भरोसा गर्छन्'
                : 'Join thousands of satisfied customers who trust SewaGo for their service needs'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="nepal-button text-lg px-8 py-4">
                {i18n.language === 'ne' ? 'अहिले नै साइन अप गर्नुहोस्' : 'Sign Up Now'}
              </Link>
              <Link to="/providers" className="nepal-button-outline text-lg px-8 py-4">
                {i18n.language === 'ne' ? 'प्रदायकहरू ब्राउज गर्नुहोस्' : 'Browse Providers'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

