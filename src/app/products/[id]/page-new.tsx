import { PRODUCTS } from '@/lib/data'
import type { Product } from '@/lib/data'
import { Metadata } from 'next'
import ProductDetails from './ProductDetails'

function getProduct(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export async function generateMetadata({
  params
}: {
  params: { id: string }
}): Promise<Metadata> {
  const product = getProduct(params.id);
  return {
    title: product ? `${product.title} - ShopEase` : 'Product Not Found',
    description: product?.desc || 'Product not found'
  };
}

interface PageProps {
  params: { id: string };
}

export default function ProductPage({ params }: PageProps) {
  const product = getProduct(params.id);

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto py-8">
      <ProductDetails product={product} />
    </div>
  );
}