from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid
import random

payment_bp = Blueprint('payment', __name__, url_prefix='/api/payment')

# Simulated payment gateway
PAYMENT_METHODS = {
    'credit_card': {
        'name': 'Credit Card',
        'fee': 0.02  # 2% fee
    },
    'debit_card': {
        'name': 'Debit Card',
        'fee': 0.01  # 1% fee
    },
    'wallet': {
        'name': 'Digital Wallet',
        'fee': 0.00  # No fee
    },
    'bank_transfer': {
        'name': 'Bank Transfer',
        'fee': 0.015  # 1.5% fee
    }
}

# In-memory transaction storage (for simulation)
transactions = {}

def simulate_payment_processing(amount, method):
    """Simulate payment processing with random success rate"""
    success_rate = 0.95  # 95% success rate
    return random.random() < success_rate

# Initiate payment
@payment_bp.route('/initiate', methods=['POST'])
def initiate_payment():
    try:
        data = request.get_json()
        
        required_fields = ['order_id', 'amount', 'payment_method']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        if data['payment_method'] not in PAYMENT_METHODS:
            return jsonify({'success': False, 'error': 'Invalid payment method'}), 400
        
        amount = float(data['amount'])
        payment_method = data['payment_method']
        order_id = data['order_id']
        
        # Calculate fee
        fee = amount * PAYMENT_METHODS[payment_method]['fee']
        total_amount = amount + fee
        
        # Create transaction
        transaction_id = str(uuid.uuid4())
        transactions[transaction_id] = {
            'order_id': order_id,
            'amount': amount,
            'fee': fee,
            'total_amount': total_amount,
            'payment_method': PAYMENT_METHODS[payment_method]['name'],
            'status': 'Initiated',
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return jsonify({
            'success': True,
            'data': {
                'transaction_id': transaction_id,
                'order_id': order_id,
                'amount': amount,
                'fee': fee,
                'total_amount': total_amount,
                'payment_method': PAYMENT_METHODS[payment_method]['name']
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Process payment
@payment_bp.route('/process', methods=['POST'])
def process_payment():
    try:
        data = request.get_json()
        
        required_fields = ['transaction_id', 'card_number', 'cvv', 'expiry']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        transaction_id = data['transaction_id']
        
        if transaction_id not in transactions:
            return jsonify({'success': False, 'error': 'Transaction not found'}), 404
        
        transaction = transactions[transaction_id]
        
        # Validate card details (basic validation for simulation)
        card_number = data['card_number'].replace(' ', '').replace('-', '')
        if not card_number.isdigit() or len(card_number) < 13:
            return jsonify({'success': False, 'error': 'Invalid card number'}), 400
        
        cvv = data['cvv']
        if not cvv.isdigit() or len(cvv) not in [3, 4]:
            return jsonify({'success': False, 'error': 'Invalid CVV'}), 400
        
        # Simulate payment processing
        payment_success = simulate_payment_processing(
            transaction['total_amount'],
            data.get('payment_method', 'credit_card')
        )
        
        if payment_success:
            transaction['status'] = 'Completed'
            transaction['processing_timestamp'] = datetime.utcnow().isoformat()
            transaction['last_4_digits'] = card_number[-4:]
            
            return jsonify({
                'success': True,
                'message': 'Payment processed successfully',
                'data': {
                    'transaction_id': transaction_id,
                    'order_id': transaction['order_id'],
                    'amount': transaction['amount'],
                    'total_amount': transaction['total_amount'],
                    'fee': transaction['fee'],
                    'status': 'Completed',
                    'receipt': {
                        'transaction_id': transaction_id,
                        'date': datetime.utcnow().isoformat(),
                        'amount': transaction['total_amount'],
                        'payment_method': transaction['payment_method'],
                        'last_4_digits': card_number[-4:]
                    }
                }
            }), 200
        else:
            transaction['status'] = 'Failed'
            transaction['error'] = 'Payment declined by bank'
            
            return jsonify({
                'success': False,
                'error': 'Payment declined. Please try another payment method.',
                'data': {
                    'transaction_id': transaction_id,
                    'status': 'Failed'
                }
            }), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get transaction status
@payment_bp.route('/status/<transaction_id>', methods=['GET'])
def get_transaction_status(transaction_id):
    try:
        if transaction_id not in transactions:
            return jsonify({'success': False, 'error': 'Transaction not found'}), 404
        
        transaction = transactions[transaction_id]
        
        return jsonify({
            'success': True,
            'data': {
                'transaction_id': transaction_id,
                'order_id': transaction['order_id'],
                'amount': transaction['amount'],
                'total_amount': transaction['total_amount'],
                'fee': transaction['fee'],
                'payment_method': transaction['payment_method'],
                'status': transaction['status'],
                'timestamp': transaction['timestamp']
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get payment methods
@payment_bp.route('/methods', methods=['GET'])
def get_payment_methods():
    try:
        methods = []
        for key, value in PAYMENT_METHODS.items():
            methods.append({
                'id': key,
                'name': value['name'],
                'fee': f"{value['fee'] * 100:.1f}%"
            })
        
        return jsonify({
            'success': True,
            'data': methods
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
