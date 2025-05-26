"use client"

import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Define chart options
const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
}

// Sample data for different timeframes
const dailyData = {
  labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
  datasets: [
    {
      label: "Revenue (thousands $)",
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50),
      borderColor: "rgb(244, 114, 182)",
      backgroundColor: "rgba(244, 114, 182, 0.5)",
      tension: 0.3,
    },
    {
      label: "Orders",
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 30),
      borderColor: "rgb(148, 163, 184)",
      backgroundColor: "rgba(148, 163, 184, 0.5)",
      tension: 0.3,
    },
  ],
}

const weeklyData = {
  labels: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
  datasets: [
    {
      label: "Revenue (thousands $)",
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 150) + 70),
      borderColor: "rgb(244, 114, 182)",
      backgroundColor: "rgba(244, 114, 182, 0.5)",
      tension: 0.3,
    },
    {
      label: "Orders",
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 40),
      borderColor: "rgb(148, 163, 184)",
      backgroundColor: "rgba(148, 163, 184, 0.5)",
      tension: 0.3,
    },
  ],
}

const monthlyData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Revenue (thousands $)",
      data: [65, 78, 90, 81, 106, 135, 145, 152, 168, 189, 210, 220],
      borderColor: "rgb(244, 114, 182)",
      backgroundColor: "rgba(244, 114, 182, 0.5)",
      tension: 0.3,
    },
    {
      label: "Orders",
      data: [45, 55, 65, 59, 80, 95, 105, 115, 125, 140, 150, 160],
      borderColor: "rgb(148, 163, 184)",
      backgroundColor: "rgba(148, 163, 184, 0.5)",
      tension: 0.3,
    },
  ],
}

const yearlyData = {
  labels: Array.from({ length: 5 }, (_, i) => `${2021 + i}`),
  datasets: [
    {
      label: "Revenue (thousands $)",
      data: [800, 1200, 1500, 1800, 2100],
      borderColor: "rgb(244, 114, 182)",
      backgroundColor: "rgba(244, 114, 182, 0.5)",
      tension: 0.3,
    },
    {
      label: "Orders",
      data: [500, 700, 900, 1100, 1300],
      borderColor: "rgb(148, 163, 184)",
      backgroundColor: "rgba(148, 163, 184, 0.5)",
      tension: 0.3,
    },
  ],
}

interface SalesOverviewChartProps {
  timeframe: "daily" | "weekly" | "monthly" | "yearly"
}

export function SalesOverviewChart({ timeframe }: SalesOverviewChartProps) {
  const [chartData, setChartData] = useState<ChartData<"line">>(monthlyData)

  useEffect(() => {
    switch (timeframe) {
      case "daily":
        setChartData(dailyData)
        break
      case "weekly":
        setChartData(weeklyData)
        break
      case "monthly":
        setChartData(monthlyData)
        break
      case "yearly":
        setChartData(yearlyData)
        break
      default:
        setChartData(monthlyData)
    }
  }, [timeframe])

  const handleExport = () => {
    // In a real application, this would generate a CSV or Excel file
    alert("Exporting data...")
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1">
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </Button>
      </div>
      <div className="h-[350px]">
        <Line options={options} data={chartData} />
      </div>
    </div>
  )
}
