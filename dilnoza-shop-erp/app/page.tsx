'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    router.push('/dashboard');
    return null; 
  } 
  }, []);
 
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); 
    setError(null); 

    try {
   
      const response = await axios.post(
        'http://13.51.86.26/api/users/login', 
        {
          email, 
          password, 
        }
      );
      
      // Token va foydalanuvchi ma'lumotlarini saqlash
      const { access, refresh, ...userData } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(userData));

      router.push('/dashboard');

    } catch (err: any) {
      console.error('Login error:', err);
      // Xato matnini serverdan olishga harakat qilamiz
      if (err.response && err.response.data) {
        // SimpleJWT odatda 401 xatoda 'detail' maydonini qaytaradi
        setError(err.response.data.detail || 'Login yoki parol xato.');
      } else {
        setError('Tizimda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
      }
    } finally {
      setIsLoading(false); // So'rov tugadi, yuklanish holatini o'chiramiz
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            DILNOZA Shop
          </CardTitle>
          <CardDescription>
            Kirish uchun ma'lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email" // <-- 4. Bu atribut FormData uchun kerak edi, endi useState bilan ishlaymiz
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email} // Input qiymatini state'ga bog'laymiz
                  onChange={(e) => setEmail(e.target.value)} // State'ni o'zgartiramiz
                  disabled={isLoading} // Yuklanayotganda input'ni o'chiramiz
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                  id="password"
                  name="password" // <-- 4. Bu atribut ham kerak edi
                  type="password"
                  required
                  value={password} // Input qiymatini state'ga bog'laymiz
                  onChange={(e) => setPassword(e.target.value)} // State'ni o'zgartiramiz
                  disabled={isLoading} // Yuklanayotganda input'ni o'chiramiz
                />
              </div>
              {/* Xatolik bo'lsa, uni ko'rsatamiz */}
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Kirilmoqda...' : 'Kirish'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
