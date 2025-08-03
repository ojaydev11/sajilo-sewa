import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, Clock, MapPin, User, DollarSign, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

const BookingForm = () => {
  const { providerId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  
  const [provider, setProvider] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    service_category_id: '',
    title: '',
    description: '',
    scheduled_date: '',
    scheduled_time: '',
    estimated_hours: 1,
    customer_location: user?.location || ''
  })

  const API_BASE_URL = 'http://localhost:5000/api'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (user?.user_type !== 'customer') {
      toast.error('Only customers can book services')
      navigate('/dashboard')
      return
    }

    fetchProviderDetails()
    fetchCategories()
  }, [providerId, isAuthenticated, user])

  const fetchProviderDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/providers/${providerId}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setProvider(data)
      } else {
        setError('Provider not found')
      }
    } catch (error) {
      setError('Failed to fetch provider details')
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services/categories`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // Validation
    if (!formData.service_category_id || !formData.title || !formData.description || 
        !formData.scheduled_date || !formData.scheduled_time || !formData.customer_location) {
      setError('Please fill in all required fields')
      setSubmitting(false)
      return
    }

    // Combine date and time
    const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}:00`)
    
    // Check if the date is in the future
    if (scheduledDateTime <= new Date()) {
      setError('Please select a future date and time')
      setSubmitting(false)
      return
    }

    try {
      const bookingData = {
        provider_id: parseInt(providerId),
        service_category_id: parseInt(formData.service_category_id),
        title: formData.title,
        description: formData.description,
        scheduled_date: scheduledDateTime.toISOString(),
        estimated_hours: parseFloat(formData.estimated_hours),
        customer_location: formData.customer_location
      }

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Booking created successfully!')
        navigate('/dashboard')
      } else {
        setError(data.error || 'Failed to create booking')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const calculateEstimatedCost = () => {
    if (provider && formData.estimated_hours) {
      return (provider.hourly_rate * parseFloat(formData.estimated_hours)).toFixed(2)
    }
    return '0.00'
  }

  const getMinDateTime = () => {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    return tomorrow.toISOString().slice(0, 16)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            {error || 'Provider not found'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Provider Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Service Provider Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{provider.user?.full_name}</h3>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" />
                {provider.user?.location}
              </p>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <Phone className="h-4 w-4" />
                {provider.user?.phone}
              </p>
            </div>
            <div>
              <p className="text-gray-600 flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                NPR {provider.hourly_rate}/hour
              </p>
              <p className="text-gray-600 mt-1">
                ⭐ {provider.rating} ({provider.total_reviews} reviews)
              </p>
              <p className="text-gray-600 mt-1">
                {provider.experience_years} years experience
              </p>
            </div>
          </div>
          {provider.description && (
            <p className="mt-4 text-gray-700">{provider.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Category */}
            <div className="space-y-2">
              <Label htmlFor="service_category_id">Service Category *</Label>
              <select
                id="service_category_id"
                name="service_category_id"
                value={formData.service_category_id}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select a service category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} - {category.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Fix kitchen sink leak"
                required
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the work you need done in detail..."
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled_date">Preferred Date *</Label>
                <Input
                  type="date"
                  id="scheduled_date"
                  name="scheduled_date"
                  value={formData.scheduled_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduled_time">Preferred Time *</Label>
                <Input
                  type="time"
                  id="scheduled_time"
                  name="scheduled_time"
                  value={formData.scheduled_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Estimated Hours */}
            <div className="space-y-2">
              <Label htmlFor="estimated_hours">Estimated Hours</Label>
              <Input
                type="number"
                id="estimated_hours"
                name="estimated_hours"
                value={formData.estimated_hours}
                onChange={handleChange}
                min="0.5"
                max="24"
                step="0.5"
                placeholder="1"
              />
              <p className="text-sm text-gray-600">
                Estimated cost: NPR {calculateEstimatedCost()}
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="customer_location">Service Location *</Label>
              <Input
                id="customer_location"
                name="customer_location"
                value={formData.customer_location}
                onChange={handleChange}
                placeholder="Enter your address"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/providers')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Creating Booking...' : 'Book Service'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingForm

