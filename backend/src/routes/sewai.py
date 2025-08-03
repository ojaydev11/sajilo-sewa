from flask import Blueprint, jsonify, request, session
from ..models.user import User, Booking, ServiceProvider, Review, db
import json
import re
from datetime import datetime, timedelta
from collections import Counter

sewai_bp = Blueprint('sewai', __name__)

class SewaAI:
    """Intelligent AI Assistant for SewaGo platform"""
    
    def __init__(self):
        self.intents = {
            'greeting': ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good afternoon'],
            'booking_help': ['book', 'booking', 'schedule', 'appointment', 'service'],
            'payment_help': ['payment', 'pay', 'esewa', 'khalti', 'money', 'cost', 'price'],
            'provider_help': ['provider', 'worker', 'technician', 'professional'],
            'problem_report': ['problem', 'issue', 'error', 'bug', 'not working'],
            'account_help': ['account', 'profile', 'login', 'register', 'password'],
            'location_help': ['location', 'area', 'address', 'near me'],
            'rating_help': ['rating', 'review', 'feedback', 'star'],
            'goodbye': ['bye', 'goodbye', 'see you', 'thanks', 'thank you']
        }
        
        self.responses = {
            'greeting': [
                "नमस्ते! म SewaAI हुँ। तपाईंलाई कसरी सहयोग गर्न सक्छु?",
                "Hello! I'm SewaAI, your service assistant. How can I help you today?",
                "Welcome to SewaGo! I'm here to help you find and book services."
            ],
            'booking_help': [
                "To book a service: 1) Browse services 2) Select a provider 3) Choose date/time 4) Confirm booking",
                "I can help you book services! What type of service are you looking for?",
                "Booking is easy! First, tell me what service you need - plumber, electrician, cleaner, etc."
            ],
            'payment_help': [
                "We accept eSewa and Khalti payments. Payment is processed after service confirmation.",
                "You can pay using eSewa or Khalti. The payment is secure and processed instantly.",
                "Payment options: eSewa, Khalti. You'll be redirected to the payment gateway after booking confirmation."
            ],
            'provider_help': [
                "Our service providers are verified professionals. You can check their ratings and reviews.",
                "All providers are background-checked and rated by customers. You can view their profiles before booking.",
                "Service providers are categorized by skills: plumbing, electrical, cleaning, tutoring, etc."
            ],
            'problem_report': [
                "I'm sorry you're experiencing issues. Can you describe the problem in detail?",
                "Let me help you solve this problem. What exactly is not working?",
                "I'll help you troubleshoot. Please provide more details about the issue."
            ],
            'account_help': [
                "For account issues: Check your email for verification, reset password if needed, or contact support.",
                "Account help: You can update your profile, change password, or manage bookings in your dashboard.",
                "Having account troubles? I can guide you through registration, login, or profile updates."
            ],
            'location_help': [
                "We serve Kathmandu, Lalitpur, and Bhaktapur. You can filter services by location.",
                "Service providers are available across the Kathmandu Valley. Use location filters to find nearby services.",
                "Location-based search helps you find the nearest service providers in your area."
            ],
            'rating_help': [
                "You can rate and review service providers after service completion. This helps other customers.",
                "Ratings and reviews help maintain service quality. Please share your experience after service completion.",
                "5-star rating system with written reviews helps you choose the best service providers."
            ],
            'goodbye': [
                "धन्यवाद! SewaGo प्रयोग गर्नुभएकोमा। फेरि आउनुहोस्!",
                "Thank you for using SewaGo! Have a great day!",
                "Goodbye! Feel free to ask if you need any help."
            ],
            'default': [
                "I'm here to help with SewaGo services. Can you please rephrase your question?",
                "I didn't quite understand. Can you ask about bookings, payments, providers, or account issues?",
                "Let me help you better. Are you looking for service booking, payment help, or provider information?"
            ]
        }

    def detect_intent(self, message):
        """Detect user intent from message"""
        message_lower = message.lower()
        
        # Check for specific intents
        for intent, keywords in self.intents.items():
            if any(keyword in message_lower for keyword in keywords):
                return intent
        
        return 'default'

    def get_response(self, intent, user_context=None):
        """Get appropriate response based on intent and context"""
        responses = self.responses.get(intent, self.responses['default'])
        
        # Add context-specific responses
        if intent == 'booking_help' and user_context:
            if user_context.get('user_type') == 'service_provider':
                return "As a service provider, you can manage your bookings in the dashboard and update your availability."
        
        return responses[0]  # Return first response for now

    def analyze_user_behavior(self, user_id):
        """Analyze user behavior for growth insights"""
        try:
            user = User.query.get(user_id)
            if not user:
                return None
            
            analysis = {
                'user_type': user.user_type,
                'registration_date': user.created_at,
                'location': user.location,
                'activity_score': 0
            }
            
            if user.user_type == 'customer':
                bookings = Booking.query.filter_by(customer_id=user_id).all()
                analysis.update({
                    'total_bookings': len(bookings),
                    'completed_bookings': len([b for b in bookings if b.status == 'completed']),
                    'total_spent': sum([b.total_amount or 0 for b in bookings]),
                    'favorite_services': self._get_favorite_services(bookings),
                    'booking_frequency': self._calculate_booking_frequency(bookings)
                })
                analysis['activity_score'] = len(bookings) * 2
            
            elif user.user_type == 'service_provider':
                provider = user.service_provider_profile
                if provider:
                    bookings = Booking.query.filter_by(provider_id=user_id).all()
                    reviews = Review.query.filter_by(provider_id=user_id).all()
                    
                    analysis.update({
                        'total_bookings_received': len(bookings),
                        'completed_services': len([b for b in bookings if b.status == 'completed']),
                        'total_earned': sum([b.total_amount or 0 for b in bookings]),
                        'average_rating': provider.rating,
                        'total_reviews': len(reviews),
                        'response_rate': self._calculate_response_rate(bookings)
                    })
                    analysis['activity_score'] = len(bookings) + len(reviews)
            
            return analysis
            
        except Exception as e:
            return {'error': str(e)}

    def detect_fraud(self, user_id, booking_data=None):
        """Detect potential fraudulent activity"""
        try:
            fraud_indicators = []
            risk_score = 0
            
            user = User.query.get(user_id)
            if not user:
                return {'risk_score': 0, 'indicators': []}
            
            # Check user account age
            account_age = (datetime.utcnow() - user.created_at).days
            if account_age < 1:
                fraud_indicators.append("Very new account (less than 1 day old)")
                risk_score += 30
            
            # Check booking patterns for customers
            if user.user_type == 'customer':
                bookings = Booking.query.filter_by(customer_id=user_id).all()
                
                # Multiple bookings in short time
                recent_bookings = [b for b in bookings if (datetime.utcnow() - b.created_at).hours < 24]
                if len(recent_bookings) > 5:
                    fraud_indicators.append("Excessive bookings in 24 hours")
                    risk_score += 40
                
                # Unusual booking amounts
                if booking_data and booking_data.get('total_amount', 0) > 10000:
                    fraud_indicators.append("Unusually high booking amount")
                    risk_score += 25
                
                # Multiple cancellations
                cancelled_bookings = [b for b in bookings if b.status == 'cancelled']
                if len(cancelled_bookings) > len(bookings) * 0.7:
                    fraud_indicators.append("High cancellation rate")
                    risk_score += 35
            
            # Check for suspicious provider behavior
            elif user.user_type == 'service_provider':
                provider = user.service_provider_profile
                if provider:
                    # Unrealistic ratings
                    if provider.rating > 4.9 and provider.total_reviews > 10:
                        fraud_indicators.append("Suspiciously high ratings")
                        risk_score += 20
                    
                    # No reviews but high rating
                    if provider.rating > 4.0 and provider.total_reviews == 0:
                        fraud_indicators.append("High rating with no reviews")
                        risk_score += 30
            
            return {
                'risk_score': min(risk_score, 100),
                'risk_level': 'high' if risk_score > 70 else 'medium' if risk_score > 40 else 'low',
                'indicators': fraud_indicators
            }
            
        except Exception as e:
            return {'error': str(e)}

    def _get_favorite_services(self, bookings):
        """Get user's favorite service categories"""
        service_counts = Counter([b.service_category_id for b in bookings])
        return service_counts.most_common(3)

    def _calculate_booking_frequency(self, bookings):
        """Calculate how frequently user books services"""
        if len(bookings) < 2:
            return 0
        
        dates = sorted([b.created_at for b in bookings])
        total_days = (dates[-1] - dates[0]).days
        return len(bookings) / max(total_days, 1)

    def _calculate_response_rate(self, bookings):
        """Calculate provider's response rate to bookings"""
        if not bookings:
            return 0
        
        responded = len([b for b in bookings if b.status != 'pending'])
        return (responded / len(bookings)) * 100

