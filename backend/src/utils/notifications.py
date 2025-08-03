import os
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import json

class NotificationService:
    """Notification service for SMS, Email, and Push notifications"""
    
    def __init__(self):
        # Email configuration
        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', 587))
        self.email_user = os.environ.get('EMAIL_USER', 'noreply@sewago.com')
        self.email_password = os.environ.get('EMAIL_PASSWORD', '')
        
        # SMS configuration (Sparrow SMS - Popular in Nepal)
        self.sms_token = os.environ.get('SPARROW_SMS_TOKEN', '')
        self.sms_from = os.environ.get('SMS_FROM', 'SewaGo')
        self.sms_api_url = 'https://api.sparrowsms.com/v2/sms/'
        
    def send_email(self, to_email, subject, message, html_message=None):
        """Send email notification"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.email_user
            msg['To'] = to_email
            
            # Add plain text part
            text_part = MIMEText(message, 'plain', 'utf-8')
            msg.attach(text_part)
            
            # Add HTML part if provided
            if html_message:
                html_part = MIMEText(html_message, 'html', 'utf-8')
                msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_user, self.email_password)
                server.send_message(msg)
            
            return {'success': True, 'message': 'Email sent successfully'}
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def send_sms(self, to_phone, message):
        """Send SMS notification using Sparrow SMS (Nepal)"""
        try:
            # Format phone number for Nepal
            if to_phone.startswith('+977'):
                to_phone = to_phone[4:]  # Remove +977
            elif to_phone.startswith('977'):
                to_phone = to_phone[3:]  # Remove 977
            
            # Ensure phone number is valid Nepal format
            if not to_phone.startswith('98') or len(to_phone) != 10:
                return {'success': False, 'error': 'Invalid Nepal phone number format'}
            
            payload = {
                'token': self.sms_token,
                'from': self.sms_from,
                'to': to_phone,
                'text': message
            }
            
            response = requests.post(self.sms_api_url, data=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if result.get('response_code') == 200:
                    return {'success': True, 'message': 'SMS sent successfully'}
                else:
                    return {'success': False, 'error': result.get('message', 'SMS sending failed')}
            else:
                return {'success': False, 'error': f'SMS API error: {response.status_code}'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def send_booking_confirmation(self, booking, user_type='customer'):
        """Send booking confirmation notification"""
        try:
            if user_type == 'customer':
                user = booking.customer
                subject = f"Booking Confirmation - SewaGo #{booking.id}"
                message = f"""
नमस्ते {user.full_name},

Your service booking has been confirmed!

Booking Details:
- Service: {booking.title}
- Provider: {booking.provider.full_name}
- Date: {booking.scheduled_date.strftime('%Y-%m-%d %H:%M')}
- Location: {booking.customer_location}
- Amount: NPR {booking.total_amount or 0}

Thank you for using SewaGo!
"""
                
                html_message = f"""
<h2>Booking Confirmed</h2>
<p>नमस्ते {user.full_name},</p>
<p>Your service booking has been confirmed!</p>
<div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;">
    <h3>Booking Details:</h3>
    <ul>
        <li><strong>Service:</strong> {booking.title}</li>
        <li><strong>Provider:</strong> {booking.provider.full_name}</li>
        <li><strong>Date:</strong> {booking.scheduled_date.strftime('%Y-%m-%d %H:%M')}</li>
        <li><strong>Location:</strong> {booking.customer_location}</li>
        <li><strong>Amount:</strong> NPR {booking.total_amount or 0}</li>
    </ul>
</div>
<p>Thank you for using SewaGo!</p>
"""
                
            else:  # service provider
                user = booking.provider
                subject = f"New Booking Request - SewaGo #{booking.id}"
                message = f"""
नमस्ते {user.full_name},

You have received a new booking request!

Booking Details:
- Service: {booking.title}
- Customer: {booking.customer.full_name}
- Date: {booking.scheduled_date.strftime('%Y-%m-%d %H:%M')}
- Location: {booking.customer_location}
- Amount: NPR {booking.total_amount or 0}

Please log in to your dashboard to accept or decline this booking.
"""
                
                html_message = f"""
<h2>New Booking Request</h2>
<p>नमस्ते {user.full_name},</p>
<p>You have received a new booking request!</p>
<div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;">
    <h3>Booking Details:</h3>
    <ul>
        <li><strong>Service:</strong> {booking.title}</li>
        <li><strong>Customer:</strong> {booking.customer.full_name}</li>
        <li><strong>Date:</strong> {booking.scheduled_date.strftime('%Y-%m-%d %H:%M')}</li>
        <li><strong>Location:</strong> {booking.customer_location}</li>
        <li><strong>Amount:</strong> NPR {booking.total_amount or 0}</li>
    </ul>
