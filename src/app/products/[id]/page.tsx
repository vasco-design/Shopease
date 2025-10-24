import { PRODUCTS } from '@/lib/data'
import type { Product } from '@/lib/data'
import ProductDetails from './ProductDetails'
import { Metadata } from 'next'

function getProduct(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = getProduct(params.id);
  return {
    title: product ? `${product.title} - ShopEase` : 'Product Not Found',
    description: product?.desc || 'Product not found'
  };
}

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }))
}

export default function Page({
  params,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const product = getProduct(params.id);
  return <ProductDetails product={product} />;
}
