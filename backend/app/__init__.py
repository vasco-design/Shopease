from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///shopease.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)
    
    # Create tables
    with app.app_context():
        from app.models.product import Product
        from app.models.inventory import Inventory
        from app.models.order import Order, OrderItem
        from app.models.user import User
        db.create_all()
    
    # Register blueprints
    from app.routes.admin import admin_bp
    from app.routes.inventory import inventory_bp
    from app.routes.orders import orders_bp
    from app.routes.products import products_bp
    from app.routes.chatbot import chatbot_bp
    from app.routes.payment import payment_bp
    
    app.register_blueprint(admin_bp)
    app.register_blueprint(inventory_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(chatbot_bp)
    app.register_blueprint(payment_bp)
    
    return app
