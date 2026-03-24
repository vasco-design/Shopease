from flask import Blueprint, request, jsonify
import json
from datetime import datetime

chatbot_bp = Blueprint('chatbot', __name__, url_prefix='/api/chatbot')

# Simple rule-based chatbot
RESPONSES = {
    'hello': 'Hello! Welcome to ShopEase. How can I help you today?',
    'hi': 'Hi there! How can I assist you?',
    'help': 'I can help you with:\n- Product information\n- Order tracking\n- Returns and refunds\n- Shipping info\n- Account help',
    'products': 'Would you like to browse our products? Just let me know what category you\'re interested in!',
    'order': 'You can track your order here. Please provide your order ID or email address.',
    'shipping': 'Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days.',
    'return': 'We offer 30-day returns on most items. Items must be unused and in original packaging.',
    'refund': 'Refunds are processed within 5-7 business days after we receive your return.',
    'account': 'For account issues, please visit your profile page or contact our support team.',
    'price': 'Prices vary by product. Use our search to find items in your budget!',
    'delivery': 'We deliver to most countries. Delivery times vary based on your location.',
    'payment': 'We accept various payment methods including credit cards and digital wallets.',
}

def get_chatbot_response(user_message):
    """Generate a chatbot response based on user input"""
    message = user_message.lower().strip()
    
    # Check for exact or partial matches
    for key, response in RESPONSES.items():
        if key in message:
            return response
    
    # Default responses
    if '?' in message:
        return 'That\'s a great question! Could you provide more details so I can help better?'
    
    return 'I\'m here to help! Feel free to ask me about products, orders, shipping, returns, or anything else.'

# Chat endpoint
@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'success': False, 'error': 'Message cannot be empty'}), 400
        
        # Generate response
        bot_response = get_chatbot_response(user_message)
        
        return jsonify({
            'success': True,
            'data': {
                'user_message': user_message,
                'bot_response': bot_response,
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# FAQ endpoint
@chatbot_bp.route('/faq', methods=['GET'])
def get_faq():
    try:
        faqs = [
            {'q': 'How do I track my order?', 'a': 'Use your order ID to track in real-time on our platform.'},
            {'q': 'What is your return policy?', 'a': 'We offer 30-day returns on most items in unused condition.'},
            {'q': 'How long is shipping?', 'a': 'Standard: 5-7 days, Express: 2-3 days'},
            {'q': 'Do you ship internationally?', 'a': 'Yes, we ship to most countries worldwide.'},
            {'q': 'What payment methods do you accept?', 'a': 'Credit cards, debit cards, and digital wallets.'},
            {'q': 'How do I contact support?', 'a': 'Use our chat feature or email support@shopease.com'},
            {'q': 'Are prices final?', 'a': 'Prices are fixed unless there\'s a promotion running.'},
            {'q': 'Can I modify my order?', 'a': 'If not shipped, you can modify via your account.'},
        ]
        
        return jsonify({
            'success': True,
            'data': faqs
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Suggestions endpoint
@chatbot_bp.route('/suggestions', methods=['GET'])
def get_suggestions():
    try:
        suggestions = [
            'What are the latest products?',
            'How do I place an order?',
            'What\'s your return policy?',
            'Track my order',
            'Contact customer support',
            'View my account',
        ]
        
        return jsonify({
            'success': True,
            'data': suggestions
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
