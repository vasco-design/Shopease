from flask import Blueprint, request, jsonify
from app import db
from app.models.product import Product

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

# Get all products
@products_bp.route('/', methods=['GET'])
def get_products():
    try:
        category = request.args.get('category', None)
        search = request.args.get('search', None)
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = Product.query
        
        if category:
            query = query.filter_by(category=category)
        
        if search:
            query = query.filter(
                (Product.title.ilike(f'%{search}%')) |
                (Product.desc.ilike(f'%{search}%'))
            )
        
        products = query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [product.to_dict() for product in products.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': products.total,
                'pages': products.pages
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get specific product
@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'success': False, 'error': 'Product not found'}), 404
        
        return jsonify({
            'success': True,
            'data': product.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get products by category
@products_bp.route('/category/<category>', methods=['GET'])
def get_by_category(category):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        products = Product.query.filter_by(category=category).paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [product.to_dict() for product in products.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': products.total,
                'pages': products.pages
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Get all categories
@products_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = db.session.query(Product.category).distinct().all()
        category_list = [cat[0] for cat in categories if cat[0]]
        
        return jsonify({
            'success': True,
            'data': category_list
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
