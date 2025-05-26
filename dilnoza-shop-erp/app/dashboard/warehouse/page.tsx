"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Search, Plus, ChevronDown, Edit, Trash2, AlertTriangle, Package, ArrowDown, ArrowUp } from "lucide-react"
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

// Hozircha bu ma'lumotlar statik (API'ga ulanmagan)
const warehouseLocations = [
  { id: "LOC-A01", name: "Main Warehouse - Section A", type: "Storage", capacity: 1000, used: 750, items: 45, status: "Active" },
  { id: "LOC-A02", name: "Main Warehouse - Section B", type: "Storage", capacity: 1000, used: 820, items: 52, status: "Active" },
  { id: "LOC-A03", name: "Main Warehouse - Section C", type: "Storage", capacity: 1000, used: 650, items: 38, status: "Active" },
  { id: "LOC-B01", name: "Secondary Warehouse - Section A", type: "Storage", capacity: 800, used: 450, items: 28, status: "Active" },
  { id: "LOC-B02", name: "Secondary Warehouse - Section B", type: "Storage", capacity: 800, used: 720, items: 41, status: "Active" },
  { id: "LOC-R01", name: "Receiving Area", type: "Receiving", capacity: 300, used: 120, items: 15, status: "Active" },
  { id: "LOC-S01", name: "Shipping Area", type: "Shipping", capacity: 300, used: 90, items: 12, status: "Active" },
  { id: "LOC-Q01", name: "Quality Control", type: "QC", capacity: 200, used: 80, items: 8, status: "Active" },
]
const inventoryMovements = [
  { id: "MOV-1001", date: "2025-05-15T10:30:00Z", type: "Receiving", product: "Summer Dress", quantity: 50, from: "Supplier", to: "LOC-R01", reference: "PO-2001", status: "Completed" },
  { id: "MOV-1002", date: "2025-05-15T11:45:00Z", type: "Transfer", product: "Summer Dress", quantity: 50, from: "LOC-R01", to: "LOC-A01", reference: "TRF-501", status: "Completed" },
  { id: "MOV-1003", date: "2025-05-14T14:20:00Z", type: "Receiving", product: "Slim Fit Jeans", quantity: 75, from: "Supplier", to: "LOC-R01", reference: "PO-2002", status: "Completed" },
  { id: "MOV-1004", date: "2025-05-14T16:10:00Z", type: "Transfer", product: "Slim Fit Jeans", quantity: 75, from: "LOC-R01", to: "LOC-A02", reference: "TRF-502", status: "Completed" },
  { id: "MOV-1005", date: "2025-05-13T09:15:00Z", type: "Shipping", product: "Floral Blouse", quantity: 25, from: "LOC-A03", to: "Customer", reference: "ORD-7245", status: "Completed" },
  { id: "MOV-1006", date: "2025-05-12T13:40:00Z", type: "Transfer", product: "Leather Jacket", quantity: 15, from: "LOC-A01", to: "LOC-S01", reference: "TRF-503", status: "Completed" },
  { id: "MOV-1007", date: "2025-05-12T15:30:00Z", type: "Shipping", product: "Leather Jacket", quantity: 15, from: "LOC-S01", to: "Customer", reference: "ORD-7244", status: "Completed" },
  { id: "MOV-1008", date: "2025-05-11T10:00:00Z", type: "Adjustment", product: "Cotton T-Shirt", quantity: -5, from: "LOC-A02", to: "Inventory Loss", reference: "ADJ-101", status: "Completed" },
]

