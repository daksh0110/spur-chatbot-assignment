'use client';

import { ChatWidget } from "@/components/chat/ChatWidget";
import productsData from "@/app/data/products.json";
import { useState } from "react";

export default function Home() {
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());

  const handleAddToCart = (id: number) => {
    setAddedItems((prev) => new Set(prev).add(id));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            E-Commerce Store
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Browse our latest collection. Have a question? Ask our AI assistant
            using the chat widget in the corner!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsData.products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-zinc-900 dark:text-white leading-tight">
                    {product.name}
                  </h3>
                  <span className="font-medium text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-sm">
                    {product.price}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                  {product.description}
                </p>
                <button 
                  onClick={() => handleAddToCart(product.id)}
                  className={`w-full py-2.5 font-medium rounded-xl transition-colors ${
                    addedItems.has(product.id)
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                  }`}
                >
                  {addedItems.has(product.id) ? "Added" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}
