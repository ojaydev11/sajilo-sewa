# 🚀 SewaGo - Service Provider Platform for Nepal

SewaGo is a comprehensive service provider platform specifically designed for the Nepal market. It connects customers with verified local service providers across Kathmandu Valley.

## ✨ Features

### 🎯 Core Features
- **User Management**: Customer and service provider registration/login
- **Service Booking**: Complete booking system with calendar scheduling
- **Payment Integration**: eSewa and Khalti payment gateways
- **Reviews & Ratings**: Customer feedback system
- **Real-time Notifications**: SMS, email, and push notifications
- **SewaAI Assistant**: Intelligent chatbot for user support and fraud detection

### 🌐 Nepal-Specific Features
- **Nepali Language Support**: Full i18n implementation
- **Local Payment Gateways**: eSewa and Khalti integration
- **Nepal Phone Format**: Proper validation for +977 numbers
- **Local Service Categories**: Plumber, Electrician, Cleaner, etc.
- **Kathmandu Valley Focus**: Location-based service matching

### 📱 Technical Features
- **Mobile-First Design**: Responsive UI with Lite Mode for low bandwidth
- **Progressive Web App**: Works offline with caching
- **Real-time Updates**: Live booking status updates
- **Security**: Session management, authentication, fraud detection
- **Performance**: Optimized for Nepal's internet infrastructure

## 🏗️ Architecture

```
SewaGo/
├── backend/                 # Python Flask API
│   ├── src/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   └── utils/          # Utilities (notifications, etc.)
│   ├── main.py             # Application entry point
│   └── requirements.txt    # Python dependencies
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── i18n/           # Internationalization
│   ├── package.json        # Node.js dependencies
│   └── vite.config.js      # Build configuration
└── docker-compose.yml      # Container orchestration
```

## 🚀 Quick Start

### Prerequisites
- Python 3.13+
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Database Initialization
The database is automatically initialized when the backend starts. Demo accounts:
- Customer: `customer@demo.com` / `password123`
- Provider: `provider@demo.com` / `password123`

## 🐳 Docker Deployment

### Production Deployment
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables
Create a `.env` file:
```env
SECRET_KEY=your-secret-key-here
EMAIL_USER=noreply@sewago.com
EMAIL_PASSWORD=your-email-password
SPARROW_SMS_TOKEN=your-sms-token
ESEWA_MERCHANT_CODE=your-esewa-code
KHALTI_SECRET_KEY=your-khalti-key
```

## 📱 Mobile App Deployment

### Android APK
```bash
# Install Capacitor
npm install -g @capacitor/cli

# Add Android platform
cd frontend
npx cap add android

# Build and sync
npm run build
npx cap sync

# Open in Android Studio
npx cap open android
```

### Windows EXE
```bash
# Install Electron
npm install -g electron

# Build desktop app
npm run build:electron
```

## 🧪 Testing

### Automated Testing
```bash
# Run comprehensive tests
python test_app.py

# This will test:
# - API endpoints
# - Database operations
# - Authentication
# - Booking system
# - Payment integration
# - SewaAI assistant
```

### Manual Testing Checklist
- [ ] User registration (customer & provider)
- [ ] Login/logout functionality
- [ ] Service browsing and filtering
- [ ] Booking creation and management
- [ ] Payment processing (eSewa/Khalti)
- [ ] Review and rating system
- [ ] Notification delivery
- [ ] SewaAI chat functionality
- [ ] Mobile responsiveness
- [ ] Nepali language switching

## 🔧 Configuration

### Payment Gateways

#### eSewa Configuration
```python
ESEWA_CONFIG = {
    'merchant_code': 'YOUR_MERCHANT_CODE',
    'success_url': 'https://your-domain.com/payment/success',
    'failure_url': 'https://your-domain.com/payment/failure',
    'service_url': 'https://esewa.com.np/epay/main'
}
```

#### Khalti Configuration
```python
KHALTI_CONFIG = {
    'public_key': 'YOUR_PUBLIC_KEY',
    'secret_key': 'YOUR_SECRET_KEY',
    'verify_url': 'https://khalti.com/api/v2/payment/verify/'
}
```

### SMS Notifications (Sparrow SMS)
```python
SMS_CONFIG = {
    'token': 'YOUR_SPARROW_TOKEN',
    'from': 'SewaGo',
    'api_url': 'https://api.sparrowsms.com/v2/sms/'
}
```

## 📊 Monitoring & Analytics

### Health Checks
- Backend: `GET /api/health`
- Database: Automatic connection testing
- Payment Gateways: Transaction verification

### Logging
- Application logs: `/var/log/sewago/`
- Error tracking: Integrated error handling
- Performance metrics: Response time monitoring

## 🔒 Security Features

### Authentication & Authorization
- Session-based authentication
- Role-based access control (customer/provider/admin)
- Password hashing with bcrypt
- CSRF protection

### Fraud Detection
- Account age verification
- Booking pattern analysis
- Payment amount validation
- Suspicious activity alerts

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure API endpoints

## 🌍 Internationalization

### Supported Languages
- English (en)
- Nepali (ne)

### Adding New Languages
1. Create translation file: `frontend/src/i18n/locales/[lang].json`
2. Add language to i18n configuration
3. Update language selector component

## 📈 Performance Optimization

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization and compression
- Lite Mode for low bandwidth
- PWA caching strategies

### Backend Optimization
- Database query optimization
- API response caching
- Connection pooling
- Background task processing

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards
- Python: PEP 8 compliance
- JavaScript: ESLint configuration
- Git: Conventional commit messages
- Testing: Minimum 80% code coverage

## 📞 Support

### Documentation
- API Documentation: `/docs` endpoint
- User Guide: Available in Nepali and English
- Developer Guide: Technical implementation details

### Contact
- Email: support@sewago.com
- Phone: +977-1-XXXXXXX
- Address: Kathmandu, Nepal

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Nepal market with local requirements in mind
- Integrated with popular Nepal payment gateways
- Designed for Nepal's internet infrastructure
- Community-driven feature development

---

**SewaGo** - Connecting Nepal through trusted local services 🇳🇵