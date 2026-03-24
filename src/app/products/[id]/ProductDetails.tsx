'use client'

import type { Product } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/lib/cart'
import { ShoppingCart, Check, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ProductDetailsProps {
  product: Product | undefined;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter()
  const { addToCart, items } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  // Set initial size when product loads
  useEffect(() => {
    if (product && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0])
    }
  }, [product])

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="mt-2 text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products" className="mt-6 inline-block text-blue-600 hover:text-blue-700">
          &larr; Back to products
        </Link>
      </div>
    )
  }

  const isInCart = items.some(item => item.product.id === product.id && item.size === selectedSize)

  const handleAddToCart = () => {
    if (!selectedSize) return
    
    setIsAdding(true)
    addToCart(product, quantity, selectedSize)
    
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const handleBuyNow = () => {
    if (!selectedSize) return
    
    setIsBuying(true)
    addToCart(product, quantity, selectedSize)
    router.push('/checkout')
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
      <div className="rounded-lg overflow-hidden shadow relative h-96">
        <Image 
          src={product.img} 
          alt={product.title} 
          fill 
          className="object-cover" 
          sizes="(max-width: 768px) 100vw, 50vw"
          priority 
        />
      </div>

      <div>
        <div className="mb-6">
          <Link 
            href="/products" 
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to products
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
        <p className="mt-2 text-sm text-blue-600">{product.category}</p>
        <p className="mt-4 text-2xl font-semibold text-gray-900">
          {formatPrice(product.price)}
        </p>
        
        <div className="mt-4 prose prose-gray">
          <p className="text-gray-600">{product.desc}</p>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Size
            </label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              {product.sizes.map((size: string) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isInCart || isAdding}
              className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md ${
                isInCart
                  ? 'bg-green-600 hover:bg-green-700'
                  : isAdding
                  ? 'bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isInCart ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Added to Cart
                </>
              ) : isAdding ? (
                'Adding...'
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </>
              )}
            </button>
            
            <button
              onClick={handleBuyNow}
              disabled={isBuying || !selectedSize}
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md bg-orange-600 hover:bg-orange-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {isBuying ? (
                'Processing...'
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Buy Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}