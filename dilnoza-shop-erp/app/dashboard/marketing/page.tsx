"use client"

import type React from "react" // React importi qo'shildi

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, ChevronDown, Edit, Trash2, BarChart2, Mail, Target, Package } from "lucide-react" // Package importi qo'shildi
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, LineChart } from "recharts"


export type Campaign = {
  id: string;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
  budget: number;
  status: "active" | "draft" | "completed" | "cancelled"; // Status turlarini aniqlashtiramiz
  description: string;
  created_at: string;
};


// Sample campaign data
const campaigns: Campaign[] = [
  { id: "CAM-1001", name: "Summer Collection Launch", type: "Email", start_date: "2025-06-01T00:00:00Z", end_date: "2025-06-15T00:00:00Z", budget: 5000, status: "active", description: "Promotional campaign for the new summer collection featuring discounts and special offers.", created_at: "2025-05-15T00:00:00Z" },
  { id: "CAM-1002", name: "Back to School Sale", type: "Social Media", start_date: "2025-08-01T00:00:00Z", end_date: "2025-08-20T00:00:00Z", budget: 7500, status: "draft", description: "Campaign targeting students and parents with special back-to-school discounts and promotions.", created_at: "2025-05-20T00:00:00Z" },
  { id: "CAM-1003", name: "Customer Loyalty Program", type: "Email", start_date: "2025-05-10T00:00:00Z", end_date: "2025-06-10T00:00:00Z", budget: 3000, status: "active", description: "Campaign to reward loyal customers with exclusive discounts and early access to new products.", created_at: "2025-05-05T00:00:00Z" },
  { id: "CAM-1004", name: "Fall Collection Teaser", type: "Social Media", start_date: "2025-09-01T00:00:00Z", end_date: "2025-09-15T00:00:00Z", budget: 6000, status: "draft", description: "Teaser campaign for the upcoming fall collection to generate excitement and anticipation.", created_at: "2025-05-25T00:00:00Z" },
  { id: "CAM-1005", name: "Holiday Season Promotion", type: "Multi-channel", start_date: "2025-11-15T00:00:00Z", end_date: "2025-12-31T00:00:00Z", budget: 15000, status: "draft", description: "Comprehensive holiday season campaign across email, social media, and in-store promotions.", created_at: "2025-05-30T00:00:00Z" },
  { id: "CAM-1006", name: "Flash Sale Weekend", type: "Email", start_date: "2025-05-25T00:00:00Z", end_date: "2025-05-27T00:00:00Z", budget: 2000, status: "completed", description: "Weekend flash sale with limited-time discounts on selected items.", created_at: "2025-05-10T00:00:00Z" },
  { id: "CAM-1007", name: "New Customer Welcome", type: "Email", start_date: "2025-05-01T00:00:00Z", end_date: "2025-12-31T00:00:00Z", budget: 1000, status: "active", description: "Automated welcome campaign for new customers with introductory offers.", created_at: "2025-04-25T00:00:00Z" },
]
const campaignPerformanceData = [ { name: "Week 1", clicks: 1200, impressions: 15000, conversions: 120 }, { name: "Week 2", clicks: 1800, impressions: 22000, conversions: 180 }, { name: "Week 3", clicks: 1500, impressions: 18000, conversions: 150 }, { name: "Week 4", clicks: 2200, impressions: 25000, conversions: 220 },]
const channelPerformanceData = [ { name: "Email", roi: 320, budget: 9000 }, { name: "Social Media", roi: 280, budget: 13500 }, { name: "Search", roi: 420, budget: 7500 }, { name: "Display", roi: 180, budget: 5000 },]
const conversionTrendsData = [ { name: "Jan", rate: 2.1 }, { name: "Feb", rate: 2.3 }, { name: "Mar", rate: 2.5 }, { name: "Apr", rate: 2.2 }, { name: "May", rate: 2.8 },]

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState("campaigns")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(campaigns)
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false)

  useEffect(() => {
    let filtered = campaigns
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((campaign) => campaign.status === statusFilter)
    }
    if (typeFilter !== "all") {
      filtered = filtered.filter((campaign) => campaign.type === typeFilter)
    }
    setFilteredCampaigns(filtered)
  }, [searchTerm, statusFilter, typeFilter])

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
  }

   const handleTypeFilter = (type: string) => {
    setTypeFilter(type)
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()
    if (now < start) return 0
    if (now > end) return 100
    return Math.round(((now - start) / (end - start)) * 100)
  }

  return (
    <DashboardShell className="bg-black">
      <DashboardHeader heading="Marketing" text="Manage marketing campaigns and analyze performance." className="text-white">
        {activeTab === "campaigns" && (
          <Dialog open={isAddCampaignOpen} onOpenChange={setIsAddCampaignOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1 bg-pink-600 hover:bg-pink-700"><Plus className="h-4 w-4" /><span>New Campaign</span></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Campaign</DialogTitle>
                <DialogDescription className="text-zinc-400">Fill in the details to create a new marketing campaign.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-zinc-400">Campaign Name</Label>
                  <Input id="name" placeholder="Campaign name" className="col-span-3 bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right text-zinc-400">Campaign Type</Label>
                  <Select defaultValue="email">
                    <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="email" className="focus:bg-zinc-800 focus:text-white">Email</SelectItem>
                      <SelectItem value="social" className="focus:bg-zinc-800 focus:text-white">Social Media</SelectItem>
                      <SelectItem value="search" className="focus:bg-zinc-800 focus:text-white">Search</SelectItem>
                      <SelectItem value="display" className="focus:bg-zinc-800 focus:text-white">Display</SelectItem>
                      <SelectItem value="multi" className="focus:bg-zinc-800 focus:text-white">Multi-channel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start-date" className="text-right text-zinc-400">Start Date</Label>
                  <Input id="start-date" type="date" className="col-span-3 bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end-date" className="text-right text-zinc-400">End Date</Label>
                  <Input id="end-date" type="date" className="col-span-3 bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="budget" className="text-right text-zinc-400">Budget ($)</Label>
                  <Input id="budget" type="number" placeholder="0.00" className="col-span-3 bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right text-zinc-400">Description</Label>
                  <Textarea id="description" placeholder="Campaign description" className="col-span-3 bg-zinc-800 border-zinc-700 text-white" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCampaignOpen(false)} className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800">Cancel</Button>
                <Button type="submit" onClick={() => setIsAddCampaignOpen(false)} className="bg-pink-600 hover:bg-pink-700">Create Campaign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DashboardHeader>

      <Tabs defaultValue="campaigns" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800 text-zinc-400">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">Analytics</TabsTrigger>
          <TabsTrigger value="audience" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input type="search" placeholder="Search campaigns..." className="pl-8 w-full bg-zinc-800 border-zinc-700 text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select onValueChange={handleStatusFilter} defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px] bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="all" className="focus:bg-zinc-800 focus:text-white">All Statuses</SelectItem>
                  <SelectItem value="draft" className="focus:bg-zinc-800 focus:text-white">Draft</SelectItem>
                  <SelectItem value="active" className="focus:bg-zinc-800 focus:text-white">Active</SelectItem>
                  <SelectItem value="completed" className="focus:bg-zinc-800 focus:text-white">Completed</SelectItem>
                  <SelectItem value="cancelled" className="focus:bg-zinc-800 focus:text-white">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={handleTypeFilter} defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px] bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="all" className="focus:bg-zinc-800 focus:text-white">All Types</SelectItem>
                  <SelectItem value="Email" className="focus:bg-zinc-800 focus:text-white">Email</SelectItem>
                  <SelectItem value="Social Media" className="focus:bg-zinc-800 focus:text-white">Social Media</SelectItem>
                  <SelectItem value="Multi-channel" className="focus:bg-zinc-800 focus:text-white">Multi-channel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-white">Marketing Campaigns</CardTitle>
              <CardDescription className="text-zinc-400">{filteredCampaigns.length} {filteredCampaigns.length === 1 ? "campaign" : "campaigns"} found</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400">Campaign</TableHead>
                    <TableHead className="text-zinc-400">Type</TableHead>
                    <TableHead className="text-zinc-400">Period</TableHead>
                    <TableHead className="text-zinc-400">Budget</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-zinc-400">Progress</TableHead>
                    <TableHead className="text-right text-zinc-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="border-zinc-800">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{campaign.name}</p>
                          <p className="text-xs text-zinc-500">{campaign.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-300">{campaign.type}</TableCell>
                      <TableCell className="text-zinc-300">{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</TableCell>
                      <TableCell className="text-zinc-300">${campaign.budget.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${campaign.status === "active" ? "bg-green-900/30 text-green-400" : campaign.status === "draft" ? "bg-blue-900/30 text-blue-400" : campaign.status === "completed" ? "bg-purple-900/30 text-purple-400" : "bg-red-900/30 text-red-400"}`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-400">{campaign.status === "completed" ? "100%" : `${calculateProgress(campaign.start_date, campaign.end_date)}%`}</span>
                          </div>
                         
                          <Progress
                            value={campaign.status === "completed" ? 100 : calculateProgress(campaign.start_date, campaign.end_date)}
                            className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"><ChevronDown className="h-4 w-4" /><span className="sr-only">Open menu</span></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="flex items-center hover:bg-zinc-800 focus:bg-zinc-800"><Edit className="mr-2 h-4 w-4" /> Edit campaign</DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center hover:bg-zinc-800 focus:bg-zinc-800"><BarChart2 className="mr-2 h-4 w-4" /> View analytics</DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center hover:bg-zinc-800 focus:bg-zinc-800"><Mail className="mr-2 h-4 w-4" /> Send test</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="flex items-center text-red-500 hover:bg-zinc-800 focus:bg-zinc-800"><Trash2 className="mr-2 h-4 w-4" /> Delete campaign</DropdownMenuItem>
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
            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader><CardTitle className="text-white">Campaign Performance</CardTitle><CardDescription className="text-zinc-400">Clicks, impressions, and conversions over time</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={campaignPerformanceData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#ffffff" }} labelStyle={{ color: "#ffffff" }}/>
                    <Legend />
                    <Bar dataKey="clicks" name="Clicks" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="impressions" name="Impressions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="conversions" name="Conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader><CardTitle className="text-white">Channel ROI</CardTitle><CardDescription className="text-zinc-400">Return on investment by marketing channel</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={channelPerformanceData} layout="vertical">
                    <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#ffffff" }} labelStyle={{ color: "#ffffff" }} />
                    <Legend />
                    <Bar dataKey="roi" name="ROI %" fill="#ec4899" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="budget" name="Budget ($)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader><CardTitle className="text-white">Conversion Rate Trends</CardTitle><CardDescription className="text-zinc-400">Monthly conversion rate percentage</CardDescription></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={conversionTrendsData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#ffffff" }} labelStyle={{ color: "#ffffff" }} formatter={(value:any) => [`${value}%`, "Conversion Rate"]}/>
                  <Line type="monotone" dataKey="rate" stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader><div className="flex items-center justify-between"><CardTitle className="text-white">Demographics</CardTitle><Target className="h-4 w-4 text-pink-500" /></div></CardHeader>
              <CardContent>
                <div className="space-y-4">
                 
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Age 18-24</span><span className="text-white">24%</span></div>
                  <Progress value={24} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Age 25-34</span><span className="text-white">38%</span></div>
                  <Progress value={38} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Age 35-44</span><span className="text-white">22%</span></div>
                  <Progress value={22} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Age 45-54</span><span className="text-white">10%</span></div>
                  <Progress value={10} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Age 55+</span><span className="text-white">6%</span></div>
                  <Progress value={6} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader><div className="flex items-center justify-between"><CardTitle className="text-white">Interests</CardTitle><Target className="h-4 w-4 text-pink-500" /></div></CardHeader>
              <CardContent>
                <div className="space-y-4">
               
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Fashion</span><span className="text-white">65%</span></div>
                  <Progress value={65} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Beauty</span><span className="text-white">48%</span></div>
                  <Progress value={48} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Fitness</span><span className="text-white">42%</span></div>
                  <Progress value={42} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Travel</span><span className="text-white">35%</span></div>
                  <Progress value={35} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Technology</span><span className="text-white">28%</span></div>
                  <Progress value={28} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader><div className="flex items-center justify-between"><CardTitle className="text-white">Geography</CardTitle><Target className="h-4 w-4 text-pink-500" /></div></CardHeader>
              <CardContent>
                <div className="space-y-4">
              
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">United States</span><span className="text-white">42%</span></div>
                  <Progress value={42} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">United Kingdom</span><span className="text-white">18%</span></div>
                  <Progress value={18} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Canada</span><span className="text-white">15%</span></div>
                  <Progress value={15} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Australia</span><span className="text-white">12%</span></div>
                  <Progress value={12} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                  <div><div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Other</span><span className="text-white">13%</span></div>
                  <Progress value={13} className="h-1.5 bg-zinc-800 [&>div]:bg-pink-500" /></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
                <CardTitle className="text-white">Customer Segments</CardTitle>
                <CardDescription className="text-zinc-400">Target audience segments based on behavior and preferences</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-zinc-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-white">Fashion Enthusiasts</h3>
                            <span className="bg-pink-900/30 text-pink-400 text-xs px-2 py-1 rounded-full">32% of base</span>
                        </div>
                        <p className="text-sm text-zinc-400 mb-3">Customers who frequently purchase high-end fashion items and follow the latest trends.</p>
                        <div className="flex items-center text-xs text-zinc-500"><span>Avg. Order: $120</span><span className="mx-2">•</span><span>Purchase Freq: 2.8/month</span></div>
                    </div>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-white">Bargain Hunters</h3>
                            <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded-full">28% of base</span>
                        </div>
                        <p className="text-sm text-zinc-400 mb-3">Price-sensitive customers who primarily shop during sales and with discount codes.</p>
                        <div className="flex items-center text-xs text-zinc-500"><span>Avg. Order: $65</span><span className="mx-2">•</span><span>Purchase Freq: 1.5/month</span></div>
                    </div>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-white">Seasonal Shoppers</h3>
                            <span className="bg-purple-900/30 text-purple-400 text-xs px-2 py-1 rounded-full">22% of base</span>
                        </div>
                        <p className="text-sm text-zinc-400 mb-3">Customers who make larger purchases at the beginning of each season.</p>
                        <div className="flex items-center text-xs text-zinc-500"><span>Avg. Order: $180</span><span className="mx-2">•</span><span>Purchase Freq: 0.8/month</span></div>
                    </div>
                    <div className="bg-zinc-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-white">Loyal Customers</h3>
                            <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full">18% of base</span>
                        </div>
                        <p className="text-sm text-zinc-400 mb-3">Long-term customers with consistent purchasing patterns across multiple categories.</p>
                        <div className="flex items-center text-xs text-zinc-500"><span>Avg. Order: $95</span><span className="mx-2">•</span><span>Purchase Freq: 3.2/month</span></div>
                    </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}