// Product type definition
export type Product = {
  id: string;
  title: string;  // product name/title
  price: number;
  category: string;
  img: string;    // product image URL
  desc: string;   // product description
  sizes: string[]; // Array of available sizes
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Classic White T-Shirt",
    price: 299,
    category: "Clothing",
    img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500",
    desc: "Comfortable cotton tee — perfect for everyday wear",
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "p2",
    title: "Running Sneakers",
    price: 999,
    category: "Shoes",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    desc: "Lightweight sneakers built for comfort and speed",
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"]
  },
  {
    id: "p3",
    title: "Denim Jacket",
    price: 799,
    category: "Clothing",
    img: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800",
    desc: "Stylish denim jacket — looks great with everything",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "p4",
    title: "Wireless Headphones",
    price: 1499,
    category: "Electronics",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    desc: "Premium wireless headphones with noise cancellation",
    sizes: ["One Size"]
  },
  {
    id: "p5",
    title: "Smart Watch",
    price: 1999,
    category: "Electronics",
    img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800",
    desc: "Track your fitness and stay connected on the go",
    sizes: ["One Size"]
  },
  {
    id: "p6",
    title: "Leather Backpack",
    price: 699,
    category: "Accessories",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    desc: "Stylish and spacious backpack for everyday use",
    sizes: ["One Size"]
  },
  {
    id: "p7",
    title: "Sunglasses",
    price: 299,
    category: "Accessories",
    img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
    desc: "Classic design with UV protection",
    sizes: ["One Size"]
  },
  {
    id: "p8",
    title: "Scented Candle Set",
    price: 399,
    category: "Home & Living",
    img: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=800",
    desc: "Set of 3 luxury scented candles",
    sizes: ["One Size"]
  },
  {
    id: "p9",
    title: "Throw Blanket",
    price: 499,
    category: "Home & Living",
    img: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=800",
    desc: "Soft and cozy throw blanket for your home",
    sizes: ["One Size"]
  },
  {
    id: "p10",
    title: "Yoga Mat",
    price: 399,
    category: "Sports & Outdoors",
    img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
    desc: "Premium non-slip yoga mat with carrying strap",
    sizes: ["One Size"]
  },
  {
    id: "p11",
    title: "Tennis Racket",
    price: 999,
    category: "Sports & Outdoors",
    img: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800",
    desc: "Professional grade tennis racket",
    sizes: ["One Size"]
  },
  {
    id: "p12",
    title: "Hiking Boots",
    price: 1299,
    category: "Shoes",
    img: "https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=800",
    desc: "Waterproof hiking boots for all terrains",
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"]
  }
];

export const getCategories = () => {
  const categories = PRODUCTS.map(product => product.category);
  return [...new Set(categories)];
};

export const getProductsByCategory = (category: string) => {
  return PRODUCTS.filter(product => product.category === category);
};

export const getProductById = (id: string) => {
  return PRODUCTS.find(product => product.id === id);
};

export const getAllProducts = () => PRODUCTS;

// Price formatting moved to utils.ts