# Initialize SewaAI instance
sewa_ai = SewaAI()

@sewai_bp.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint for SewaAI"""
    try:
        data = request.json
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get user context if authenticated
        user_context = None
        if 'user_id' in session:
            user = User.query.get(session['user_id'])
            if user:
                user_context = {
                    'user_type': user.user_type,
                    'location': user.location,
                    'user_id': user.id
                }
        
        # Detect intent and generate response
        intent = sewa_ai.detect_intent(message)
        response = sewa_ai.get_response(intent, user_context)
        
        return jsonify({
            'response': response,
            'intent': intent,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sewai_bp.route('/analyze/<int:user_id>', methods=['GET'])
def analyze_user(user_id):
    """Analyze user behavior (admin only)"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    # Check if current user is admin (simplified check)
    current_user = User.query.get(session['user_id'])
    if not current_user or current_user.user_type != 'admin':
        return jsonify({'error': 'Admin access required'}), 403
    
    analysis = sewa_ai.analyze_user_behavior(user_id)
    return jsonify(analysis)

@sewai_bp.route('/fraud-check', methods=['POST'])
def fraud_check():
    """Check for fraudulent activity"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        data = request.json
        target_user_id = data.get('user_id', session['user_id'])
        booking_data = data.get('booking_data')
        
        # Only allow users to check themselves or admins to check anyone
        current_user = User.query.get(session['user_id'])
        if target_user_id != session['user_id'] and current_user.user_type != 'admin':
            return jsonify({'error': 'Access denied'}), 403
        
        fraud_analysis = sewa_ai.detect_fraud(target_user_id, booking_data)
        return jsonify(fraud_analysis)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sewai_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    """Get personalized recommendations for user"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        user_id = session['user_id']
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        recommendations = []
        
        if user.user_type == 'customer':
            # Get booking history
            bookings = Booking.query.filter_by(customer_id=user_id).all()
            
            if not bookings:
                # New user recommendations
                recommendations = [
                    "Start by browsing our popular services like plumbing and electrical work",
                    "Check out highly-rated service providers in your area",
                    "Read reviews from other customers to make informed decisions"
                ]
            else:
                # Personalized recommendations based on history
                completed_bookings = [b for b in bookings if b.status == 'completed']
                
                if len(completed_bookings) > 0:
                    recommendations.append("Consider leaving reviews for your completed services")
                
                # Suggest related services
                favorite_services = sewa_ai._get_favorite_services(bookings)
                if favorite_services:
                    recommendations.append(f"You might also like services related to your frequent bookings")
        
        elif user.user_type == 'service_provider':
            provider = user.service_provider_profile
            if provider:
                if provider.total_reviews < 5:
                    recommendations.append("Encourage customers to leave reviews to build your reputation")
                
                if provider.rating < 4.0:
                    recommendations.append("Focus on improving service quality to increase your ratings")
                
                bookings = Booking.query.filter_by(provider_id=user_id).all()
                if len(bookings) < 10:
                    recommendations.append("Update your profile and skills to attract more customers")
        
        return jsonify({
            'recommendations': recommendations,
            'user_type': user.user_type
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500