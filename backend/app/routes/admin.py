from flask import Blueprint, request, jsonify
from app import db
from app.models.product import Product
from app.models.inventory import Inventory
from datetime import datetime

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# Admin Dashboard - Get Statistics
@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    try:
        total_products = Product.query.count()
        total_inventory = db.session.query(db.func.sum(Inventory.stock)).scalar() or 0
        low_stock_items = Inventory.query.filter(Inventory.stock <= Inventory.reorder_level).count()
        
        from app.models.order import Order
        total_orders = Order.query.count()
        total_revenue = db.session.query(db.func.sum(Order.total_amount)).filter(
            Order.payment_status == 'Completed'
        ).scalar() or 0
        
        return jsonify({
            'success': True,
            'data': {
                'total_products': total_products,
                'total_inventory': total_inventory,
                'low_stock_items': low_stock_items,
                'total_orders': total_orders,
                'total_revenue': float(total_revenue),
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Admin - Add Product
@admin_bp.route('/products', methods=['POST'])
def add_product():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['id', 'title', 'price', 'category', 'desc']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # Check if product already exists
        if Product.query.get(data['id']):
            return jsonify({'success': False, 'error': 'Product already exists'}), 400
        
        product = Product(
            id=data['id'],
            title=data['title'],
            price=data['price'],
            category=data['category'],
            img=data.get('img', ''),
            desc=data['desc'],
            sizes=','.join(data.get('sizes', []))
        )
        
        db.session.add(product)
        
        # Create inventory record
        inventory = Inventory(
            product_id=product.id,
            stock=data.get('stock', 0),
            reorder_level=data.get('reorder_level', 10)
        )
        db.session.add(inventory)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product added successfully',
            'data': product.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Admin - Update Product
@admin_bp.route('/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'success': False, 'error': 'Product not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            product.title = data['title']
        if 'price' in data:
            product.price = data['price']
        if 'category' in data:
            product.category = data['category']
        if 'desc' in data:
            product.desc = data['desc']
        if 'img' in data:
            product.img = data['img']
        if 'sizes' in data:
            product.sizes = ','.join(data['sizes'])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product updated successfully',
            'data': product.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Admin - Delete Product
@admin_bp.route('/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'success': False, 'error': 'Product not found'}), 404
        
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product deleted successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# Admin - Get All Products
@admin_bp.route('/products', methods=['GET'])
def get_all_products():
    try:
        products = Product.query.all()
        return jsonify({
            'success': True,
            'data': [product.to_dict() for product in products]
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
