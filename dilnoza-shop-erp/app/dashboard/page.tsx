"use client"

import { useState , useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SalesOverviewChart } from "@/components/sales-overview-chart"
import { PopularProducts } from "@/components/popular-products"
import { ArrowDown, ArrowUp, Package, RefreshCw, ShoppingCart, Users } from "lucide-react"

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly")

  useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    router.push('/');
    return null; 
  } 
  }, []);
  
  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Dashboard" text="Overview of your store performance and recent activities.">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </Button>
        </DashboardHeader>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-500">$1,245,670</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="flex items-center text-green-500 mr-1">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  +20.1%
                </span>
                compared to last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-500">+573</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="flex items-center text-green-500 mr-1">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  +12.2%
                </span>
                compared to last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-500">+2831</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="flex items-center text-green-500 mr-1">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  +18.7%
                </span>
                compared to last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-500">12234</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="flex items-center text-red-500 mr-1">
                  <ArrowDown className="h-3 w-3 mr-0.5" />
                  -4.5%
                </span>
                compared to last month
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant={timeframe === "daily" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("daily")}
                >
                  Daily
                </Button>
                <Button
                  variant={timeframe === "weekly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("weekly")}
                >
                  Weekly
                </Button>
                <Button
                  variant={timeframe === "monthly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("monthly")}
                >
                  Monthly
                </Button>
                <Button
                  variant={timeframe === "yearly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("yearly")}
                >
                  Yearly
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              <SalesOverviewChart timeframe={timeframe} />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Popular Products</CardTitle>
                <CardDescription>Top 5 best-selling products this month</CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <PopularProducts />
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </>
  )
}
