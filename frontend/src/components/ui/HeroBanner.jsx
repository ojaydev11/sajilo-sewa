import React from 'react'
import { useTranslation } from 'react-i18next'
import { MountainIllustration, BoudhanathIcon, SwayambhunathIcon } from './NepaliIcons'
import { Search } from 'lucide-react'

const HeroBanner = ({ onSearch }) => {
  const { t, i18n } = useTranslation()
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(searchQuery)
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 temple-decoration">
      {/* Mountain Background */}
      <div className="absolute inset-0 opacity-30">
        <MountainIllustration className="w-full h-full object-cover" />
      </div>
      
      {/* Cultural Icons Floating */}
      <div className="absolute top-4 left-4 opacity-20">
        <BoudhanathIcon className="w-16 h-16" />
      </div>
      <div className="absolute top-8 right-8 opacity-20">
        <SwayambhunathIcon className="w-20 h-20" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              {i18n.language === 'ne' ? (
                <>
                  <span className="text-primary block mb-2">नमस्ते!</span>
                  <span className="text-gray-800">हामी तपाईंलाई कसरी सहायता गर्न सक्छौं?</span>
                </>
              ) : (
                <>
                  <span className="text-primary block mb-2">Namaste!</span>
                  <span className="text-gray-800">How can we assist you?</span>
                </>
              )}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {i18n.language === 'ne' 
                ? 'काठमाडौं उपत्यकामा भरपर्दो स्थानीय सेवा प्रदायकहरूसँग जोडिनुहोस्। तुरुन्त बुक गर्नुहोस्, सुरक्षित भुक्तानी गर्नुहोस्।'
                : 'Connect with trusted local service providers across Kathmandu Valley. Book instantly, pay securely.'
              }
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="nepal-search">
              <div className="flex items-center">
                <Search className="w-6 h-6 text-gray-400 mr-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={i18n.language === 'ne' 
                    ? 'सेवा खोज्नुहोस्... (जस्तै: प्लम्बर, इलेक्ट्रिसियन)'
                    : 'Search for services... (e.g. plumber, electrician)'
                  }
                  className="flex-1 bg-transparent border-none outline-none text-lg placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="nepal-button ml-4"
                >
                  {i18n.language === 'ne' ? 'खोज्नुहोस्' : 'Search'}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="nepal-button-outline">
              {i18n.language === 'ne' ? 'आपतकालीन सेवा' : 'Emergency Service'}
            </button>
            <button className="nepal-button-outline">
              {i18n.language === 'ne' ? 'लोकप्रिय सेवाहरू' : 'Popular Services'}
            </button>
            <button className="nepal-button-outline">
              {i18n.language === 'ne' ? 'नजिकका प्रदायकहरू' : 'Nearby Providers'}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  )
}

export default HeroBanner