from flask import Blueprint, request, jsonify
from app import db
from app.models.order import Order, OrderItem
from app.models.inventory import Inventory
from app.models.product import Product
from datetime import datetime

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

# Create new order
@orders_bp.route('/', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['customer_name', 'customer_email', 'customer_phone', 'address', 'items']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # Calculate total
        total_amount = 0
        items = data.get('items', [])
        
        if not items:
            return jsonify({'success': False, 'error': 'Order must contain items'}), 400
        
        # Create order
        order = Order(
            customer_name=data['customer_name'],
            customer_email=data['customer_email'],
            customer_phone=data['customer_phone'],
            address=data['address'],
            status='Pending',
            payment_status='Pending'
        )
        
        db.session.add(order)
        db.session.flush()
        
        # Add items and update inventory
        for item in items:
            product = Product.query.get(item['product_id'])
            if not product:
                db.session.rollback()
                return jsonify({'success': False, 'error': f"Product {item['product_id']} not found"}), 404
            
            quantity = item['quantity']
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=quantity,
                price=product.price
            )
            db.session.add(order_item)
            total_amount += quantity * product.price
            
            # Update inventory
            inventory = Inventory.query.filter_by(product_id=product.id).first()
            if inventory:
                inventory.stock = max(0, inventory.stock - quantity)
        
        order.total_amount = total_amount
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Order created successfully',
            'data': order.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Get all orders
@orders_bp.route('/', methods=['GET'])
def get_orders():
    try:
        status = request.args.get('status', None)
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = Order.query
        if status:
            query = query.filter_by(status=status)
        
        orders = query.order_by(Order.created_at.desc()).paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [order.to_dict() for order in orders.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': orders.total,
                'pages': orders.pages
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get specific order
@orders_bp.route('/<order_id>', methods=['GET'])
def get_order(order_id):
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'success': False, 'error': 'Order not found'}), 404
        
        return jsonify({
            'success': True,
            'data': order.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Update order status
@orders_bp.route('/<order_id>', methods=['PUT'])
def update_order(order_id):
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'success': False, 'error': 'Order not found'}), 404
        
        data = request.get_json()
        
        if 'status' in data:
            valid_statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
            if data['status'] not in valid_statuses:
                return jsonify({'success': False, 'error': 'Invalid status'}), 400
            order.status = data['status']
        
        if 'payment_status' in data:
            valid_payment_statuses = ['Pending', 'Completed', 'Failed']
            if data['payment_status'] not in valid_payment_statuses:
                return jsonify({'success': False, 'error': 'Invalid payment status'}), 400
            order.payment_status = data['payment_status']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Order updated successfully',
            'data': order.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Cancel order
@orders_bp.route('/<order_id>/cancel', methods=['POST'])
def cancel_order(order_id):
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'success': False, 'error': 'Order not found'}), 404
        
        if order.status == 'Delivered':
            return jsonify({'success': False, 'error': 'Cannot cancel delivered order'}), 400
        
        # Restore inventory
        for item in order.items:
            inventory = Inventory.query.filter_by(product_id=item.product_id).first()
            if inventory:
                inventory.stock += item.quantity
        
        order.status = 'Cancelled'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Order cancelled successfully',
            'data': order.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
