import React from 'react'
import { useTranslation } from 'react-i18next'
import { ServiceIcons } from './NepaliIcons'
import { ArrowRight, Star, MapPin, Clock } from 'lucide-react'

// Large service category card
export const ServiceCategoryCard = ({ service, onClick }) => {
  const { i18n } = useTranslation()
  const IconComponent = ServiceIcons[service.name] || ServiceIcons.Handyman

  return (
    <div 
      className="nepal-card p-6 cursor-pointer group"
      onClick={() => onClick && onClick(service)}
    >
      <div className="text-center">
        <div className="service-icon group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {i18n.language === 'ne' ? service.nameNe || service.name : service.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {i18n.language === 'ne' ? service.descriptionNe || service.description : service.description}
        </p>
        <div className="flex items-center justify-center text-primary font-medium">
          <span className="mr-2">
            {i18n.language === 'ne' ? 'हेर्नुहोस्' : 'View'}
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </div>
  )
}

// Compact service card for popular services
export const PopularServiceCard = ({ service, onClick }) => {
  const { i18n } = useTranslation()
  const IconComponent = ServiceIcons[service.name] || ServiceIcons.Handyman

  return (
    <div 
      className="nepal-card p-4 cursor-pointer group flex items-center"
      onClick={() => onClick && onClick(service)}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
        <IconComponent className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 mb-1">
          {i18n.language === 'ne' ? service.nameNe || service.name : service.name}
        </h4>
        <p className="text-sm text-gray-600">
          {service.providerCount || 0} {i18n.language === 'ne' ? 'प्रदायकहरू' : 'providers'}
        </p>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
    </div>
  )
}

// Service provider card
export const ServiceProviderCard = ({ provider, onClick }) => {
  const { i18n } = useTranslation()

  return (
    <div 
      className="nepal-card p-6 cursor-pointer group"
      onClick={() => onClick && onClick(provider)}
    >
      {/* Provider Avatar */}
      <div className="flex items-start mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center text-2xl font-bold text-primary mr-4">
          {provider.user?.full_name?.charAt(0) || 'P'}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {provider.user?.full_name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {provider.user?.location}
          </div>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-sm font-medium">{provider.rating || 0}</span>
              <span className="text-sm text-gray-500 ml-1">
                ({provider.total_reviews || 0})
              </span>
            </div>
            {provider.is_verified && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {i18n.language === 'ne' ? 'प्रमाणित' : 'Verified'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {JSON.parse(provider.skills || '[]').slice(0, 3).map((skill, index) => (
            <span 
              key={index}
              className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {provider.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-primary">
          NPR {provider.hourly_rate}/hr
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {provider.experience_years} {i18n.language === 'ne' ? 'वर्ष' : 'years'}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    </div>
  )
}

// Booking card for dashboard
export const BookingCard = ({ booking, onStatusChange }) => {
  const { i18n } = useTranslation()
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'paid': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    const statusMap = {
      'pending': i18n.language === 'ne' ? 'पेन्डिङ' : 'Pending',
      'confirmed': i18n.language === 'ne' ? 'पुष्टि भएको' : 'Confirmed',
      'in_progress': i18n.language === 'ne' ? 'प्रगतिमा' : 'In Progress',
      'completed': i18n.language === 'ne' ? 'पूरा भएको' : 'Completed',
      'cancelled': i18n.language === 'ne' ? 'रद्द गरिएको' : 'Cancelled',
      'paid': i18n.language === 'ne' ? 'भुक्तानी भएको' : 'Paid'
    }
    return statusMap[status] || status
  }

  return (
    <div className="nepal-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {booking.title}
          </h3>
          <p className="text-sm text-gray-600">
            #{booking.id} • {new Date(booking.scheduled_date).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
          {getStatusText(booking.status)}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-600">{booking.customer_location}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-600">
            {new Date(booking.scheduled_date).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Amount */}
      {booking.total_amount && (
        <div className="text-lg font-semibold text-primary mb-4">
          NPR {booking.total_amount}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button className="nepal-button-outline flex-1 text-sm py-2">
          {i18n.language === 'ne' ? 'विवरण हेर्नुहोस्' : 'View Details'}
        </button>
        {booking.status === 'pending' && (
          <button 
            className="nepal-button flex-1 text-sm py-2"
            onClick={() => onStatusChange && onStatusChange(booking.id, 'confirmed')}
          >
            {i18n.language === 'ne' ? 'पुष्टि गर्नुहोस्' : 'Confirm'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ServiceCategoryCard