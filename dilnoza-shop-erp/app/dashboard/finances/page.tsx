"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, ChevronDown, Edit, Trash2, Download, FileText, DollarSign, CreditCard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import type { Transaction } from "@/lib/supabase"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample transaction data (would come from Supabase in production)
const transactions: Transaction[] = [
  {
    id: "TRX-1001",
    date: "2025-05-15T00:00:00Z",
    description: "Online Store Sales",
    amount: 12450.75,
    type: "income",
    category: "Sales",
    reference: "INV-5678",
    created_at: "2025-05-15T00:00:00Z",
  },
  {
    id: "TRX-1002",
    date: "2025-05-14T00:00:00Z",
    description: "Supplier Payment - Fashion Fabrics Inc.",
    amount: 5680.25,
    type: "expense",
    category: "Inventory",
    reference: "PO-2001",
    created_at: "2025-05-14T00:00:00Z",
  },
  {
    id: "TRX-1003",
    date: "2025-05-13T00:00:00Z",
    description: "Staff Salaries",
    amount: 8750.0,
    type: "expense",
    category: "Payroll",
    reference: "PAY-MAY-1",
    created_at: "2025-05-13T00:00:00Z",
  },
  {
    id: "TRX-1004",
    date: "2025-05-12T00:00:00Z",
    description: "In-Store Sales",
    amount: 8965.5,
    type: "income",
    category: "Sales",
    reference: "POS-DAILY-512",
    created_at: "2025-05-12T00:00:00Z",
  },
  {
    id: "TRX-1005",
    date: "2025-05-10T00:00:00Z",
    description: "Marketing Campaign Payment",
    amount: 2500.0,
    type: "expense",
    category: "Marketing",
    reference: "MKT-0510",
    created_at: "2025-05-10T00:00:00Z",
  },
  {
    id: "TRX-1006",
    date: "2025-05-08T00:00:00Z",
    description: "Rent Payment",
    amount: 3500.0,
    type: "expense",
    category: "Rent",
    reference: "RENT-MAY",
    created_at: "2025-05-08T00:00:00Z",
  },
  {
    id: "TRX-1007",
    date: "2025-05-07T00:00:00Z",
    description: "Wholesale Order - Boutique Partners",
    amount: 15750.0,
    type: "income",
    category: "Wholesale",
    reference: "WS-BP-0507",
    created_at: "2025-05-07T00:00:00Z",
  },
  {
    id: "TRX-1008",
    date: "2025-05-05T00:00:00Z",
    description: "Utility Bills",
    amount: 875.45,
    type: "expense",
    category: "Utilities",
    reference: "UTIL-MAY",
    created_at: "2025-05-05T00:00:00Z",
  },
  {
    id: "TRX-1009",
    date: "2025-05-03T00:00:00Z",
    description: "Insurance Premium",
    amount: 1250.0,
    type: "expense",
    category: "Insurance",
    reference: "INS-Q2",
    created_at: "2025-05-03T00:00:00Z",
  },
  {
    id: "TRX-1010",
    date: "2025-05-01T00:00:00Z",
    description: "Online Store Sales",
    amount: 9875.25,
    type: "income",
    category: "Sales",
    reference: "INV-5623",
    created_at: "2025-05-01T00:00:00Z",
  },
]

// Sample financial data for charts
const monthlyFinancialData = [
  { name: "Jan", income: 45000, expenses: 32000, profit: 13000 },
  { name: "Feb", income: 52000, expenses: 35000, profit: 17000 },
  { name: "Mar", income: 61000, expenses: 42000, profit: 19000 },
  { name: "Apr", income: 58000, expenses: 38000, profit: 20000 },
  { name: "May", income: 65000, expenses: 41000, profit: 24000 },
]

const expenseCategoryData = [
  { name: "Inventory", value: 42 },
  { name: "Payroll", value: 28 },
  { name: "Rent", value: 12 },
  { name: "Marketing", value: 8 },
  { name: "Utilities", value: 6 },
  { name: "Other", value: 4 },
]

const COLORS = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#6b7280"]

