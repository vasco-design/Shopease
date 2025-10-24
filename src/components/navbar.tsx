"use client"

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Menu } from 'lucide-react'
import { CartSheet } from '@/components/cart-sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Navbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramQuery = searchParams?.get('search') ?? ''
  const [searchQuery, setSearchQuery] = useState(paramQuery)

  // keep input in sync with URL param when navigation occurs elsewhere
  useEffect(() => {
    setSearchQuery(paramQuery)
  }, [paramQuery])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      // remove search param
      router.push('/products')
      return
    }

    const encoded = encodeURIComponent(trimmed)
    router.push(`/products?search=${encoded}`)
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <Link 
            href="/" 
            className="text-xl font-bold hover:text-primary transition-colors"
          >
            ShopEase
          </Link>

          {/* Navigation Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[200px]">
                      <NavigationMenuLink asChild>
                        <Link href="/products" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Products</div>
                          <p className="text-sm leading-snug text-muted-foreground">Browse all products</p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/categories" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Categories</div>
                          <p className="text-sm leading-snug text-muted-foreground">Shop by category</p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Contact
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="text-lg font-medium hover:text-primary transition-colors">
                    Home
                  </Link>
                  <Link href="/products" className="text-lg font-medium hover:text-primary transition-colors">
                    Products
                  </Link>
                  <Link href="/categories" className="text-lg font-medium hover:text-primary transition-colors">
                    Categories
                  </Link>
                  <Link href="/contact" className="text-lg font-medium hover:text-primary transition-colors">
                    Contact
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-64 pr-10"
                />
                <Button 
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <ThemeToggle />
            <CartSheet />
          </div>
        </div>
      </div>
    </nav>
  )
}