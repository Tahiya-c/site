"use client";

import React, { useState } from "react";
import { ShoppingCart, ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { menuItems, categories } from "@/data/menu";
import { CartSheet } from "@/components/cart/CartSheet";
import Link from "next/link";

const badgeColorMap = {
  bestseller: "bg-green-600 hover:bg-green-600",
  premium: "bg-amber-600 hover:bg-amber-600",
  popular: "bg-blue-600 hover:bg-blue-600",
} as const;

export default function FullMenuPage() {
  const { addItem } = useCartStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAddToCart = (item: typeof menuItems[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || "",
      qty: 1,
    });
  };

  const filteredCategories = selectedCategory
    ? categories.filter((cat) => cat.id === selectedCategory)
    : categories;

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-amber-600 hover:text-amber-500">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Full Menu</h1>
          <CartSheet />
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-neutral-800 border-b border-neutral-700 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-neutral-400 flex-shrink-0" />
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-amber-600" : ""}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? "bg-amber-600" : ""}
              >
                {cat.icon} {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredCategories.map((category) => {
          const items = menuItems.filter((item) => item.category === category.id);
          if (items.length === 0) return null;

          return (
            <div key={category.id} className="mb-12" id={category.id}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{category.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold text-amber-500">{category.name}</h2>
                  <p className="text-neutral-400 text-sm">{items.length} items</p>
                </div>
              </div>

              {/* Compact Grid Layout for Small Items */}
              {['sides', 'sauces', 'soft-drinks'].includes(category.id) ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className="bg-neutral-800 border-neutral-700 hover:border-amber-600/50 transition-all"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white leading-tight">{item.name}</h3>
                            <p className="text-xs text-neutral-400 mt-1">{item.description}</p>
                          </div>
                          {item.badge && (
                            <Badge className={`${badgeColorMap[item.badge]} text-xs ml-2 flex-shrink-0`}>
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-amber-500 font-bold">৳{item.price}</span>
                          <Button
                            size="sm"
                            className="bg-amber-700 hover:bg-amber-600 h-8"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                /* Regular Layout for Main Items */
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className="bg-neutral-800 border-neutral-700 hover:border-amber-600/50 transition-all group"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-white">{item.name}</h3>
                            <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{item.description}</p>
                          </div>
                          {item.badge && (
                            <Badge className={`${badgeColorMap[item.badge]} ml-2 flex-shrink-0`}>
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <Separator className="bg-neutral-700 my-3" />
                        <div className="flex items-center justify-between">
                          <span className="text-amber-500 font-bold text-xl">৳{item.price}</span>
                          <Button
                            className="bg-amber-700 hover:bg-amber-600"
                            onClick={() => handleAddToCart(item)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Separator className="bg-neutral-700 mt-8" />
            </div>
          );
        })}
      </div>
    </div>
  );
}