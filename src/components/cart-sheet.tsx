'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/lib/cart';
import { ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export function CartSheet() {
  const { items, totalItems, total, updateQuantity, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCheckingOut(false);
    alert(`This is a demo - no actual checkout process is implemented`);
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative flex items-center text-gray-700 hover:text-gray-900">
          <ShoppingBag className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({totalItems} items)</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.product.id} className="py-6 flex">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden">
                    <Image
                      src={item.product.img}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{item.product.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">{formatPrice(item.product.price)}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="rounded-full p-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="mx-2 text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="rounded-full p-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {items.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-6 mt-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${total.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
