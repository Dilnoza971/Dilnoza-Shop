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
import { Textarea } from "@/components/ui/textarea"

// 1. Backend API'ga mos Customer type'ini e'lon qilamiz
type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

// Yangi mijoz formasi uchun boshlang'ich holat
const initialFormState: Omit<Customer, 'id'> = {
  name: "",
  email: "",
  phone: "",
  address: "",
};


export default function CustomersPage() {
  // 2. State'larni API bilan ishlash uchun sozlaymiz
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  // ✅ Barcha so'rovlar uchun yagona, to'g'ri sarlavhalarni tayyorlaydigan funksiya
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
    };
  };

  // Backend'dan ma'lumotlarni o'qish
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        // ✅ XATO TO'G'IRLANDI: Endi getAuthHeaders() funksiyasi ishlatilmoqda
        const headers = getAuthHeaders();
        const response = await axios.get("http://127.0.0.1:8000/api/customers/", { headers });
        setCustomers(response.data);
      } catch (err: any) {
        if (!err.message.includes("token")) {
           setError(err.message || "Mijozlarni yuklashda xatolik yuz berdi.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Qidiruv logikasi
  useEffect(() => {
    let results = customers;
    if (searchTerm) {
      results = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCustomers(results);
  }, [searchTerm, customers]);

  // Forma input'lari o'zgarishini boshqarish
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Yangi mijoz qo'shish (POST so'rov)
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = getAuthHeaders();
      const response = await axios.post("http://127.0.0.1:8000/api/customers/", formData, { headers });
      
      setCustomers(prev => [...prev, response.data]);
      setIsDialogOpen(false); 
      setFormData(initialFormState); 
    } catch (err) {
      console.error("Mijoz qo'shishda xatolik:", err);
      alert("Mijoz qo'shishda xatolik yuz berdi.");
    }
  };
  
  // Mijozni o'chirish (DELETE so'rov)
  const handleDeleteCustomer = async (id: number) => {
    if (!confirm("Bu mijozni o'chirishga ishonchingiz komilmi?")) return;

    try {
        const headers = getAuthHeaders();
        await axios.delete(`http://127.0.0.1:8000/api/customers/${id}/`, { headers });
        setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
        console.error("O'chirishda xatolik:", err);
        alert("O'chirishda xatolik yuz berdi.");
    }
  };

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </DashboardShell>
    );
  }

  if (error) {
    return <DashboardShell><div className="text-red-500 text-center p-4">{error}</div></DashboardShell>;
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Mijozlar Boshqaruvi" text="Mijozlar bazasini ko'rish va boshqarish.">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1"><Plus className="h-4 w-4" /><span>Yangi mijoz</span></Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleAddCustomer}>
              <DialogHeader>
                <DialogTitle>Yangi Mijoz Qo'shish</DialogTitle>
                <DialogDescription>Yangi mijoz ma'lumotlarini kiriting.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Ismi</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Telefon</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">Manzil</Label>
                  <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Bekor qilish</Button>
                <Button type="submit">Qo'shish</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <div className="grid gap-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Mijoz ismi yoki emaili bo'yicha qidirish..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mijozlar Bazasi</CardTitle>
            <CardDescription>{filteredCustomers.length} ta mijoz topildi.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ismi</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefon</TableHead>
                  <TableHead>Manzil</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronDown className="h-4 w-4" /></Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuLabel>Amallar</DropdownMenuLabel>
                           <DropdownMenuItem onClick={() => alert(`Tahrirlash: ${customer.name}`)} className="flex items-center"><Edit className="mr-2 h-4 w-4" /> Tahrirlash</DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)} className="flex items-center text-red-600"><Trash2 className="mr-2 h-4 w-4" /> O'chirish</DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}