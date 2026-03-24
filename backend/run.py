from app import create_app, db
from app.models.product import Product
from app.models.inventory import Inventory

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Initialize sample products if not exists
        if Product.query.count() == 0:
            sample_products = [
                {
                    'id': 'p1',
                    'title': 'Classic White T-Shirt',
                    'price': 299,
                    'category': 'Clothing',
                    'img': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500',
                    'desc': 'Comfortable cotton tee — perfect for everyday wear',
                    'sizes': 'XS,S,M,L,XL',
                    'stock': 50
                },
                {
                    'id': 'p2',
                    'title': 'Running Sneakers',
                    'price': 999,
                    'category': 'Shoes',
                    'img': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
                    'desc': 'Lightweight sneakers built for comfort and speed',
                    'sizes': 'US 7,US 8,US 9,US 10,US 11',
                    'stock': 30
                },
                {
                    'id': 'p3',
                    'title': 'Denim Jacket',
                    'price': 799,
                    'category': 'Clothing',
                    'img': 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800',
                    'desc': 'Stylish denim jacket — looks great with everything',
                    'sizes': 'S,M,L,XL',
                    'stock': 25
                },
                {
                    'id': 'p4',
                    'title': 'Wireless Headphones',
                    'price': 1499,
                    'category': 'Electronics',
                    'img': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
                    'desc': 'Premium wireless headphones with noise cancellation',
                    'sizes': 'One Size',
                    'stock': 15
                },
            ]
            
            for prod in sample_products:
                product = Product(
                    id=prod['id'],
                    title=prod['title'],
                    price=prod['price'],
                    category=prod['category'],
                    img=prod['img'],
                    desc=prod['desc'],
                    sizes=prod['sizes']
                )
                db.session.add(product)
                db.session.flush()
                
                inventory = Inventory(
                    product_id=product.id,
                    stock=prod['stock'],
                    reorder_level=10
                )
                db.session.add(inventory)
            
            db.session.commit()
            print("Sample products initialized!")
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
