from flask import Blueprint, jsonify, request, session, redirect
from ..models.user import User, Booking, db
import requests
import hashlib
import uuid
import json
from datetime import datetime

payments_bp = Blueprint('payments', __name__)

# eSewa Configuration
ESEWA_CONFIG = {
    'merchant_code': 'EPAYTEST',  # Use actual merchant code in production
    'success_url': 'http://localhost:3000/payment/success',
    'failure_url': 'http://localhost:3000/payment/failure',
    'service_url': 'https://uat.esewa.com.np/epay/main',  # Production: https://esewa.com.np/epay/main
    'verify_url': 'https://uat.esewa.com.np/epay/transrec'  # Production: https://esewa.com.np/epay/transrec
}

# Khalti Configuration
KHALTI_CONFIG = {
    'public_key': 'test_public_key_dc74e0fd57cb46cd93832aee0a390234',  # Use actual keys in production
    'secret_key': 'test_secret_key_f59e8b7d18b4499ca40f68195a846e9b',
    'verify_url': 'https://khalti.com/api/v2/payment/verify/',
    'success_url': 'http://localhost:3000/payment/success',
    'failure_url': 'http://localhost:3000/payment/failure'
}

@payments_bp.route('/initiate', methods=['POST'])
def initiate_payment():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        data = request.json
        booking_id = data.get('booking_id')
        payment_method = data.get('payment_method')  # 'esewa' or 'khalti'
        
        # Validate booking
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if booking.customer_id != session['user_id']:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if booking.status != 'confirmed':
            return jsonify({'error': 'Booking must be confirmed before payment'}), 400
        
        amount = booking.total_amount
        if not amount or amount <= 0:
            return jsonify({'error': 'Invalid payment amount'}), 400
        
        # Generate unique transaction ID
        transaction_id = str(uuid.uuid4())
        
        if payment_method == 'esewa':
            return initiate_esewa_payment(booking, amount, transaction_id)
        elif payment_method == 'khalti':
            return initiate_khalti_payment(booking, amount, transaction_id)
        else:
            return jsonify({'error': 'Invalid payment method'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def initiate_esewa_payment(booking, amount, transaction_id):
    """Initiate eSewa payment"""
    try:
        # eSewa payment parameters
        payment_data = {
            'amt': amount,
            'pdc': 0,  # Product delivery charge
            'psc': 0,  # Product service charge
            'txAmt': 0,  # Tax amount
            'tAmt': amount,  # Total amount
            'pid': transaction_id,  # Product ID (transaction ID)
            'scd': ESEWA_CONFIG['merchant_code'],
            'su': ESEWA_CONFIG['success_url'] + f'?booking_id={booking.id}&method=esewa',
            'fu': ESEWA_CONFIG['failure_url'] + f'?booking_id={booking.id}&method=esewa'
        }
        
        # Store transaction info in session or database
        session[f'payment_{transaction_id}'] = {
            'booking_id': booking.id,
            'amount': amount,
            'method': 'esewa',
            'created_at': datetime.utcnow().isoformat()
        }
        
        return jsonify({
            'success': True,
            'payment_url': ESEWA_CONFIG['service_url'],
            'payment_data': payment_data,
            'transaction_id': transaction_id
        })
        
    except Exception as e:
        return jsonify({'error': f'eSewa payment initiation failed: {str(e)}'}), 500

def initiate_khalti_payment(booking, amount, transaction_id):
    """Initiate Khalti payment"""
    try:
        # Convert amount to paisa (Khalti uses paisa)
        amount_paisa = int(amount * 100)
        
        payment_data = {
            'return_url': KHALTI_CONFIG['success_url'] + f'?booking_id={booking.id}&method=khalti',
            'website_url': 'http://localhost:3000',
            'amount': amount_paisa,
            'purchase_order_id': transaction_id,
            'purchase_order_name': f'SewaGo Booking #{booking.id}',
            'customer_info': {
                'name': booking.customer.full_name,
                'email': booking.customer.email,
                'phone': booking.customer.phone or '9800000000'
            }
        }
        
        headers = {
            'Authorization': f'Key {KHALTI_CONFIG["secret_key"]}',
            'Content-Type': 'application/json'
        }
        
        # Make request to Khalti
        response = requests.post(
            'https://khalti.com/api/v2/epayment/initiate/',
            json=payment_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            khalti_response = response.json()
            
            # Store transaction info
            session[f'payment_{transaction_id}'] = {
                'booking_id': booking.id,
                'amount': amount,
                'method': 'khalti',
                'khalti_pidx': khalti_response.get('pidx'),
                'created_at': datetime.utcnow().isoformat()
            }
            
            return jsonify({
                'success': True,
                'payment_url': khalti_response.get('payment_url'),
                'transaction_id': transaction_id,
                'pidx': khalti_response.get('pidx')
            })
        else:
            return jsonify({'error': 'Khalti payment initiation failed'}), 500
            
    except Exception as e:
        return jsonify({'error': f'Khalti payment initiation failed: {str(e)}'}), 500

@payments_bp.route('/verify', methods=['POST'])
def verify_payment():
    """Verify payment from eSewa or Khalti"""
    try:
        data = request.json
        method = data.get('method')
        transaction_id = data.get('transaction_id')
        
        if not transaction_id or f'payment_{transaction_id}' not in session:
            return jsonify({'error': 'Invalid transaction'}), 400
        
        payment_info = session[f'payment_{transaction_id}']
        booking = Booking.query.get(payment_info['booking_id'])
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if method == 'esewa':
            return verify_esewa_payment(data, booking, payment_info)
        elif method == 'khalti':
            return verify_khalti_payment(data, booking, payment_info)
        else:
            return jsonify({'error': 'Invalid payment method'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def verify_esewa_payment(data, booking, payment_info):
    """Verify eSewa payment"""
    try:
        # eSewa verification parameters
        verify_data = {
            'amt': payment_info['amount'],
            'rid': data.get('refId'),  # Reference ID from eSewa
            'pid': data.get('oid'),   # Transaction ID
            'scd': ESEWA_CONFIG['merchant_code']
        }
        
        # Make verification request to eSewa
        response = requests.post(
            ESEWA_CONFIG['verify_url'],
            data=verify_data,
            timeout=30
        )
        
        if response.status_code == 200 and 'Success' in response.text:
            # Payment verified successfully
            booking.status = 'paid'
            booking.payment_status = 'completed'
            booking.payment_method = 'esewa'
            booking.payment_reference = data.get('refId')
            booking.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            # Clean up session
            session.pop(f'payment_{data.get("transaction_id")}', None)
            
            return jsonify({
                'success': True,
                'message': 'Payment verified successfully',
                'booking': booking.to_dict()
            })
        else:
            return jsonify({'error': 'Payment verification failed'}), 400
            
    except Exception as e:
        return jsonify({'error': f'eSewa verification failed: {str(e)}'}), 500

def verify_khalti_payment(data, booking, payment_info):
    """Verify Khalti payment"""
    try:
        pidx = data.get('pidx') or payment_info.get('khalti_pidx')
        
        if not pidx:
            return jsonify({'error': 'Missing payment identifier'}), 400
        
        headers = {
            'Authorization': f'Key {KHALTI_CONFIG["secret_key"]}',
            'Content-Type': 'application/json'
        }
        
        verify_data = {'pidx': pidx}
        
        # Make verification request to Khalti
        response = requests.post(
            KHALTI_CONFIG['verify_url'],
            json=verify_data,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            khalti_response = response.json()
            
            if khalti_response.get('status') == 'Completed':
                # Payment verified successfully
                booking.status = 'paid'
                booking.payment_status = 'completed'
                booking.payment_method = 'khalti'
                booking.payment_reference = pidx
                booking.updated_at = datetime.utcnow()
                
                db.session.commit()
                
                # Clean up session
                session.pop(f'payment_{data.get("transaction_id")}', None)
                
                return jsonify({
                    'success': True,
                    'message': 'Payment verified successfully',
                    'booking': booking.to_dict()
                })
            else:
                return jsonify({'error': 'Payment not completed'}), 400
        else:
            return jsonify({'error': 'Payment verification failed'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Khalti verification failed: {str(e)}'}), 500

@payments_bp.route('/status/<int:booking_id>', methods=['GET'])
def get_payment_status(booking_id):
    """Get payment status for a booking"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check if user is involved in this booking
        if booking.customer_id != session['user_id'] and booking.provider_id != session['user_id']:
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({
            'booking_id': booking.id,
            'payment_status': getattr(booking, 'payment_status', 'pending'),
            'payment_method': getattr(booking, 'payment_method', None),
            'payment_reference': getattr(booking, 'payment_reference', None),
            'total_amount': booking.total_amount
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500