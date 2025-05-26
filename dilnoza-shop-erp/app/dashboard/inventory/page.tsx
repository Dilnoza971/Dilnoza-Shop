"use client"

import React, { useState, useEffect } from "react"
import axios from "axios" // axios'ni import qilishni unutmang
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react"
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

// 1. Backend API'ga mos Product type'ini e'lon qilamiz
type Product = {
  id: number;
  name: string;
  price: string;
  quantity: number;
  category: string;
  description: string;
  is_active: boolean;
};

// Yangi mahsulot formasi uchun boshlang'ich holat
const initialFormState = {
  name: "",
  price: "",
  quantity: 0,
  category: "",
  description: "",
};


export default function InventoryPage() {
  // 2. State'larni API bilan ishlash uchun sozlaymiz
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  // 3. Backend'dan ma'lumotlarni o'qish
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error("Avtorizatsiya tokeni topilmadi.");
      
      const response = await axios.get("http://127.0.0.1:8000/api/products/", {
        headers: { "Content-Type": "application/json" }
      });
      setProducts(response.data);
    } catch (err: any) {
      setError(err.message || "Mahsulotlarni yuklashda xatolik.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  useEffect(() => {
    let results = products;
    if (searchTerm) {
      results = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(results);
  }, [searchTerm, products]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post("http://127.0.0.1:8000/api/products/", formData, {
        headers: { "Content-Type": "application/json" }
      });
      // Ro'yxatni serverdan kelgan yangi mahsulot bilan yangilaymiz
      setProducts(prev => [...prev, response.data]);
      setIsDialogOpen(false); 
      setFormData(initialFormState); 
    } catch (err) {
      console.error("Mahsulot qo'shishda xatolik:", err);
      
    }
  };
  
  
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Bu mahsulotni o'chirishga ishonchingiz komilmi?")) return;

    try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`http://127.0.0.1:8000/api/products/${id}/`, {
            headers: { "Content-Type": "application/json" }
        });
       
        setProducts(products.filter(p => p.id !== id));
    } catch (err) {
        console.error("O'chirishda xatolik:", err);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="text-red-500 text-center p-4">{error}</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Omborxona" text="Mahsulotlar ro'yxati va qoldig'ini boshqarish.">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Yangi mahsulot</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleAddProduct}>
              <DialogHeader>
                <DialogTitle>Yangi Mahsulot Qo'shish</DialogTitle>
                <DialogDescription>Omborga yangi mahsulot ma'lumotlarini kiriting.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nomi</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">Kategoriyasi</Label>
                  <Input id="category" name="category" value={formData.category} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">Miqdori</Label>
                  <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Narxi ($)</Label>
                  <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} className="col-span-3" required />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Tavsifi</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" required />
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
            placeholder="Mahsulot nomi yoki kategoriyasi bo'yicha qidirish..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mahsulotlar Ro'yxati</CardTitle>
            <CardDescription>
              {filteredProducts.length} ta mahsulot topildi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomi</TableHead>
                  <TableHead>Kategoriyasi</TableHead>
                  <TableHead>Qoldiq (dona)</TableHead>
                  <TableHead>Narxi</TableHead>
                  <TableHead>Holati</TableHead>
                  <TableHead className="text-right">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {product.is_active ? "Sotuvda" : "Sotuvda emas"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                       
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                       </Button>
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