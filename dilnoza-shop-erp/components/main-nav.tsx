"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ShoppingBag } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
        <ShoppingBag className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">DILNOZA shop</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
          )}
        >
          DASHBORD
        </Link>
        <Link
          href="/dashboard/inventory"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/dashboard/inventory" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Inventory
        </Link>
        <Link
          href="/dashboard/orders"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/dashboard/orders" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Orders
        </Link>
        <Link
          href="/dashboard/customers"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/dashboard/customers" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Customers
        </Link>
        <Link
          href="/dashboard/reports"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/dashboard/reports" ? "text-primary" : "text-muted-foreground",
          )}
        >
          Reports
        </Link>
      </nav>
    </div>
  )
}
