"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Plus, Search, Download, ChevronDown, Edit, Trash2, Truck, Package, AlertTriangle } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Supplier, PurchaseOrder } from "@/lib/supabase"

// Sample supplier data (would come from Supabase in production)
const suppliers: Supplier[] = [
  {
    id: "SUP-1001",
    name: "Fashion Fabrics Inc.",
    contact_person: "John Smith",
    email: "john@fashionfabrics.com",
    phone: "+1 (555) 123-4567",
    address: "123 Textile Ave, Fabric City, FC 12345",
    status: "active",
    created_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "SUP-1002",
    name: "Trendy Textiles Ltd.",
    contact_person: "Emma Johnson",
    email: "emma@trendytextiles.com",
    phone: "+1 (555) 234-5678",
    address: "456 Fashion Blvd, Style Town, ST 23456",
    status: "active",
    created_at: "2025-01-20T00:00:00Z",
  },
  {
    id: "SUP-1003",
    name: "Apparel Accessories Co.",
    contact_person: "Michael Brown",
    email: "michael@apparelacc.com",
    phone: "+1 (555) 345-6789",
    address: "789 Button St, Zipper City, ZC 34567",
    status: "inactive",
    created_at: "2025-01-25T00:00:00Z",
  },
  {
    id: "SUP-1004",
    name: "Premium Packaging Solutions",
    contact_person: "Sarah Wilson",
    email: "sarah@premiumpackaging.com",
    phone: "+1 (555) 456-7890",
    address: "101 Box Lane, Package Town, PT 45678",
    status: "active",
    created_at: "2025-02-01T00:00:00Z",
  },
  {
    id: "SUP-1005",
    name: "Global Garment Suppliers",
    contact_person: "David Lee",
    email: "david@globalgarments.com",
    phone: "+1 (555) 567-8901",
    address: "202 Clothing Road, Thread City, TC 56789",
    status: "active",
    created_at: "2025-02-05T00:00:00Z",
  },
]

// Sample purchase order data (would come from Supabase in production)
const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-2001",
    supplier_id: "SUP-1001",
    order_date: "2025-05-01T00:00:00Z",
    expected_delivery: "2025-05-15T00:00:00Z",
    total_amount: 12500.0,
    status: "delivered",
    notes: "Summer collection fabrics",
    created_at: "2025-05-01T00:00:00Z",
  },
  {
    id: "PO-2002",
    supplier_id: "SUP-1002",
    order_date: "2025-05-05T00:00:00Z",
    expected_delivery: "2025-05-20T00:00:00Z",
    total_amount: 8750.5,
    status: "shipped",
    notes: "Special order for new product line",
    created_at: "2025-05-05T00:00:00Z",
  },
  {
    id: "PO-2003",
    supplier_id: "SUP-1004",
    order_date: "2025-05-10T00:00:00Z",
    expected_delivery: "2025-05-25T00:00:00Z",
    total_amount: 3200.75,
    status: "pending",
    notes: "Eco-friendly packaging materials",
    created_at: "2025-05-10T00:00:00Z",
  },
  {
    id: "PO-2004",
    supplier_id: "SUP-1005",
    order_date: "2025-05-12T00:00:00Z",
    expected_delivery: "2025-05-27T00:00:00Z",
    total_amount: 15800.25,
    status: "approved",
    notes: "Fall collection pre-order",
    created_at: "2025-05-12T00:00:00Z",
  },
  {
    id: "PO-2005",
    supplier_id: "SUP-1001",
    order_date: "2025-05-15T00:00:00Z",
    expected_delivery: "2025-05-30T00:00:00Z",
    total_amount: 6500.0,
    status: "pending",
    notes: "Restock of popular items",
    created_at: "2025-05-15T00:00:00Z",
  },
]

