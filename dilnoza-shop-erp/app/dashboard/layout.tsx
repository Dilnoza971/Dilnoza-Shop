"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/user-nav"
import { Suspense } from "react"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart2,
  Warehouse,
  ClipboardList,
  Truck,
  MessageSquare,
  Megaphone,
  Calendar,
  DollarSign,
  FileText,
  UserCog,
  Menu,
  Search,
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navItems = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
      active: pathname === "/dashboard/orders",
    },
    {
      title: "Products",
      href: "/dashboard/inventory",
      icon: Package,
      active: pathname === "/dashboard/inventory",
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: Users,
      active: pathname === "/dashboard/customers",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart2,
      active: pathname === "/dashboard/analytics",
    },
    {
      title: "Warehouse",
      href: "/dashboard/warehouse",
      icon: Warehouse,
      active: pathname === "/dashboard/warehouse",
    },
    {
      title: "Inventory Control",
      href: "/dashboard/inventory-control",
      icon: ClipboardList,
      active: pathname === "/dashboard/inventory-control",
    },
    {
      title: "Supplies",
      href: "/dashboard/supplies",
      icon: Truck,
      active: pathname === "/dashboard/supplies",
    },
    {
      title: "Communications",
      href: "/dashboard/communications",
      icon: MessageSquare,
      active: pathname === "/dashboard/communications",
    },
    {
      title: "Marketing",
      href: "/dashboard/marketing",
      icon: Megaphone,
      active: pathname === "/dashboard/marketing",
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
      active: pathname === "/dashboard/calendar",
    },
    {
      title: "Finances",
      href: "/dashboard/finances",
      icon: DollarSign,
      active: pathname === "/dashboard/finances",
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
      active: pathname === "/dashboard/reports",
    },
    {
      title: "Staff",
      href: "/dashboard/staff",
      icon: UserCog,
      active: pathname === "/dashboard/staff",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <div className="border-b md:hidden">
        <div className="flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="ml-4 font-bold text-xl flex items-center">
            <Package className="h-6 w-6 mr-2 text-pink-500" />
            <span>Dilnoza Shop</span>
          </div>
          <div className="ml-auto">
            <UserNav />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-background shadow-lg">
            <div className="flex h-16 items-center border-b px-4">
              <div className="font-bold text-xl flex items-center">
                <Package className="h-6 w-6 mr-2 text-pink-500" />
                <span>Dilnoza Shop</span>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleMobileMenu}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            <div className="py-4">
              <nav className="flex flex-col space-y-1 px-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      item.active
                        ? "bg-pink-100 text-pink-900"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col border-r bg-background transition-all duration-300",
            isSidebarOpen ? "w-64" : "w-[70px]",
          )}
        >
          <div className="flex h-16 items-center border-b px-4">
            <div className={cn("font-bold text-xl flex items-center", !isSidebarOpen && "justify-center")}>
              <Package className="h-6 w-6 text-pink-500" />
              {isSidebarOpen && <span className="ml-2">Dilnoza Shop</span>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn("ml-auto", !isSidebarOpen && "hidden")}
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <div className="flex flex-col space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    item.active
                      ? "bg-pink-100 text-pink-900"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    !isSidebarOpen && "justify-center px-0",
                  )}
                  title={!isSidebarOpen ? item.title : undefined}
                >
                  <item.icon className={cn("h-5 w-5", isSidebarOpen && "mr-2")} />
                  {isSidebarOpen && item.title}
                </Link>
              ))}
            </div>
          </nav>
          {isSidebarOpen === false && (
            <Button variant="ghost" size="icon" className="m-2" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Desktop Header */}
          <header className="hidden md:flex h-16 items-center border-b px-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8 w-full" />
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1">
            <Suspense>{children}</Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