export default function FinancesPage() {
  const [activeTab, setActiveTab] = useState("transactions")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions)
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month")

  // Calculate financial summary
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const netProfit = totalIncome - totalExpenses

  // Filter transactions based on search term, type, and category
  useEffect(() => {
    let filtered = transactions

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === typeFilter)
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.category === categoryFilter)
    }

    // Sort by date (newest first)
    filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredTransactions(filtered)
  }, [searchTerm, typeFilter, categoryFilter])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type)
  }

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get unique categories from transactions
  const categories = Array.from(new Set(transactions.map((t) => t.category)))

  return (
    <DashboardShell className="bg-black">
      <DashboardHeader
        heading="Financial Management"
        text="Track income, expenses, and financial performance."
        className="text-white"
      >
        {activeTab === "transactions" && (
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1 bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4" />
                <span>Add Transaction</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-zinc-900 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Transaction</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Enter the details to record a new financial transaction.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transaction-type" className="text-right text-zinc-400">
                    Type
                  </Label>
                  <Select defaultValue="income">
                    <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="income" className="focus:bg-zinc-800 focus:text-white">
                        Income
                      </SelectItem>
                      <SelectItem value="expense" className="focus:bg-zinc-800 focus:text-white">
                        Expense
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right text-zinc-400">
                    Date
                  </Label>
                  <Input id="date" type="date" className="col-span-3 bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right text-zinc-400">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Transaction description"
                    className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right text-zinc-400">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right text-zinc-400">
                    Category
                  </Label>
                  <Select defaultValue="Sales">
                    <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="Sales" className="focus:bg-zinc-800 focus:text-white">
                        Sales
                      </SelectItem>
                      <SelectItem value="Wholesale" className="focus:bg-zinc-800 focus:text-white">
                        Wholesale
                      </SelectItem>
                      <SelectItem value="Inventory" className="focus:bg-zinc-800 focus:text-white">
                        Inventory
                      </SelectItem>
                      <SelectItem value="Payroll" className="focus:bg-zinc-800 focus:text-white">
                        Payroll
                      </SelectItem>
                      <SelectItem value="Rent" className="focus:bg-zinc-800 focus:text-white">
                        Rent
                      </SelectItem>
                      <SelectItem value="Marketing" className="focus:bg-zinc-800 focus:text-white">
                        Marketing
                      </SelectItem>
                      <SelectItem value="Utilities" className="focus:bg-zinc-800 focus:text-white">
                        Utilities
                      </SelectItem>
                      <SelectItem value="Insurance" className="focus:bg-zinc-800 focus:text-white">
                        Insurance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reference" className="text-right text-zinc-400">
                    Reference
                  </Label>
                  <Input
                    id="reference"
                    placeholder="Invoice or reference number"
                    className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddTransactionOpen(false)}
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => setIsAddTransactionOpen(false)}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  Save Transaction
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-zinc-400 mt-1">Current month</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-zinc-400 mt-1">Current month</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Net Profit</CardTitle>
            <FileText className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-500">
              ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-zinc-400 mt-1">Current month</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800 text-zinc-400">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
            Financial Reports
          </TabsTrigger>
          <TabsTrigger value="budgeting" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
            Budgeting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8 w-full bg-zinc-800 border-zinc-700 text-white"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Select onValueChange={handleTypeFilter} defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px] bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="all" className="focus:bg-zinc-800 focus:text-white">
                    All Types
                  </SelectItem>
                  <SelectItem value="income" className="focus:bg-zinc-800 focus:text-white">
                    Income
                  </SelectItem>
                  <SelectItem value="expense" className="focus:bg-zinc-800 focus:text-white">
                    Expense
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={handleCategoryFilter} defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px] bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="all" className="focus:bg-zinc-800 focus:text-white">
                    All Categories
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="focus:bg-zinc-800 focus:text-white">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-white">Financial Transactions</CardTitle>
              <CardDescription className="text-zinc-400">
                {filteredTransactions.length} {filteredTransactions.length === 1 ? "transaction" : "transactions"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400">Transaction ID</TableHead>
                    <TableHead className="text-zinc-400">Date</TableHead>
                    <TableHead className="text-zinc-400">Description</TableHead>
                    <TableHead className="text-zinc-400">Category</TableHead>
                    <TableHead className="text-zinc-400">Reference</TableHead>
                    <TableHead className="text-zinc-400">Amount</TableHead>
                    <TableHead className="text-right text-zinc-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="border-zinc-800">
                      <TableCell className="font-medium text-white">{transaction.id}</TableCell>
                      <TableCell className="text-zinc-300">{formatDate(transaction.date)}</TableCell>
                      <TableCell className="text-zinc-300">{transaction.description}</TableCell>
                      <TableCell className="text-zinc-300">{transaction.category}</TableCell>
                      <TableCell className="text-zinc-300">{transaction.reference}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}
                        >
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                            >
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="flex items-center hover:bg-zinc-800 focus:bg-zinc-800">
                              <Edit className="mr-2 h-4 w-4" /> Edit transaction
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center hover:bg-zinc-800 focus:bg-zinc-800">
                              <FileText className="mr-2 h-4 w-4" /> View details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="flex items-center text-red-500 hover:bg-zinc-800 focus:bg-zinc-800">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete transaction
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Financial Performance</h3>
            <div className="flex gap-2">
              <Button
                variant={dateRange === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("week")}
                className={
                  dateRange === "week"
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }
              >
                Week
              </Button>
              <Button
                variant={dateRange === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("month")}
                className={
                  dateRange === "month"
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }
              >
                Month
              </Button>
              <Button
                variant={dateRange === "quarter" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("quarter")}
                className={
                  dateRange === "quarter"
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }
              >
                Quarter
              </Button>
              <Button
                variant={dateRange === "year" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("year")}
                className={
                  dateRange === "year"
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                }
              >
                Year
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader>
                <CardTitle className="text-white">Income vs Expenses</CardTitle>
                <CardDescription className="text-zinc-400">Monthly financial overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyFinancialData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#ffffff" }}
                      labelStyle={{ color: "#ffffff" }}
                      formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader>
                <CardTitle className="text-white">Expense Breakdown</CardTitle>
                <CardDescription className="text-zinc-400">Expenses by category</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#ffffff" }}
                      formatter={(value) => [`${value}%`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-white">Profit Trends</CardTitle>
              <CardDescription className="text-zinc-400">Monthly profit analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyFinancialData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#ffffff" }}
                    labelStyle={{ color: "#ffffff" }}
                    formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="profit" stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgeting" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-white">Budget vs Actual</CardTitle>
              <CardDescription className="text-zinc-400">Monthly budget tracking by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium text-white">Inventory</h4>
                      <p className="text-sm text-zinc-400">Product purchases and stock</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">
                        <span className="text-white font-medium">$5,680</span> / $8,000
                      </div>
                      <p className="text-xs text-green-500">71% of budget used</p>
                    </div>
                  </div>
                  <Progress value={71} className="h-2 bg-zinc-800" indicatorClassName="bg-pink-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium text-white">Payroll</h4>
                      <p className="text-sm text-zinc-400">Staff salaries and benefits</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">
                        <span className="text-white font-medium">$8,750</span> / $9,000
                      </div>
                      <p className="text-xs text-yellow-500">97% of budget used</p>
                    </div>
                  </div>
                  <Progress value={97} className="h-2 bg-zinc-800" indicatorClassName="bg-pink-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium text-white">Marketing</h4>
                      <p className="text-sm text-zinc-400">Advertising and promotions</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">
                        <span className="text-white font-medium">$2,500</span> / $5,000
                      </div>
                      <p className="text-xs text-green-500">50% of budget used</p>
                    </div>
                  </div>
                  <Progress value={50} className="h-2 bg-zinc-800" indicatorClassName="bg-pink-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium text-white">Rent & Utilities</h4>
                      <p className="text-sm text-zinc-400">Office and store space</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">
                        <span className="text-white font-medium">$4,375</span> / $4,000
                      </div>
                      <p className="text-xs text-red-500">109% of budget used</p>
                    </div>
                  </div>
                  <Progress value={100} className="h-2 bg-zinc-800" indicatorClassName="bg-red-500" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-medium text-white">Insurance</h4>
                      <p className="text-sm text-zinc-400">Business and liability coverage</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">
                        <span className="text-white font-medium">$1,250</span> / $1,500
                      </div>
                      <p className="text-xs text-green-500">83% of budget used</p>
                    </div>
                  </div>
                  <Progress value={83} className="h-2 bg-zinc-800" indicatorClassName="bg-pink-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader>
                <CardTitle className="text-white">Budget Planning</CardTitle>
                <CardDescription className="text-zinc-400">Create and manage budget allocations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Button className="gap-1 bg-pink-600 hover:bg-pink-700">
                      <Plus className="h-4 w-4" />
                      <span>Create Budget</span>
                    </Button>
                    <Select defaultValue="may2025">
                      <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="may2025" className="focus:bg-zinc-800 focus:text-white">
                          May 2025
                        </SelectItem>
                        <SelectItem value="jun2025" className="focus:bg-zinc-800 focus:text-white">
                          June 2025
                        </SelectItem>
                        <SelectItem value="q22025" className="focus:bg-zinc-800 focus:text-white">
                          Q2 2025
                        </SelectItem>
                        <SelectItem value="q32025" className="focus:bg-zinc-800 focus:text-white">
                          Q3 2025
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h3 className="font-medium text-white mb-2">May 2025 Budget Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Total Budget:</span>
                        <span className="text-white">$27,500.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Allocated:</span>
                        <span className="text-white">$27,500.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Spent:</span>
                        <span className="text-white">$22,555.45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Remaining:</span>
                        <span className="text-green-500">$4,944.55</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader>
                <CardTitle className="text-white">Forecast</CardTitle>
                <CardDescription className="text-zinc-400">Financial projections for the next quarter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <h3 className="font-medium text-white mb-2">Q3 2025 Forecast</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Projected Revenue:</span>
                        <span className="text-white">$210,000.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Projected Expenses:</span>
                        <span className="text-white">$145,000.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Projected Profit:</span>
                        <span className="text-green-500">$65,000.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Profit Margin:</span>
                        <span className="text-pink-500">31%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white">Growth Projection</h4>
                      <p className="text-sm text-zinc-400">Year-over-year</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-400">
                        <span className="text-white font-medium">+18%</span> vs 2024
                      </div>
                    </div>
                  </div>
                  <Progress value={18} max={30} className="h-2 bg-zinc-800" indicatorClassName="bg-pink-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
