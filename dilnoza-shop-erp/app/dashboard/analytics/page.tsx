"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { Line, Bar, Pie } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

// Revenue Growth Chart Data
const revenueGrowthData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "2024",
      data: [65000, 78000, 90000, 81000, 106000, 135000, 145000, 152000, 168000, 189000, 210000, 220000],
      borderColor: "rgb(244, 114, 182)",
      backgroundColor: "rgba(244, 114, 182, 0.5)",
      tension: 0.3,
    },
    {
      label: "2023",
      data: [45000, 55000, 65000, 59000, 80000, 95000, 105000, 115000, 125000, 140000, 150000, 160000],
      borderColor: "rgb(148, 163, 184)",
      backgroundColor: "rgba(148, 163, 184, 0.5)",
      tension: 0.3,
    },
  ],
}

// Top Customers Chart Data
const topCustomersData = {
  labels: ["Sarah Johnson", "James Miller", "Sophia Martinez", "Emma Wilson", "William Taylor"],
  datasets: [
    {
      label: "Total Spent ($)",
      data: [1245.87, 1876.25, 879.92, 732.5, 645.93],
      backgroundColor: [
        "rgba(244, 114, 182, 0.8)",
        "rgba(244, 114, 182, 0.7)",
        "rgba(244, 114, 182, 0.6)",
        "rgba(244, 114, 182, 0.5)",
        "rgba(244, 114, 182, 0.4)",
      ],
      borderColor: [
        "rgb(244, 114, 182)",
        "rgb(244, 114, 182)",
        "rgb(244, 114, 182)",
        "rgb(244, 114, 182)",
        "rgb(244, 114, 182)",
      ],
      borderWidth: 1,
    },
  ],
}

// Top Products Chart Data
const topProductsData = {
  labels: [
    "Women's T-shirt",
    "Men's Classic Jeans",
    "Women's Summer Dress",
    "Men's Seasonal Jacket",
    "Women's Casual Sneakers",
  ],
  datasets: [
    {
      label: "Units Sold",
      data: [342, 276, 234, 198, 187],
      backgroundColor: [
        "rgba(244, 114, 182, 0.8)",
        "rgba(34, 197, 94, 0.8)",
        "rgba(59, 130, 246, 0.8)",
        "rgba(245, 158, 11, 0.8)",
        "rgba(139, 92, 246, 0.8)",
      ],
    },
  ],
}

// Chart options
const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => "$" + value.toLocaleString(),
      },
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
}

const barChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y" as const,
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        callback: (value) => "$" + value.toLocaleString(),
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
}

const pieChartOptions: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" as const,
    },
    tooltip: {
      callbacks: {
        label: (context) => context.label + ": " + context.raw + " units",
      },
    },
  },
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter" | "year">("month")

  const handleExport = () => {
    // In a real application, this would generate a report file
    alert("Exporting analytics report...")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Analytics" text="Detailed analytics and insights for your business.">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Select Period</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </DashboardHeader>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Growth</TabsTrigger>
          <TabsTrigger value="customers">Top Customers</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth</CardTitle>
              <CardDescription>Monthly revenue comparison year-over-year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line options={lineChartOptions} data={revenueGrowthData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Customers with highest total spend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Bar options={barChartOptions} data={topCustomersData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Products with highest unit sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Pie options={pieChartOptions} data={topProductsData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
