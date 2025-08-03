#!/usr/bin/env python3
"""
Comprehensive test script for SewaGo application
Tests all major functionality including API endpoints, database operations, and integrations
"""

import requests
import json
import time
import sys
from datetime import datetime, timedelta

class SewaGoTester:
    def __init__(self, base_url='http://localhost:5000'):
        self.base_url = base_url
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name, success, message=""):
        """Log test results"""
        status = "PASS" if success else "FAIL"
        print(f"[{status}] {test_name}: {message}")
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
    
    def test_health_check(self):
        """Test API health check"""
        try:
            response = self.session.get(f"{self.base_url}/api/health")
            success = response.status_code == 200
            message = f"Status: {response.status_code}"
            if success:
                data = response.json()
                message += f", Response: {data.get('message', '')}"
            self.log_test("Health Check", success, message)
            return success
        except Exception as e:
            self.log_test("Health Check", False, str(e))
            return False
    
    def test_user_registration(self):
        """Test user registration"""
        try:
            # Test customer registration
            customer_data = {
                "username": f"test_customer_{int(time.time())}",
                "email": f"customer_{int(time.time())}@test.com",
                "password": "testpass123",
                "full_name": "Test Customer",
                "phone": "+977-9841234567",
                "location": "Kathmandu, Nepal",
                "user_type": "customer"
            }
            
            response = self.session.post(f"{self.base_url}/api/auth/register", json=customer_data)
            success = response.status_code == 201
            
            if success:
                data = response.json()
                self.customer_data = customer_data
                message = f"Customer registered: {data.get('user', {}).get('username', '')}"
            else:
                message = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("User Registration (Customer)", success, message)
            
            # Test service provider registration
            provider_data = {
                "username": f"test_provider_{int(time.time())}",
                "email": f"provider_{int(time.time())}@test.com",
                "password": "testpass123",
                "full_name": "Test Provider",
                "phone": "+977-9851234567",
                "location": "Lalitpur, Nepal",
                "user_type": "service_provider",
                "provider_profile": {
                    "skills": ["Plumbing", "Electrical"],
                    "hourly_rate": 800,
                    "experience_years": 5,
                    "description": "Professional plumber and electrician"
                }
            }
            
            response = self.session.post(f"{self.base_url}/api/auth/register", json=provider_data)
            provider_success = response.status_code == 201
            
            if provider_success:
                data = response.json()
                self.provider_data = provider_data
                message = f"Provider registered: {data.get('user', {}).get('username', '')}"
            else:
                message = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("User Registration (Provider)", provider_success, message)
            return success and provider_success
            
        except Exception as e:
            self.log_test("User Registration", False, str(e))
            return False
    
    def test_user_login(self):
        """Test user login"""
        try:
            # Login as customer
            login_data = {
                "email": self.customer_data["email"],
                "password": self.customer_data["password"]
            }
            
            response = self.session.post(f"{self.base_url}/api/auth/login", json=login_data)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                message = f"Customer logged in: {data.get('user', {}).get('username', '')}"
            else:
                message = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("User Login", success, message)
            return success
            
        except Exception as e:
            self.log_test("User Login", False, str(e))
            return False
    
    def test_service_categories(self):
        """Test service categories API"""
        try:
            response = self.session.get(f"{self.base_url}/api/services/categories")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                message = f"Found {len(data)} categories"
            else:
                message = f"Status: {response.status_code}"
            
            self.log_test("Service Categories", success, message)
            
            # Initialize categories if empty
            if success and len(data) == 0:
                init_response = self.session.post(f"{self.base_url}/api/services/init-categories")
                if init_response.status_code == 200:
                    self.log_test("Initialize Categories", True, "Categories initialized")
                else:
                    self.log_test("Initialize Categories", False, f"Status: {init_response.status_code}")
            
            return success
            
        except Exception as e:
            self.log_test("Service Categories", False, str(e))
            return False
    
    def test_service_providers(self):
        """Test service providers API"""
        try:
            response = self.session.get(f"{self.base_url}/api/services/providers")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                message = f"Found {len(data)} providers"
                if len(data) > 0:
                    self.provider_id = data[0]['id']
            else:
                message = f"Status: {response.status_code}"
            
            self.log_test("Service Providers", success, message)
            return success
            
        except Exception as e:
            self.log_test("Service Providers", False, str(e))
            return False
    
    def test_booking_creation(self):
        """Test booking creation"""
        try:
            if not hasattr(self, 'provider_id'):
                self.log_test("Booking Creation", False, "No provider available for booking")
                return False
            
            # Get categories first
            categories_response = self.session.get(f"{self.base_url}/api/services/categories")
            if categories_response.status_code != 200:
                self.log_test("Booking Creation", False, "Cannot get categories")
                return False
            
            categories = categories_response.json()
            if not categories:
                self.log_test("Booking Creation", False, "No categories available")
                return False
            
            booking_data = {
                "provider_id": self.provider_id,
                "service_category_id": categories[0]['id'],
                "title": "Test Plumbing Service",
                "description": "Fix kitchen sink leak - test booking",
                "scheduled_date": (datetime.now() + timedelta(days=1)).isoformat(),
                "estimated_hours": 2,
                "customer_location": "Test Address, Kathmandu"
            }
            
            response = self.session.post(f"{self.base_url}/api/bookings", json=booking_data)
            success = response.status_code == 201
            
            if success:
                data = response.json()
                self.booking_id = data.get('id')
                message = f"Booking created: ID {self.booking_id}"
            else:
                message = f"Status: {response.status_code}, Error: {response.text}"
            
            self.log_test("Booking Creation", success, message)
            return success
            
        except Exception as e:
            self.log_test("Booking Creation", False, str(e))
            return False
    
    def test_sewai_chat(self):
        """Test SewaAI chat functionality"""
        try:
            chat_data = {
                "message": "Hello, I need help with booking a service"
            }
            
            response = self.session.post(f"{self.base_url}/api/sewai/chat", json=chat_data)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                message = f"AI Response: {data.get('response', '')[:50]}..."
            else:
                message = f"Status: {response.status_code}"
            
            self.log_test("SewaAI Chat", success, message)
            return success
            
        except Exception as e:
            self.log_test("SewaAI Chat", False, str(e))
            return False
    
    def test_database_operations(self):
        """Test database operations"""
        try:
            # Test getting current user
            response = self.session.get(f"{self.base_url}/api/auth/me")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                message = f"Current user: {data.get('user', {}).get('username', '')}"
            else:
                message = f"Status: {response.status_code}"
            
            self.log_test("Database Operations", success, message)
            return success
            
        except Exception as e:
            self.log_test("Database Operations", False, str(e))
            return False
    
    def test_error_handling(self):
        """Test error handling"""
        try:
            # Test invalid endpoint
            response = self.session.get(f"{self.base_url}/api/invalid-endpoint")
            success = response.status_code == 404
            
            message = f"404 error handled correctly: {success}"
            self.log_test("Error Handling", success, message)
            return success
            
        except Exception as e:
            self.log_test("Error Handling", False, str(e))
            return False
    
    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting SewaGo Application Tests")
        print("=" * 50)
        
        tests = [
            self.test_health_check,
            self.test_user_registration,
            self.test_user_login,
            self.test_service_categories,
            self.test_service_providers,
            self.test_booking_creation,
            self.test_sewai_chat,
            self.test_database_operations,
            self.test_error_handling
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            time.sleep(1)  # Brief pause between tests
        
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! SewaGo app is ready for deployment.")
            return True
        else:
            print(f"❌ {total - passed} tests failed. Please check the issues above.")
            return False
    
    def generate_report(self):
        """Generate test report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_tests': len(self.test_results),
            'passed_tests': len([r for r in self.test_results if r['success']]),
            'failed_tests': len([r for r in self.test_results if not r['success']]),
            'tests': self.test_results
        }
        
        with open('test_report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📄 Test report saved to: test_report.json")
        return report

def main():
    """Main function"""
    tester = SewaGoTester()
    
    print("🔍 Testing SewaGo Application")
    print("Please ensure the backend server is running on http://localhost:5000")
    print()
    
    # Wait for user confirmation
    input("Press Enter to start testing...")
    
    success = tester.run_all_tests()
    tester.generate_report()
    
    if success:
        print("\n✅ SewaGo application is fully functional and ready for deployment!")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Please fix the issues before deployment.")
        sys.exit(1)

if __name__ == "__main__":
    main()