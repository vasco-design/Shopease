import Link from 'next/link'
import { PRODUCTS, type Product } from '@/lib/data'
import { ArrowRight, Smartphone, ShoppingBag, Home, Package } from 'lucide-react'
import { Suspense } from 'react'

const categoryIcons = {
  'Electronics': Smartphone,
  'Clothing': ShoppingBag,
  'Home Decor': Home,
  'default': Package
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}

function CategoriesContent() {
  const products = PRODUCTS
  const categories: string[] = Array.from(new Set(products.map((p: Product) => p.category)))

  // Get product count for each category
  const categoryCount = categories.reduce((acc: Record<string, number>, category: string) => {
    acc[category] = products.filter((p: Product) => p.category === category).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Shop by Category</h1>
        <p className="mt-4 text-lg text-gray-500">
          Explore our collections across different categories
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category: string) => {
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default
          
          return (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="group relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    {categoryCount[category]} items
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Browse our selection of {category.toLowerCase()} products
                  </p>
                </div>

                <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                  <span className="text-sm font-medium">View Collection</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="absolute inset-0 bg-linear-to-t from-white via-white/0 to-white/0 pointer-events-none" />
            </Link>
          )
        })}
      </div>

      {/* Featured Categories Banner */}
      <div className="mt-16 rounded-lg bg-blue-50 p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h2 className="text-2xl font-bold text-gray-900">Can&apos;t find what you need?</h2>
            <p className="mt-2 text-gray-600">
              Check out our complete product collection for more options
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
