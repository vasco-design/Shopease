import { PRODUCTS } from '@/lib/data'
import type { Product } from '@/lib/data'
import { Metadata } from 'next'
import ProductDetails from './ProductDetails'

async function getProduct(id: string): Promise<Product | undefined> {
  return PRODUCTS.find(p => p.id === id);
}

type Props = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product ? `${product.title} - ShopEase` : 'Product Not Found',
    description: product?.desc || 'Product not found'
  };
}

const ProductDetailsPage = async ({ params }: Props) => {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
          <p className="mt-2 text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}

export default ProductDetailsPage;

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }))
}
