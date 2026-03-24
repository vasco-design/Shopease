from app import db
from datetime import datetime

class Inventory(db.Model):
    __tablename__ = 'inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.String(50), db.ForeignKey('products.id'), unique=True, nullable=False)
    stock = db.Column(db.Integer, default=0)
    reorder_level = db.Column(db.Integer, default=10)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_title': self.product.title,
            'stock': self.stock,
            'reorder_level': self.reorder_level,
            'last_updated': self.last_updated.isoformat(),
            'status': 'Low Stock' if self.stock <= self.reorder_level else 'In Stock'
        }
