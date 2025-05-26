"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"

interface Product {
  id: string
  name: string
  category: string
  sold: number
  revenue: number
  image: string
}

const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Women's T-shirt with Print",
    category: "T-shirts",
    sold: 342,
    revenue: 205200,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "p2",
    name: "Men's Classic Jeans",
    category: "Jeans",
    sold: 276,
    revenue: 193200,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "p3",
    name: "Women's Summer Dress",
    category: "Dresses",
    sold: 234,
    revenue: 187200,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "p4",
    name: "Men's Seasonal Jacket",
    category: "Outerwear",
    sold: 198,
    revenue: 178200,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "p5",
    name: "Women's Casual Sneakers",
    category: "Footwear",
    sold: 187,
    revenue: 149600,
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function PopularProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [sortBy, setSortBy] = useState<"sold" | "revenue">("revenue")

  useEffect(() => {
    // Sort products by the selected criteria
    const sortedProducts = [...initialProducts].sort((a, b) =>
      sortBy === "revenue" ? b.revenue - a.revenue : b.sold - a.sold,
    )
    setProducts(sortedProducts)
  }, [sortBy])

  // Calculate the maximum revenue for progress bar scaling
  const maxRevenue = Math.max(...products.map((p) => p.revenue))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">This Month's Top Sellers</h3>
        <div className="flex gap-2">
          <button
            className={`text-xs px-2 py-1 rounded ${sortBy === "sold" ? "bg-pink-100 text-pink-800" : "bg-gray-100"}`}
            onClick={() => setSortBy("sold")}
          >
            By Units
          </button>
          <button
            className={`text-xs px-2 py-1 rounded ${sortBy === "revenue" ? "bg-pink-100 text-pink-800" : "bg-gray-100"}`}
            onClick={() => setSortBy("revenue")}
          >
            By Revenue
          </button>
        </div>
      </div>

      {products.map((product) => (
        <div key={product.id} className="flex items-center gap-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={60}
            height={60}
            className="rounded-md border"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{product.name}</h4>
            <p className="text-xs text-muted-foreground">{product.category}</p>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium">Sold: {product.sold}</span>
              <div className="flex-1 mx-2">
                <Progress value={(product.revenue / maxRevenue) * 100} className="h-1.5" />
              </div>
              <span className="text-xs font-medium text-pink-600">${product.revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
