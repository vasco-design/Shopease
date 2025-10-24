'use client'

import Link from 'next/link'
import Image from 'next/image'
import { type Product } from '../lib/data'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 w-full mb-4">
          <Image src={product.img} alt={product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      </Link>
      <div>
        <h3 className="font-semibold text-lg">{product.title}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="mt-2 font-semibold">${(product.price / 100).toFixed(2)}</p>
      </div>
    </div>
  )
}
