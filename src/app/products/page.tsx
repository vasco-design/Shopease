'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ui/ProductCard'
import { PRODUCTS, type Product } from '@/lib/data'

import { MotionDiv, stagger, fadeInUp, slideIn } from '@/lib/framer-animations'
import { GlobalLoading } from '@/components/ui/loading'
import { formatPrice } from '@/lib/utils'

function ProductsContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get('search')?.toLowerCase() || ''
  const categoryParam = searchParams?.get('category') || ''

  const [loading, setLoading] = useState(true)
  const [products] = useState(PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [sortBy, setSortBy] = useState('default')
  const [priceRange, setPriceRange] = useState([0, 5000]) // Max price in INR (₹5000)

  useEffect(() => {
    // Simulate loading state for better UX
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  // Get unique categories
  const categories: string[] = ['All', ...new Set(products.map((p: Product) => p.category))]

  // Filter products
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = !searchQuery || 
      product.title.toLowerCase().includes(searchQuery) ||
      product.desc.toLowerCase().includes(searchQuery)
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || 
      product.category === selectedCategory
    
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  if (loading) return <GlobalLoading />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <MotionDiv
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-500">
            Showing results for &quot;{searchQuery}&quot;
          </p>
        )}
      </MotionDiv>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
        {/* Filters */}
        <MotionDiv
          variants={slideIn}
          initial="initial"
          animate="animate"
          className="lg:col-span-1"
        >
          <div className="space-y-6">
            {/* Category filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">Categories</h3>
              <div className="mt-4 space-y-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedCategory === category 
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label htmlFor="min-price" className="block text-xs text-gray-500 mb-1">Min Price</label>
                    <input
                      type="number"
                      id="min-price"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = Math.min(Number(e.target.value), priceRange[1]);
                        setPriceRange([value, priceRange[1]]);
                      }}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="₹0"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="max-price" className="block text-xs text-gray-500 mb-1">Max Price</label>
                    <input
                      type="number"
                      id="max-price"
                      min={priceRange[0]}
                      max="5000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = Math.max(Number(e.target.value), priceRange[0]);
                        setPriceRange([priceRange[0], value]);
                      }}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="₹5000"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex justify-between px-1">
                  <span>Min: {formatPrice(priceRange[0])}</span>
                  <span>Max: {formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            {/* Sort options */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </MotionDiv>

        {/* Product grid */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          ) : (
            <MotionDiv
              variants={stagger}
              initial="initial"
              animate="animate" 
              className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
            >
              {sortedProducts.map((product) => (
                <MotionDiv key={product.id} variants={fadeInUp}>
                  <ProductCard product={product} />
                </MotionDiv>
              ))}
            </MotionDiv>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<GlobalLoading />}>
      <ProductsContent />
    </Suspense>
  )
}
