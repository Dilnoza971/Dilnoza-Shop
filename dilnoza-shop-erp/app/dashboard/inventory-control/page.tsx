"use client"

// import React (no type import needed in JS)

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Search, Plus, ChevronDown, Edit, Trash2, AlertTriangle, BarChart2, ArrowDown, ArrowUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"


const inventoryItems = [
  {
    id: "INV-1001",
    sku: "WD-S-BLK-M",
    name: "Summer Dress - Black - M",
    category: "Women's Clothing",
    location: "LOC-A01",
    quantity: 45,
    minStock: 20,
    maxStock: 100,
    reorderPoint: 30,
    lastUpdated: "2025-05-15T10:30:00Z",
    status: "In Stock",
  },
  {
    id: "INV-1002",
    sku: "WD-S-BLK-L",
    name: "Summer Dress - Black - L",
    category: "Women's Clothing",
    location: "LOC-A01",
    quantity: 32,
    minStock: 15,
    maxStock: 80,
    reorderPoint: 25,
    lastUpdated: "2025-05-15T10:30:00Z",
    status: "In Stock",
  },
  {
    id: "INV-1003",
    sku: "WD-S-WHT-M",
    name: "Summer Dress - White - M",
    category: "Women's Clothing",
    location: "LOC-A01",
    quantity: 28,
    minStock: 20,
    maxStock: 100,
    reorderPoint: 30,
    lastUpdated: "2025-05-14T14:20:00Z",
    status: "In Stock",
  },
  {
    id: "INV-1004",
    sku: "WD-S-WHT-L",
    name: "Summer Dress - White - L",
    category: "Women's Clothing",
    location: "LOC-A01",
    quantity: 18,
    minStock: 15,
    maxStock: 80,
    reorderPoint: 25,
    lastUpdated: "2025-05-14T14:20:00Z",
    status: "Low Stock",
  },
  {
    id: "INV-1005",
    sku: "MJ-SF-BLU-32",
    name: "Slim Fit Jeans - Blue - 32",
    category: "Men's Clothing",
    location: "LOC-A02",
    quantity: 42,
    minStock: 25,
    maxStock: 120,
    reorderPoint: 35,
    lastUpdated: "2025-05-14T16:10:00Z",
    status: "In Stock",
  },
  {
    id: "INV-1006",
    sku: "MJ-SF-BLU-34",
    name: "Slim Fit Jeans - Blue - 34",
    category: "Men's Clothing",
    location: "LOC-A02",
    quantity: 33,
    minStock: 20,
    maxStock: 100,
    reorderPoint: 30,
    lastUpdated: "2025-05-14T16:10:00Z",
    status: "In Stock",
  },
  {
    id: "INV-1007",
    sku: "WB-FL-PNK-S",
    name: "Floral Blouse - Pink - S",
    category: "Women's Clothing",
    location: "LOC-A03",
    quantity: 12,
    minStock: 15,
    maxStock: 75,
    reorderPoint: 20,
    lastUpdated: "2025-05-13T09:15:00Z",
    status: "Low Stock",
  },
  {
    id: "INV-1008",
    sku: "WB-FL-PNK-M",
    name: "Floral Blouse - Pink - M",
    category: "Women's Clothing",
    location: "LOC-A03",
    quantity: 8,
    minStock: 15,
    maxStock: 75,
    reorderPoint: 20,
    lastUpdated: "2025-05-13T09:15:00Z",
    status: "Low Stock",
  },
  {
    id: "INV-1009",
    sku: "OW-LJ-BRN-M",
    name: "Leather Jacket - Brown - M",
    category: "Outerwear",
    location: "LOC-A01",
    quantity: 7,
    minStock: 10,
    maxStock: 50,
    reorderPoint: 15,
    lastUpdated: "2025-05-12T13:40:00Z",
    status: "Low Stock",
  },
  {
    id: "INV-1010",
    sku: "OW-LJ-BRN-L",
    name: "Leather Jacket - Brown - L",
    category: "Outerwear",
    location: "LOC-A01",
    quantity: 0,
    minStock: 10,
    maxStock: 50,
    reorderPoint: 15,
    lastUpdated: "2025-05-12T15:30:00Z",
    status: "Out of Stock",
  },
]


const inventoryMovementData = [
  { date: "May 1", inflow: 120, outflow: 85, stock: 450 },
  { date: "May 5", inflow: 95, outflow: 110, stock: 435 },
  { date: "May 10", inflow: 150, outflow: 90, stock: 495 },
  { date: "May 15", inflow: 85, outflow: 120, stock: 460 },
  { date: "May 20", inflow: 110, outflow: 95, stock: 475 },
]


