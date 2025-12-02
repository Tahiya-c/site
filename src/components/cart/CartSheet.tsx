"use client";

import React from "react";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export function CartSheet() {
  const router = useRouter();
  const { items, increaseQty, decreaseQty, removeItem, clearCart } = useCartStore();
  const [open, setOpen] = React.useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    setOpen(false);
    router.push("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative border-amber-600 text-amber-600 hover:bg-amber-600/20">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Cart
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-xs text-white flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-neutral-900 border-l-neutral-700 overflow-y-auto w-full sm:max-w-md">
        {/* Sheet Header */}
        <div className="flex flex-col space-y-2 mb-6">
          <h2 className="text-2xl font-bold text-amber-500">Your Cart</h2>
          <p className="text-sm text-neutral-300">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="mt-2">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-neutral-500 mx-auto mb-4" />
              <p className="text-neutral-300">Your cart is empty</p>
              <p className="text-sm text-neutral-400 mt-2">Add some delicious items from our menu</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-neutral-800/60 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{item.name}</h4>
                      <p className="text-sm text-neutral-300">BDT {item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-neutral-300 hover:text-white hover:bg-neutral-700"
                        onClick={() => decreaseQty(item.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-white">{item.qty}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-neutral-300 hover:text-white hover:bg-neutral-700"
                        onClick={() => increaseQty(item.id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6 bg-neutral-700" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-300">Subtotal</span>
                  <span className="text-white">BDT {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-300">Tax (5%)</span>
                  <span className="text-white">BDT {tax.toFixed(2)}</span>
                </div>
                <Separator className="bg-neutral-700" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-amber-400">BDT {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white"
                  onClick={handleCheckout}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-700 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}