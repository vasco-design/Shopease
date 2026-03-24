from flask import Blueprint, request, jsonify
from app import db
from app.models.inventory import Inventory
from app.models.product import Product
from datetime import datetime

inventory_bp = Blueprint('inventory', __name__, url_prefix='/api/inventory')

# Get all inventory items
@inventory_bp.route('/', methods=['GET'])
def get_inventory():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        inventory_items = Inventory.query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [item.to_dict() for item in inventory_items.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': inventory_items.total,
                'pages': inventory_items.pages
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get low stock items
@inventory_bp.route('/low-stock', methods=['GET'])
def get_low_stock():
    try:
        low_stock_items = Inventory.query.filter(
            Inventory.stock <= Inventory.reorder_level
        ).all()
        
        return jsonify({
            'success': True,
            'data': [item.to_dict() for item in low_stock_items],
            'count': len(low_stock_items)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Update inventory stock
@inventory_bp.route('/<product_id>', methods=['PUT'])
def update_inventory(product_id):
    try:
        inventory = Inventory.query.filter_by(product_id=product_id).first()
        if not inventory:
            return jsonify({'success': False, 'error': 'Inventory not found'}), 404
        
        data = request.get_json()
        
        action = data.get('action', 'set')  # set, add, subtract
        quantity = data.get('quantity', 0)
        
        if action == 'set':
            inventory.stock = quantity
        elif action == 'add':
            inventory.stock += quantity
        elif action == 'subtract':
            inventory.stock = max(0, inventory.stock - quantity)
        
        if 'reorder_level' in data:
            inventory.reorder_level = data['reorder_level']
        
        inventory.last_updated = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Inventory updated: {action}',
            'data': inventory.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Get inventory for specific product
@inventory_bp.route('/<product_id>', methods=['GET'])
def get_product_inventory(product_id):
    try:
        inventory = Inventory.query.filter_by(product_id=product_id).first()
        if not inventory:
            return jsonify({'success': False, 'error': 'Inventory not found'}), 404
        
        return jsonify({
            'success': True,
            'data': inventory.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