</div>
<p>Please log in to your dashboard to accept or decline this booking.</p>
"""
            
            # Send email
            email_result = self.send_email(user.email, subject, message, html_message)
            
            # Send SMS if phone number is available
            sms_result = {'success': True, 'message': 'No phone number'}
            if user.phone:
                sms_message = f"SewaGo: Booking #{booking.id} - {booking.title} on {booking.scheduled_date.strftime('%Y-%m-%d')}. Check your email for details."
                sms_result = self.send_sms(user.phone, sms_message)
            
            return {
                'email': email_result,
                'sms': sms_result
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def send_payment_confirmation(self, booking):
        """Send payment confirmation notification"""
        try:
            user = booking.customer
            subject = f"Payment Confirmed - SewaGo #{booking.id}"
            
            message = f"""
नमस्ते {user.full_name},

Your payment has been confirmed!

Payment Details:
- Booking: {booking.title}
- Amount: NPR {booking.total_amount}
- Payment Method: {booking.payment_method.upper()}
- Reference: {booking.payment_reference}

Your service is now scheduled. The provider will contact you soon.

Thank you for using SewaGo!
"""
            
            html_message = f"""
<h2>Payment Confirmed</h2>
<p>नमस्ते {user.full_name},</p>
<p>Your payment has been confirmed!</p>
<div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; background-color: #f0f8ff;">
    <h3>Payment Details:</h3>
    <ul>
        <li><strong>Booking:</strong> {booking.title}</li>
        <li><strong>Amount:</strong> NPR {booking.total_amount}</li>
        <li><strong>Payment Method:</strong> {booking.payment_method.upper()}</li>
        <li><strong>Reference:</strong> {booking.payment_reference}</li>
    </ul>
</div>
<p>Your service is now scheduled. The provider will contact you soon.</p>
<p>Thank you for using SewaGo!</p>
"""
            
            # Send email
            email_result = self.send_email(user.email, subject, message, html_message)
            
            # Send SMS
            sms_result = {'success': True, 'message': 'No phone number'}
            if user.phone:
                sms_message = f"SewaGo: Payment of NPR {booking.total_amount} confirmed for booking #{booking.id}. Service scheduled!"
                sms_result = self.send_sms(user.phone, sms_message)
            
            return {
                'email': email_result,
                'sms': sms_result
            }
            
        except Exception as e:
            return {'error': str(e)}
    
    def send_service_reminder(self, booking):
        """Send service reminder notification"""
        try:
            # Send to both customer and provider
            results = {}
            
            # Customer reminder
            customer = booking.customer
            customer_message = f"""
नमस्ते {customer.full_name},

Reminder: Your service is scheduled for tomorrow!

Service: {booking.title}
Provider: {booking.provider.full_name}
Date: {booking.scheduled_date.strftime('%Y-%m-%d %H:%M')}
Location: {booking.customer_location}

Please be available at the scheduled time.
"""
            
            results['customer_email'] = self.send_email(
                customer.email,
                f"Service Reminder - Tomorrow - SewaGo #{booking.id}",
                customer_message
            )
            
            if customer.phone:
                sms_msg = f"SewaGo Reminder: Service '{booking.title}' tomorrow at {booking.scheduled_date.strftime('%H:%M')}. Be ready!"
                results['customer_sms'] = self.send_sms(customer.phone, sms_msg)
            
            # Provider reminder
            provider = booking.provider
            provider_message = f"""
नमस्ते {provider.full_name},

Reminder: You have a service scheduled for tomorrow!

Service: {booking.title}
Customer: {customer.full_name}
Date: {booking.scheduled_date.strftime('%Y-%m-%d %H:%M')}
Location: {booking.customer_location}
Contact: {customer.phone or customer.email}

Please be prepared and contact the customer if needed.
"""
            
            results['provider_email'] = self.send_email(
                provider.email,
                f"Service Reminder - Tomorrow - SewaGo #{booking.id}",
                provider_message
            )
            
            if provider.phone:
                sms_msg = f"SewaGo Reminder: Service '{booking.title}' tomorrow at {booking.scheduled_date.strftime('%H:%M')} for {customer.full_name}"
                results['provider_sms'] = self.send_sms(provider.phone, sms_msg)
            
            return results
            
        except Exception as e:
            return {'error': str(e)}

# Initialize notification service
notification_service = NotificationService()