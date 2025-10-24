'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Check, Zap } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { type Product } from '@/lib/data'
import { formatPrice } from '@/lib/utils'

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const { addToCart, items } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [isBuying, setIsBuying] = useState(false)

  const isInCart = items.some(item => item.product.id === product.id && item.size === selectedSize)

  const handleAddToCart = () => {
    setIsAdding(true)
    addToCart(product, 1, selectedSize)
    
    // Reset the adding state after a brief delay
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const handleBuyNow = () => {
    setIsBuying(true)
    addToCart(product, 1, selectedSize)
    router.push('/checkout')
  }

  return (
    <article className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <Link href={`/products/${product.id}`} className="block relative h-64 w-full overflow-hidden">
        <Image 
          src={product.img} 
          alt={product.title} 
          fill 
          className="object-cover transform group-hover:scale-105 transition-transform duration-300" 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
        />
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <p className="text-sm text-blue-600 mb-1">{product.category}</p>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-2">
          <label htmlFor={`size-${product.id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          <select
            id={`size-${product.id}`}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mb-3"
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                isAdding || isInCart
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAdding || isInCart ? (
                <>
                  <Check size={16} />
                  <span>{isAdding ? 'Adding...' : 'In Cart'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isBuying}
              className="flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-all duration-300"
            >
              <Zap size={16} />
              <span>{isBuying ? 'Processing...' : 'Buy Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
