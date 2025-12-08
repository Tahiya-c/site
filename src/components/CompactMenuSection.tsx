"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  badge?: 'bestseller' | 'premium' | 'popular';
}

interface CompactMenuSectionProps {
  menuItems: MenuItem[];
  onAddToCart: (item: any) => void;
}

const CompactMenuSection: React.FC<CompactMenuSectionProps> = ({ menuItems, onAddToCart }) => {
  // Filter items without images
  const itemsWithoutImages = menuItems.filter(item => !item.image);

  // Group by category
  const itemsByCategory = itemsWithoutImages.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categoryNames: Record<string, string> = {
    "appetizer": "Appetizers",
    "sides": "Sides", 
    "sauces": "Sauces",
    "margaritas-mojitos": "Drinks - Margaritas & Mojitos",
    "shakes-smoothies": "Drinks - Shakes & Smoothies",
    "soft-drinks": "Drinks - Soft Drinks"
  };

  return (
    <section className="py-12 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-amber-600 uppercase tracking-wider text-sm font-semibold mb-3">MORE OPTIONS</p>
          <h2 className="text-3xl font-bold mb-4">
            Complete Your <span className="text-amber-600">Order</span>
          </h2>
        </div>

        {/* Render each category */}
        {Object.entries(itemsByCategory).map(([category, items]) => (
          <div key={category} className="mb-8">
            {/* Category Header */}
            <h3 className="text-xl font-bold mb-4 text-white border-b border-neutral-700 pb-2">
              {categoryNames[category] || category}
            </h3>
            
            {/* Compact Grid - Many items per row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-3 hover:bg-neutral-800/60 hover:border-amber-600/30 transition-all cursor-pointer group"
                >
                  {/* Item Name */}
                  <h4 className="font-medium text-sm text-white mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-amber-600 transition-colors">
                    {item.name}
                  </h4>
                  
                  {/* Description - only for appetizers */}
                  {category === 'appetizer' && item.description && (
                    <p className="text-neutral-500 text-xs mb-2 line-clamp-2 min-h-[2rem]">
                      {item.description}
                    </p>
                  )}
                  
                  {/* Price and Add Button */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-amber-600 font-bold text-sm">৳{item.price}</span>
                    <Button 
                      size="sm" 
                      className="h-6 w-6 p-0 bg-red-800 hover:bg-red-700 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-8 pt-6 border-t border-neutral-800">
          <p className="text-neutral-400 text-sm">
            ✨ Tap <span className="text-amber-600 font-semibold">+</span> to add items instantly to your cart
          </p>
        </div>
      </div>
    </section>
  );
};

export default CompactMenuSection;