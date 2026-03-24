'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { MotionDiv, fadeInUp, stagger } from '@/lib/framer-animations';
import { PRODUCTS, type Product } from '@/lib/data';
import ProductCard from '@/components/ui/ProductCard';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [products] = useState(PRODUCTS);
  const featuredProducts = products.slice(0, 4);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
                <span className="block">Welcome to ShopEase</span>
                <span className="block text-primary">Shopping Made Simple</span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl max-w-2xl">
                Discover our curated collection of premium products. From fashion to electronics, 
                find everything you need in one place.
              </p>
              <div className="mt-8">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:opacity-90 md:py-4 md:text-lg md:px-10 transition-opacity"
                >
                  Shop Now
                </Link>
              </div>
            </MotionDiv>
            
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:block"
            >
              <div className="relative w-full h-[500px] overflow-hidden rounded-r-3xl shadow-xl">
                <Image
                  src="/images/hero.jpeg"
                  alt="Modern shopping experience"
                  className="object-cover object-center"
                  fill
                  priority
                  quality={100}
                />
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <MotionDiv
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Featured Products</h2>
          <Link href="/products" className="text-primary hover:opacity-80 flex items-center transition-opacity">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </MotionDiv>
        
        <MotionDiv
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
        >
          {featuredProducts.map((product: Product) => (
            <MotionDiv key={product.id} variants={fadeInUp}>
              <ProductCard product={product} />
            </MotionDiv>
          ))}
        </MotionDiv>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <MotionDiv
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Shop by Category</h2>
            <p className="mt-4 text-lg text-muted-foreground">Explore our wide range of categories</p>
          </MotionDiv>

          <MotionDiv
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from(new Set(products.map((p: Product) => p.category))).map((category: string) => (
              <MotionDiv
                key={category}
                variants={fadeInUp}
                className="group relative bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-border"
              >
                <Link href={`/categories?category=${category}`} className="block">
                  <div className="aspect-w-3 aspect-h-2">
                    <div className="p-8 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <h3 className="text-xl font-semibold text-foreground">{category}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Explore our {category.toLowerCase()} collection
                    </p>
                  </div>
                </Link>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-muted/50 mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="px-6 py-6 bg-primary rounded-lg md:py-12 md:px-12 lg:py-16 lg:px-16 xl:flex xl:items-center">
            <div className="xl:w-0 xl:flex-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-primary-foreground sm:text-3xl">
                Want product news and updates?
              </h2>
              <p className="mt-3 max-w-3xl text-lg leading-6 text-primary-foreground/80">
                Sign up for our newsletter to stay up to date.
              </p>
            </div>
            <div className="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
              <form
                className="sm:flex"
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.currentTarget
                  const email = (form.querySelector('input[name="email"]') as HTMLInputElement)?.value
                  if (email) {
                    form.reset()
                    alert('Thanks! We\'ll send updates to ' + email)
                  }
                }}
              >
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-5 py-3 placeholder-primary-foreground/60 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 focus:ring-offset-primary"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="mt-3 w-full flex items-center justify-center px-5 py-3 border border-transparent shadow text-base font-medium rounded-lg text-primary bg-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 focus:ring-offset-primary sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0 transition-opacity"
                >
                  Notify me
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
