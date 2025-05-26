"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    age: "18-24",
    male: 15,
    female: 25,
  },
  {
    age: "25-34",
    male: 30,
    female: 45,
  },
  {
    age: "35-44",
    male: 25,
    female: 35,
  },
  {
    age: "45-54",
    male: 20,
    female: 25,
  },
  {
    age: "55+",
    male: 10,
    female: 15,
  },
]

export function CustomerReport() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="age" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="female" name="Female" fill="#f472b6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="male" name="Male" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
