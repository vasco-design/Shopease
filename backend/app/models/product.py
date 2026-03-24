from app import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    img = db.Column(db.String(500), nullable=True)
    desc = db.Column(db.Text, nullable=True)
    sizes = db.Column(db.String(500), nullable=True)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    inventory = db.relationship('Inventory', backref='product', uselist=False, cascade='all, delete-orphan')
    order_items = db.relationship('OrderItem', backref='product', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'price': self.price,
            'category': self.category,
            'img': self.img,
            'desc': self.desc,
            'sizes': self.sizes.split(',') if self.sizes else [],
            'stock': self.inventory.stock if self.inventory else 0
        }