export default function WarehousePage() {
  const [activeTab, setActiveTab] = useState("locations")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredLocations, setFilteredLocations] = useState(warehouseLocations)
  const [filteredMovements, setFilteredMovements] = useState(inventoryMovements)
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false)
  const [isAddMovementOpen, setIsAddMovementOpen] = useState(false)

  // Bu qismlar hozircha o'zgarishsiz qoladi, chunki API'ga ulanmagan
  useEffect(() => {
    let filtered = warehouseLocations
    if (searchTerm) {
      filtered = filtered.filter(location =>
        location.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter((location) => location.type === typeFilter)
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((location) => location.status === statusFilter)
    }
    setFilteredLocations(filtered)
  }, [searchTerm, typeFilter, statusFilter])

  useEffect(() => {
    let filtered = inventoryMovements
    if (searchTerm) {
      filtered = filtered.filter(movement =>
        movement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.reference.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter((movement) => movement.type === typeFilter)
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((movement) => movement.status === statusFilter)
    }
    filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setFilteredMovements(filtered)
  }, [searchTerm, typeFilter, statusFilter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  const getLocationName = (locationId: string) => {
    if (locationId === "Supplier") return "External Supplier"
    if (locationId === "Customer") return "Customer"
    if (locationId === "Inventory Loss") return "Inventory Loss"
    const location = warehouseLocations.find((loc) => loc.id === locationId)
    return location ? location.name : locationId
  }

  return (
    <DashboardShell className="bg-black">
      <DashboardHeader
        heading="Warehouse Management"
        text="Manage warehouse locations and inventory movements."
        className="text-white"
      >
        {activeTab === "locations" ? (
          <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
            
            <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white">
              {/* Dialog Content... */}
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog open={isAddMovementOpen} onOpenChange={setIsAddMovementOpen}>
           
            <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white">
                {/* Dialog Content... */}
            </DialogContent>
          </Dialog>
        )}
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-3 mb-4">
          {/* Card'lar o'zgarishsiz... */}
      </div>

      <Tabs defaultValue="locations" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-white-600 text-zinc-400">
          <TabsTrigger value="locations" className="data-[state=active]:bg-gray-200 data-[state=active]:text-black">Warehouse Locations</TabsTrigger>
          <TabsTrigger value="movements" className="data-[state=active]:bg-gray-200 data-[state=active]:text-black">Inventory Movements</TabsTrigger>
        </TabsList>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Filtrlash qismi o'zgarishsiz... */}
        </div>

        <TabsContent value="locations" className="space-y-4">
          <Card className="bg-white-600  text-white-900">
            <CardHeader>
              <CardTitle className="text-white">Warehouse Locations</CardTitle>
              <CardDescription className="text-zinc-800">
                {filteredLocations.length} {filteredLocations.length === 1 ? "location" : "locations"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="">
                    <TableHead className="text-zinc-800">Location ID</TableHead>
                    <TableHead className="text-zinc-800">Name</TableHead>
                    <TableHead className="text-zinc-800">Type</TableHead>
                    <TableHead className="text-zinc-800">Capacity</TableHead>
                    <TableHead className="text-zinc-800">Utilization</TableHead>
                    <TableHead className="text-zinc-800">Items</TableHead>
                    <TableHead className="text-zinc-800">Status</TableHead>
                    <TableHead className="text-right text-zinc-800">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.map((location) => (
                    <TableRow key={location.id} className="">
                      <TableCell className="font-medium text-white-900">{location.id}</TableCell>
                      <TableCell className="text-zinc-800">{location.name}</TableCell>
                      <TableCell className="text-zinc-800">{location.type}</TableCell>
                      <TableCell className="text-zinc-800">{location.capacity}</TableCell>
                      <TableCell>
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-800">{Math.round((location.used / location.capacity) * 100)}%</span>
                            <span className="text-zinc-800">{location.used}/{location.capacity}</span>
                          </div>

                          <Progress
                            value={(location.used / location.capacity) * 100}
                            className={`h-1.5 bg-zinc-800 ${
                                location.used / location.capacity > 0.9
                                ? "[&>div]:bg-red-500"
                                : location.used / location.capacity > 0.7
                                ? "[&>div]:bg-yellow-500"
                                : "[&>div]:bg-pink-500"
                            }`}
                          />

                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-800">{location.items}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${location.status === "Active" ? "bg-green-900 text-white" : "bg-zinc-800 text-zinc-400"}`}>
                          {location.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

  <TabsContent value="movements" className="space-y-4">
          <Card className="bg-white-600 text-white">
            <CardHeader>
              <CardTitle className="text-white">Inventory Movements</CardTitle>
              <CardDescription className="text-zinc-800">
                {filteredMovements.length} {filteredMovements.length === 1 ? "movement" : "movements"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="">
                    <TableHead className="text-zinc-800">Movement ID</TableHead>
                    <TableHead className="text-zinc-800">Date</TableHead>
                    <TableHead className="text-zinc-800">Type</TableHead>
                    <TableHead className="text-zinc-800">Product</TableHead>
                    <TableHead className="text-zinc-800">Quantity</TableHead>
                    <TableHead className="text-zinc-800">From</TableHead>
                    <TableHead className="text-zinc-800">To</TableHead>
                    <TableHead className="text-zinc-800">Reference</TableHead>
                    <TableHead className="text-right text-zinc-800">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((movement) => (
                    <TableRow key={movement.id} className="">
                      <TableCell className="font-medium text-zinc-600">{movement.id}</TableCell>
                      <TableCell className="text-zinc-800">{formatDate(movement.date)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            movement.type === "Receiving"
                              ? "bg-green-900 text-white"
                              : movement.type === "Shipping"
                                ? "bg-blue-900 text-white"
                                : movement.type === "Transfer"
                                  ? "bg-purple-900 text-white"
                                  : "bg-yellow-900 text-white"
                          }`}
                        >
                          {movement.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-600">{movement.product}</TableCell>
                      <TableCell className="text-zinc-600">
                        <span
                          className={
                            movement.quantity < 0
                              ? "text-red-500"
                              : movement.type === "Adjustment"
                                ? "text-yellow-500"
                                : ""
                          }
                        >
                          {movement.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-600">{getLocationName(movement.from)}</TableCell>
                      <TableCell className="text-zinc-600">{getLocationName(movement.to)}</TableCell>
                      <TableCell className="text-zinc-600">{movement.reference}</TableCell>
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
                              <Edit className="mr-2 h-4 w-4" /> View details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center hover:bg-zinc-800 focus:bg-zinc-800">
                              <Package className="mr-2 h-4 w-4" /> Track product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="flex items-center text-red-500 hover:bg-zinc-800 focus:bg-zinc-800">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete record
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