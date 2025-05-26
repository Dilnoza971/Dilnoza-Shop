"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    revenue: 1500,
    profit: 450,
  },
  {
    name: "Feb",
    revenue: 2300,
    profit: 690,
  },
  {
    name: "Mar",
    revenue: 2800,
    profit: 840,
  },
  {
    name: "Apr",
    revenue: 3200,
    profit: 960,
  },
  {
    name: "May",
    revenue: 4500,
    profit: 1350,
  },
  {
    name: "Jun",
    revenue: 4200,
    profit: 1260,
  },
]

export function SalesReport() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#f472b6" strokeWidth={2} />
        <Line type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