export default function SuppliesPage() {
  const [activeTab, setActiveTab] = useState("suppliers")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>(suppliers)
  const [filteredOrders, setFilteredOrders] = useState<PurchaseOrder[]>(purchaseOrders)
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false)

  // Filter suppliers based on search term and status
  useEffect(() => {
    let filtered = suppliers

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (supplier) =>
          supplier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((supplier) => supplier.status === statusFilter)
    }

    setFilteredSuppliers(filtered)
  }, [searchTerm, statusFilter])

  // Filter purchase orders based on search term and status
  useEffect(() => {
    let filtered = purchaseOrders

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.supplier_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
  }

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId)
    return supplier ? supplier.name : supplierId
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <DashboardShell className="bg-black">
      <DashboardHeader
        heading="Supply Chain Management"
        text="Manage suppliers and purchase orders."
        className="text-white"
      >
        {activeTab === "suppliers" ? (
          <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1 bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4" />
                <span>Add Supplier</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Supplier</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Enter the details of the new supplier to add to your database.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-zinc-400">
                    Company Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Company name"
                    className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right text-zinc-400">
                    Contact Person
                  </Label>
                  <Input
                    id="contact"
                    placeholder="Full name"
                    className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right text-zinc-400">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right text-zinc-400">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right text-zinc-400">
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Full address"
                    className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right text-zinc-400">
                    Status
                  </Label>
                  <Select defaultValue="active">
                    <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="active" className="focus:bg-zinc-800 focus:text-white">
                        Active
                      </SelectItem>
                      <SelectItem value="inactive" className="focus:bg-zinc-800 focus:text-white">
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddSupplierOpen(false)}
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => setIsAddSupplierOpen(false)}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  Add Supplier
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1 bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4" />
                <span>Create Purchase Order</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Create Purchase Order</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Enter the details of the new purchase order.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right text-zinc-400">
                    Supplier
                  </Label>
                  <Select defaultValue="SUP-1001">
                    <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      {suppliers.map((supplier) => (
                        <SelectItem
                          key={supplier.id}
                          value={supplier.id}
                          className="focus:bg-zinc-800 focus:text-white"
                        >
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="order-date" className="text-right text-zinc-400">
                    Order Date
                  </Label>
                  <Input id="order-date" type="date" className="col-span-3 bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="delivery-date" className="text-right text-zinc-400">
                    Expected Delivery
                  </Label>
                  <Input id="delivery-date" type="date" className="col-span-3 bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right text-zinc-400">
                    Total Amount
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
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddOrderOpen(false)}
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => setIsAddOrderOpen(false)}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  Create Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DashboardHeader>

      <Tabs defaultValue="suppliers" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800 text-zinc-400">
          <TabsTrigger value="suppliers" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
            Suppliers
          </TabsTrigger>
          <TabsTrigger
            value="purchase-orders"
            className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
          >
            Purchase Orders
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              type="search"
              placeholder={activeTab === "suppliers" ? "Search suppliers..." : "Search purchase orders..."}
              className="pl-8 w-full bg-zinc-800 border-zinc-700 text-white"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select onValueChange={handleStatusFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="all" className="focus:bg-zinc-800 focus:text-white">
                  All Statuses
                </SelectItem>
                {activeTab === "suppliers" ? (
                  <>
                    <SelectItem value="active" className="focus:bg-zinc-800 focus:text-white">
                      Active
                    </SelectItem>
                    <SelectItem value="inactive" className="focus:bg-zinc-800 focus:text-white">
                      Inactive
                    </SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="pending" className="focus:bg-zinc-800 focus:text-white">
                      Pending
                    </SelectItem>
                    <SelectItem value="approved" className="focus:bg-zinc-800 focus:text-white">
                      Approved
                    </SelectItem>
                    <SelectItem value="shipped" className="focus:bg-zinc-800 focus:text-white">
                      Shipped
                    </SelectItem>
                    <SelectItem value="delivered" className="focus:bg-zinc-800 focus:text-white">
                      Delivered
                    </SelectItem>
                    <SelectItem value="cancelled" className="focus:bg-zinc-800 focus:text-white">
                      Cancelled
                    </SelectItem>
                  </>
                )}
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

        <TabsContent value="suppliers" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-white">Supplier Directory</CardTitle>
              <CardDescription className="text-zinc-400">
                {filteredSuppliers.length} {filteredSuppliers.length === 1 ? "supplier" : "suppliers"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400">Supplier ID</TableHead>
                    <TableHead className="text-zinc-400">Company Name</TableHead>
                    <TableHead className="text-zinc-400">Contact Person</TableHead>
                    <TableHead className="text-zinc-400">Email</TableHead>
                    <TableHead className="text-zinc-400">Phone</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-right text-zinc-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="border-zinc-800">
                      <TableCell className="font-medium text-white">{supplier.id}</TableCell>
                      <TableCell className="text-zinc-300">{supplier.name}</TableCell>
                      <TableCell className="text-zinc-300">{supplier.contact_person}</TableCell>
                      <TableCell className="text-zinc-300">{supplier.email}</TableCell>
                      <TableCell className="text-zinc-300">{supplier.phone}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            supplier.status === "active"
                              ? "bg-green-900/30 text-green-400"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {supplier.status === "active" ? "Active" : "Inactive"}
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
                              <Edit className="mr-2 h-4 w-4" /> Edit supplier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center hover:bg-zinc-800 focus:bg-zinc-800">
                              <Truck className="mr-2 h-4 w-4" /> Create order
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="flex items-center text-red-500 hover:bg-zinc-800 focus:bg-zinc-800">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete supplier
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

        <TabsContent value="purchase-orders" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-white">Purchase Orders</CardTitle>
              <CardDescription className="text-zinc-400">
                {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400">Order ID</TableHead>
                    <TableHead className="text-zinc-400">Supplier</TableHead>
                    <TableHead className="text-zinc-400">Order Date</TableHead>
                    <TableHead className="text-zinc-400">Expected Delivery</TableHead>
                    <TableHead className="text-zinc-400">Amount</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-right text-zinc-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-zinc-800">
                      <TableCell className="font-medium text-white">{order.id}</TableCell>
                      <TableCell className="text-zinc-300">{getSupplierName(order.supplier_id)}</TableCell>
                      <TableCell className="text-zinc-300">{formatDate(order.order_date)}</TableCell>
                      <TableCell className="text-zinc-300">{formatDate(order.expected_delivery)}</TableCell>
                      <TableCell className="text-zinc-300">${order.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-green-900/30 text-green-400"
                              : order.status === "shipped"
                                ? "bg-blue-900/30 text-blue-400"
                                : order.status === "approved"
                                  ? "bg-yellow-900/30 text-yellow-400"
                                  : order.status === "pending"
                                    ? "bg-orange-900/30 text-orange-400"
                                    : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                              <Edit className="mr-2 h-4 w-4" /> Edit order
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center hover:bg-zinc-800 focus:bg-zinc-800">
                              <Package className="mr-2 h-4 w-4" /> Mark as received
                            </DropdownMenuItem>
                            {order.status === "pending" && (
                              <DropdownMenuItem className="flex items-center text-yellow-500 hover:bg-zinc-800 focus:bg-zinc-800">
                                <AlertTriangle className="mr-2 h-4 w-4" /> Approve order
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="flex items-center text-red-500 hover:bg-zinc-800 focus:bg-zinc-800">
                              <Trash2 className="mr-2 h-4 w-4" /> Cancel order
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
      </Tabs>
    </DashboardShell>
  )
}
