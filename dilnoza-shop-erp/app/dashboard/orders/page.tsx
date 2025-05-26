"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Plus, Search, Edit, Trash2, Loader2, ChevronDown } from "lucide-react"
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

// 1. Backend API'ga mos Type'larni e'lon qilamiz
type Order = {
  id: number;
  product: number; // Product ID'si
  customer: number; // Customer ID'si
  quantity: number;
  status: 'pending' | 'shipped' | 'delivered';
  date: string;
  // Backenddan keladigan qo'shimcha ma'lumotlar (agar bo'lsa)
  product_name?: string;
  customer_name?: string;
};

type Product = { id: number; name: string; };
type Customer = { id: number; name: string; };

const initialFormState = {
  product: '',
  customer: '',
  quantity: 1,
  status: 'pending' as const,
};

export default function OrdersPage() {
  // 2. State'larni API bilan ishlash uchun sozlaymiz
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  // Talabingizga binoan faqat Content-Type'ni qaytaradigan funksiya
  const getHeaders = () => {
    return { 'Content-Type': 'application/json' };
  };

  // 3. Backend'dan ma'lumotlarni o'qish (Buyurtmalar, Mahsulotlar, Mijozlar)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const headers = getHeaders();
        // Bir vaqtda bir nechta so'rov jo'natish
        const [ordersRes, productsRes, customersRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/orders/", { headers }),
          axios.get("http://127.0.0.1:8000/api/products/", { headers }),
          axios.get("http://127.0.0.1:8000/api/customers/", { headers }),
        ]);

        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setCustomers(customersRes.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || "Ma'lumotlarni yuklashda xatolik yuz berdi.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const handleFormChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 4. Yangi buyurtma qo'shish
  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = getHeaders();
      // Ma'lumotlarni backend kutgan formatga o'tkazamiz
      const submissionData = {
        ...formData,
        product: Number(formData.product),
        customer: Number(formData.customer),
      };
      
      const response = await axios.post("http://127.0.0.1:8000/api/orders/", submissionData, { headers });
      setOrders(prev => [...prev, response.data]);
      setIsDialogOpen(false); 
      setFormData(initialFormState); 
    } catch (err) {
      console.error("Buyurtma qo'shishda xatolik:", err);
      alert("Buyurtma qo'shishda xatolik yuz berdi.");
    }
  };
  
  // 5. Buyurtmani o'chirish
  const handleDeleteOrder = async (id: number) => {
    if (!confirm(`#${id} raqamli buyurtmani o'chirishga ishonchingiz komilmi?`)) return;
    try {
        const headers = getHeaders();
        await axios.delete(`http://127.0.0.1:8000/api/orders/${id}/`, { headers });
        setOrders(orders.filter(o => o.id !== id));
    } catch (err) {
        console.error("O'chirishda xatolik:", err);
        alert("O'chirishda xatolik yuz berdi.");
    }
  };
  
  // Status uchun ranglar
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  if (isLoading) {
    return <DashboardShell><div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div></DashboardShell>;
  }

  if (error) {
    return <DashboardShell><div className="text-red-500 text-center p-4">{error}</div></DashboardShell>;
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Buyurtmalar Boshqaruvi" text="Mijozlar buyurtmalarini ko'rish va boshqarish.">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1"><Plus className="h-4 w-4" /><span>Yangi buyurtma</span></Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleAddOrder}>
              <DialogHeader>
                <DialogTitle>Yangi Buyurtma Yaratish</DialogTitle>
                <DialogDescription>Yangi buyurtma ma'lumotlarini kiriting.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer" className="text-right">Mijoz</Label>
                    <Select onValueChange={(value) => handleFormChange('customer', value)} required>
                        <SelectTrigger className="col-span-3"><SelectValue placeholder="Mijozni tanlang" /></SelectTrigger>
                        <SelectContent>
                            {customers.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="product" className="text-right">Mahsulot</Label>
                    <Select onValueChange={(value) => handleFormChange('product', value)} required>
                        <SelectTrigger className="col-span-3"><SelectValue placeholder="Mahsulotni tanlang" /></SelectTrigger>
                        <SelectContent>
                            {products.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">Miqdori</Label>
                  <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={(e) => handleFormChange('quantity', e.target.value)} className="col-span-3" required />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Holati</Label>
                    <Select onValueChange={(value) => handleFormChange('status', value)} defaultValue={formData.status} required>
                        <SelectTrigger className="col-span-3"><SelectValue placeholder="Holatni tanlang" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Bekor qilish</Button>
                <Button type="submit">Yaratish</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <Card>
          <CardHeader><CardTitle>Buyurtmalar</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyurtma ID</TableHead>
                  <TableHead>Mijoz</TableHead>
                  <TableHead>Mahsulot</TableHead>
                  <TableHead>Miqdori</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Holati</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.customer_name || `Mijoz ID: ${order.customer}`}</TableCell>
                    <TableCell>{order.product_name || `Mahsulot ID: ${order.product}`}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><ChevronDown className="h-4 w-4" /></Button></DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => alert(`Tahrirlash: #${order.id}`)}><Edit className="mr-2 h-4 w-4" /> Tahrirlash</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> O'chirish</DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </DashboardShell>
  )
}