import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { BoudhanathIcon } from './ui/NepaliIcons'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell,
  Search,
  Home,
  Briefcase,
  Users,
  MessageCircle,
  Shield,
  Globe,
  ChevronDown
} from 'lucide-react'

const NepaliNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ne' : 'en'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const navItems = [
    {
      name: i18n.language === 'ne' ? 'गृहपृष्ठ' : 'Home',
      path: '/',
      icon: Home
    },
    {
      name: i18n.language === 'ne' ? 'सेवाहरू' : 'Services',
      path: '/services',
      icon: Search
    },
    {
      name: i18n.language === 'ne' ? 'प्रदायकहरू' : 'Providers',
      path: '/providers',
      icon: Users
    }
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <BoudhanathIcon className="w-10 h-10 group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">SewaGo</span>
              <span className="text-xs text-gray-500 -mt-1">
                {i18n.language === 'ne' ? 'सेवा गो' : 'Service Go'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-all duration-200 group"
                >
                  <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center space-x-1 px-3 py-2 rounded-xl bg-accent/50 hover:bg-accent transition-colors duration-200"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {i18n.language === 'ne' ? 'EN' : 'नेपाली'}
              </span>
            </button>

            {/* Search Button */}
            <button className="p-2 rounded-xl bg-accent/50 hover:bg-accent transition-colors duration-200">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="relative">
                {/* Notifications */}
                <button className="p-2 rounded-xl bg-accent/50 hover:bg-accent transition-colors duration-200 mr-2">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {user?.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 nepal-card py-2 shadow-xl">
                      <div className="px-4 py-2 border-b border-border/50">
                        <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-accent/50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>{i18n.language === 'ne' ? 'ड्यासबोर्ड' : 'Dashboard'}</span>
                      </Link>

                      {user?.user_type === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-accent/50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Shield className="w-4 h-4" />
                          <span>{i18n.language === 'ne' ? 'एडमिन' : 'Admin'}</span>
                        </Link>
                      )}

                      <Link
                        to="/sewai"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-accent/50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{i18n.language === 'ne' ? 'सेवाAI' : 'SewaAI'}</span>
                      </Link>

                      <div className="border-t border-border/50 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{i18n.language === 'ne' ? 'लगआउट' : 'Logout'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="nepal-button-outline text-sm px-4 py-2"
                >
                  {i18n.language === 'ne' ? 'लगइन' : 'Login'}
                </Link>
                <Link
                  to="/register"
                  className="nepal-button text-sm px-4 py-2"
                >
                  {i18n.language === 'ne' ? 'दर्ता गर्नुहोस्' : 'Register'}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-accent/50 hover:bg-accent transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-accent/50 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}

            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-accent/50 rounded-xl transition-colors w-full"
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">
                {i18n.language === 'ne' ? 'English' : 'नेपाली'}
              </span>
            </button>

            {/* Mobile Auth */}
            {!isAuthenticated && (
              <div className="px-4 pt-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center nepal-button-outline py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {i18n.language === 'ne' ? 'लगइन' : 'Login'}
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center nepal-button py-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {i18n.language === 'ne' ? 'दर्ता गर्नुहोस्' : 'Register'}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isUserMenuOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false)
            setIsMenuOpen(false)
          }}
        />
      )}
    </nav>
  )
}

export default NepaliNavbar