const categoryDistributionData = [
  { name: "Women's Clothing", value: 45 },
  { name: "Men's Clothing", value: 30 },
  { name: "Outerwear", value: 15 },
  { name: "Footwear", value: 10 },
]

export default function InventoryControlPage() {
  const [activeTab, setActiveTab] = useState("inventory")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredItems, setFilteredItems] = useState(inventoryItems)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<(typeof inventoryItems)[0] | null>(null)

  // Filter inventory items
  useEffect(() => {
    let filtered = inventoryItems

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    setFilteredItems(filtered)
  }, [searchTerm, categoryFilter, statusFilter])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleAdjustStock = (item) => {
    setSelectedItem(item)
    setIsAdjustStockOpen(true)
  }

  // Get unique categories from inventory items
  const categories = Array.from(new Set(inventoryItems.map((item) => item.category)))

  // Calculate inventory statistics
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0)
  const lowStockItems = inventoryItems.filter((item) => item.status === "Low Stock").length
  const outOfStockItems = inventoryItems.filter((item) => item.status === "Out of Stock").length

  return (
    <DashboardShell className="bg-white">
      <DashboardHeader
        heading="Inventory Control"
        text="Monitor and manage inventory levels and stock movements."
        className="text-white"
      >
        {activeTab === "inventory" && (
          <>
            <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1 bg-pink-600 hover:bg-pink-700">
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] bg-white-600  text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Inventory Item</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Enter the details to add a new item to inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sku" className="text-right text-zinc-400">
                      SKU
                    </Label>
                    <Input
                      id="sku"
                      placeholder="Product SKU"
                      className="col-span-3 bg-zinc-800  text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-zinc-400">
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Product name"
                      className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right text-zinc-400">
                      Category
                    </Label>
                    <Select defaultValue="womens-clothing">
                      <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="womens-clothing" className="focus:bg-zinc-800 focus:text-white">
                          Women's Clothing
                        </SelectItem>
                        <SelectItem value="mens-clothing" className="focus:bg-zinc-800 focus:text-white">
                          Men's Clothing
                        </SelectItem>
                        <SelectItem value="outerwear" className="focus:bg-zinc-800 focus:text-white">
                          Outerwear
                        </SelectItem>
                        <SelectItem value="footwear" className="focus:bg-zinc-800 focus:text-white">
                          Footwear
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right text-zinc-400">
                      Location
                    </Label>
                    <Select defaultValue="LOC-A01">
                      <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                        <SelectItem value="LOC-A01" className="focus:bg-zinc-800 focus:text-white">
                          Main Warehouse - Section A
                        </SelectItem>
                        <SelectItem value="LOC-A02" className="focus:bg-zinc-800 focus:text-white">
                          Main Warehouse - Section B
                        </SelectItem>
                        <SelectItem value="LOC-A03" className="focus:bg-zinc-800 focus:text-white">
                          Main Warehouse - Section C
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right text-zinc-400">
                      Initial Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="0"
                      className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="min-stock" className="text-right text-zinc-400">
                      Min Stock
                    </Label>
                    <Input
                      id="min-stock"
                      type="number"
                      placeholder="0"
                      className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reorder-point" className="text-right text-zinc-400">
                      Reorder Point
                    </Label>
                    <Input
                      id="reorder-point"
                      type="number"
                      placeholder="0"
                      className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="max-stock" className="text-right text-zinc-400">
                      Max Stock
                    </Label>
                    <Input
                      id="max-stock"
                      type="number"
                      placeholder="0"
                      className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddItemOpen(false)}
                    className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => setIsAddItemOpen(false)}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    Add Item
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAdjustStockOpen} onOpenChange={setIsAdjustStockOpen}>
              <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Adjust Stock Level</DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    {selectedItem ? `Adjust stock for ${selectedItem.name} (${selectedItem.sku})` : ""}
                  </DialogDescription>
                </DialogHeader>
                {selectedItem && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="current-stock" className="text-right text-zinc-400">
                        Current Stock
                      </Label>
                      <Input
                        id="current-stock"
                        value={selectedItem.quantity}
                        disabled
                        className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="adjustment-type" className="text-right text-zinc-400">
                        Adjustment Type
                      </Label>
                      <Select defaultValue="add">
                        <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                          <SelectItem value="add" className="focus:bg-zinc-800 focus:text-white">
                            Add Stock
                          </SelectItem>
                          <SelectItem value="remove" className="focus:bg-zinc-800 focus:text-white">
                            Remove Stock
                          </SelectItem>
                          <SelectItem value="set" className="focus:bg-zinc-800 focus:text-white">
                            Set Stock Level
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="adjustment-quantity" className="text-right text-zinc-400">
                        Quantity
                      </Label>
                      <Input
                        id="adjustment-quantity"
                        type="number"
                        placeholder="0"
                        className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reason" className="text-right text-zinc-400">
                        Reason
                      </Label>
                      <Select defaultValue="receiving">
                        <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700 text-white">
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                          <SelectItem value="receiving" className="focus:bg-zinc-800 focus:text-white">
                            Receiving
                          </SelectItem>
                          <SelectItem value="sales" className="focus:bg-zinc-800 focus:text-white">
                            Sales
                          </SelectItem>
                          <SelectItem value="returns" className="focus:bg-zinc-800 focus:text-white">
                            Returns
                          </SelectItem>
                          <SelectItem value="damage" className="focus:bg-zinc-800 focus:text-white">
                            Damage/Loss
                          </SelectItem>
                          <SelectItem value="correction" className="focus:bg-zinc-800 focus:text-white">
                            Inventory Correction
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right text-zinc-400">
                        Notes
                      </Label>
                      <Input
                        id="notes"
                        placeholder="Additional information"
                        className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAdjustStockOpen(false)}
                    className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => setIsAdjustStockOpen(false)}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    Save Adjustment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <Card className="bg-white  text-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-800">Total Stock</CardTitle>
            <BarChart2 className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white-800">{totalItems} units</div>
            <div className="flex items-center text-xs text-zinc-400 mt-1">
              <span className="flex items-center text-green-500 mr-1">
                <ArrowUp className="h-3 w-3 mr-0.5" />
                +5.2%
              </span>
              compared to last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white  text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-800">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{lowStockItems} items</div>
            <div className="flex items-center text-xs text-zinc-400 mt-1">
              <span className="flex items-center text-yellow-500 mr-1">
                <ArrowDown className="h-3 w-3 mr-0.5" />
                -2.1%
              </span>
              compared to last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white  text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-800">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{outOfStockItems} items</div>
            <div className="flex items-center text-xs text-zinc-400 mt-1">
              <span className="flex items-center text-red-500 mr-1">
                <ArrowUp className="h-3 w-3 mr-0.5" />
                +1 item
              </span>
              since last week
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-white text-zinc-800">
          <TabsTrigger value="inventory" className="data-[state=active]:bg-gray-200 data-[state=active]:text-white-800">
            Inventory Items
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-200 data-[state=active]:text-white-800">
            Inventory Analytics
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="search"
              placeholder="Search inventory..."
              className="pl-8 w-full bg-white  text-white-800"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select onValueChange={handleCategoryFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px] bg-white  text-white-800">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white  text-white-800">
                <SelectItem value="all" className="focus:bg-gray-300 focus:text-white">
                  All Categories
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="focus:bg-gray-300 focus:text-white">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={handleStatusFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px] bg-white  text-white-800">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-white  text-white-800">
                <SelectItem value="all" className="focus:bg-gray-300 focus:text-white">
                  All Statuses
                </SelectItem>
                <SelectItem value="In Stock" className="focus:bg-gray-300 focus:text-white">
                  In Stock
                </SelectItem>
                <SelectItem value="Low Stock" className="focus:bg-gray-300 focus:text-white">
                  Low Stock
                </SelectItem>
                <SelectItem value="Out of Stock" className="focus:bg-gray-300 focus:text-white">
                  Out of Stock
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="inventory" className="space-y-4">
          <Card className="bg-white  text-white-800">
            <CardHeader>
              <CardTitle className="text-white">Inventory Items</CardTitle>
              <CardDescription className="text-zinc-400">
                {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="">
                    <TableHead className="text-zinc-800">SKU</TableHead>
                    <TableHead className="text-zinc-800">Product Name</TableHead>
                    <TableHead className="text-zinc-800">Category</TableHead>
                    <TableHead className="text-zinc-800">Location</TableHead>
                    <TableHead className="text-zinc-800">Quantity</TableHead>
                    <TableHead className="text-zinc-800">Status</TableHead>
                    <TableHead className="text-zinc-800">Last Updated</TableHead>
                    <TableHead className="text-right text-zinc-800">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="">
                      <TableCell className="font-medium text-white-800">{item.sku}</TableCell>
                      <TableCell className="text-zinc-800">{item.name}</TableCell>
                      <TableCell className="text-zinc-800">{item.category}</TableCell>
                      <TableCell className="text-zinc-800">{item.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={
                              item.quantity === 0
                                ? "text-red-500"
                                : item.quantity <= item.reorderPoint
                                  ? "text-yellow-500"
                                  : "text-zinc-300"
                            }
                          >
                            {item.quantity}
                          </span>
                          <div className="ml-2 w-16">
                            <Progress
                              value={(item.quantity / item.maxStock) * 100}
                              className="h-1.5 bg-zinc-800"
                              indicatorclassname={
                                item.quantity === 0
                                  ? "bg-red-500"
                                  : item.quantity <= item.reorderPoint
                                    ? "bg-yellow-500"
                                    : "bg-pink-500"
                              }
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.status === "In Stock"
                              ? "bg-green-900 text-green-400"
                              : item.status === "Low Stock"
                                ? "bg-yellow-900 text-yellow-400"
                                : "bg-red-900 text-red-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-800">{formatDate(item.lastUpdated)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-800 hover:text-white hover:bg-gray-200"
                            >
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white  text-white-800">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              className="flex items-center hover:bg-gray-200 focus:bg-gray-200"
                              onClick={() => handleAdjustStock(item)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Adjust stock
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center hover:bg-gray-200 focus:bg-gray-200">
                              <BarChart2 className="mr-2 h-4 w-4" /> View history
                            </DropdownMenuItem>
                            {item.quantity <= item.reorderPoint && (
                              <DropdownMenuItem className="flex items-center text-yellow-500 hover:bg-zinc-800 focus:bg-zinc-800">
                                <AlertTriangle className="mr-2 h-4 w-4" /> Reorder
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="flex items-center text-red-500 hover:bg-gray-200 focus:bg-gray-200">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete item
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

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white  text-white-800">
              <CardHeader>
                <CardTitle className="text-white-800">Inventory Movement</CardTitle>
                <CardDescription className="text-zinc-800">Stock inflow and outflow over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryMovementData}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff6", borderColor: "#27272a", color: "#ffffff" }}
                      labelStyle={{ color: "#ffffff" }}
                    />
                    <Legend />
                    <Bar dataKey="inflow" name="Inflow" fill="#000" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outflow" name="Outflow" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="stock" name="Total Stock" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white  text-white-800">
              <CardHeader>
                <CardTitle className="text-white">Category Distribution</CardTitle>
                <CardDescription className="text-zinc-400">Inventory by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart layout="vertical" data={categoryDistributionData}>
                    <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff6", borderColor: "#27272a", color: "#ffffff" }}
                      labelStyle={{ color: "#ffffff" }}
                      formatter={(value) => [`${value}%`, "Percentage"]}
                    />
                    <Bar dataKey="value" name="Percentage" fill="#ec4899" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white  text-white-800">
            <CardHeader>
              <CardTitle className="text-white">Inventory Health</CardTitle>
              <CardDescription className="text-zinc-400">Stock level status by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">Women's Clothing</h3>
                    <div className="text-sm text-zinc-400">
                      <span className="text-green-500">75%</span> optimal, <span className="text-yellow-500">20%</span>{" "}
                      low, <span className="text-red-500">5%</span> out
                    </div>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div className="bg-green-500 w-[75%]"></div>
                    <div className="bg-yellow-500 w-[20%]"></div>
                    <div className="bg-red-500 w-[5%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">Men's Clothing</h3>
                    <div className="text-sm text-zinc-400">
                      <span className="text-green-500">85%</span> optimal, <span className="text-yellow-500">15%</span>{" "}
                      low, <span className="text-red-500">0%</span> out
                    </div>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div className="bg-green-500 w-[85%]"></div>
                    <div className="bg-yellow-500 w-[15%]"></div>
                    <div className="bg-red-500 w-[0%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">Outerwear</h3>
                    <div className="text-sm text-zinc-400">
                      <span className="text-green-500">50%</span> optimal, <span className="text-yellow-500">30%</span>{" "}
                      low, <span className="text-red-500">20%</span> out
                    </div>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div className="bg-green-500 w-[50%]"></div>
                    <div className="bg-yellow-500 w-[30%]"></div>
                    <div className="bg-red-500 w-[20%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-white">Footwear</h3>
                    <div className="text-sm text-zinc-400">
                      <span className="text-green-500">65%</span> optimal, <span className="text-yellow-500">25%</span>{" "}
                      low, <span className="text-red-500">10%</span> out
                    </div>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div className="bg-green-500 w-[65%]"></div>
                    <div className="bg-yellow-500 w-[25%]"></div>
                    <div className="bg-red-500 w-[10%]"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
