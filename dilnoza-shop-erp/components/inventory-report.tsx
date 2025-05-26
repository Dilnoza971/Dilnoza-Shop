"use client"

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts"

const data = [
  { name: "Women's Clothing", value: 45 },
  { name: "Men's Clothing", value: 30 },
  { name: "Accessories", value: 15 },
  { name: "Footwear", value: 10 },
]

const COLORS = ["#f472b6", "#22c55e", "#3b82f6", "#f59e0b"]

export function InventoryReport() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={120} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Inventory Share"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
