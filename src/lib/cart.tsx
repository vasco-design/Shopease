'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Product } from './products'

type CartItem = {
  product: Product
  quantity: number
  size: string
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product, quantity: number, size: string) => void
  removeFromCart: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  shipping: number
  tax: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const SHIPPING_COST = 25 // Fixed shipping cost
const TAX_RATE = 0.10 // 10% tax

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to load cart:', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, quantity: number, size: string) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(
        item => item.product.id === product.id && item.size === size
      )
      
      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...currentItems, { product, quantity, size }]
    })
  }

  const removeFromCart = (productId: string, size: string) => {
    setItems(currentItems =>
      currentItems.filter(
        item => !(item.product.id === productId && item.size === size)
      )
    )
  }

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId, size)
      return
    }
    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items?.reduce((total, item) => total + item.quantity, 0) ?? 0
  
  const subtotal = items?.reduce(
    (total, item) => total + (item.product.price * item.quantity),
    0
  ) ?? 0

  const shipping = SHIPPING_COST
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + shipping + tax

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        tax,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}