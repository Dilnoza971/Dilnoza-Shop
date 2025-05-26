"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Search, Plus, ChevronDown, Edit, Trash2, Mail, Phone, Calendar } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Employee } from "@/lib/supabase"

// Sample employee data (would come from Supabase in production)
const employees: Employee[] = [
  {
    id: "EMP-1001",
    name: "Sarah Johnson",
    position: "Store Manager",
    department: "Retail",
    email: "sarah.j@dilnozashop.com",
    phone: "+1 (555) 123-4567",
    hire_date: "2023-03-15T00:00:00Z",
    status: "active",
    created_at: "2023-03-15T00:00:00Z",
  },
  {
    id: "EMP-1002",
    name: "Michael Brown",
    position: "Sales Associate",
    department: "Retail",
    email: "michael.b@dilnozashop.com",
    phone: "+1 (555) 234-5678",
    hire_date: "2023-05-20T00:00:00Z",
    status: "active",
    created_at: "2023-05-20T00:00:00Z",
  },
  {
    id: "EMP-1003",
    name: "Emma Wilson",
    position: "Marketing Specialist",
    department: "Marketing",
    email: "emma.w@dilnozashop.com",
    phone: "+1 (555) 345-6789",
    hire_date: "2023-07-10T00:00:00Z",
    status: "active",
    created_at: "2023-07-10T00:00:00Z",
  },
  {
    id: "EMP-1004",
    name: "James Miller",
    position: "Inventory Manager",
    department: "Operations",
    email: "james.m@dilnozashop.com",
    phone: "+1 (555) 456-7890",
    hire_date: "2023-02-05T00:00:00Z",
    status: "active",
    created_at: "2023-02-05T00:00:00Z",
  },
  {
    id: "EMP-1005",
    name: "Olivia Davis",
    position: "Customer Service Rep",
    department: "Customer Support",
    email: "olivia.d@dilnozashop.com",
    phone: "+1 (555) 567-8901",
    hire_date: "2023-09-15T00:00:00Z",
    status: "active",
    created_at: "2023-09-15T00:00:00Z",
  },
  {
    id: "EMP-1006",
    name: "William Taylor",
    position: "Web Developer",
    department: "IT",
    email: "william.t@dilnozashop.com",
    phone: "+1 (555) 678-9012",
    hire_date: "2023-04-25T00:00:00Z",
    status: "active",
    created_at: "2023-04-25T00:00:00Z",
  },
  {
    id: "EMP-1007",
    name: "Sophia Martinez",
    position: "Accountant",
    department: "Finance",
    email: "sophia.m@dilnozashop.com",
    phone: "+1 (555) 789-0123",
    hire_date: "2023-06-30T00:00:00Z",
    status: "on_leave",
    created_at: "2023-06-30T00:00:00Z",
  },
  {
    id: "EMP-1008",
    name: "Benjamin Anderson",
    position: "Warehouse Associate",
    department: "Operations",
    email: "benjamin.a@dilnozashop.com",
    phone: "+1 (555) 890-1234",
    hire_date: "2023-08-12T00:00:00Z",
    status: "active",
    created_at: "2023-08-12T00:00:00Z",
  },
  {
    id: "EMP-1009",
    name: "Isabella Thomas",
    position: "HR Specialist",
    department: "Human Resources",
    email: "isabella.t@dilnozashop.com",
    phone: "+1 (555) 901-2345",
    hire_date: "2023-01-20T00:00:00Z",
    status: "active",
    created_at: "2023-01-20T00:00:00Z",
  },
  {
    id: "EMP-1010",
    name: "Ethan Jackson",
    position: "Graphic Designer",
    department: "Marketing",
    email: "ethan.j@dilnozashop.com",
    phone: "+1 (555) 012-3456",
    hire_date: "2023-10-05T00:00:00Z",
    status: "terminated",
    created_at: "2023-10-05T00:00:00Z",
  },
]

// Sample schedule data
const scheduleData = [
  {
    id: 1,
    employee: "Sarah Johnson",
    position: "Store Manager",
    monday: "9:00 - 17:00",
    tuesday: "9:00 - 17:00",
    wednesday: "9:00 - 17:00",
    thursday: "9:00 - 17:00",
    friday: "9:00 - 17:00",
    saturday: "OFF",
    sunday: "OFF",
  },
  {
    id: 2,
    employee: "Michael Brown",
    position: "Sales Associate",
    monday: "12:00 - 20:00",
    tuesday: "12:00 - 20:00",
    wednesday: "OFF",
    thursday: "12:00 - 20:00",
    friday: "12:00 - 20:00",
    saturday: "10:00 - 18:00",
    sunday: "OFF",
  },
  {
    id: 3,
    employee: "Emma Wilson",
    position: "Marketing Specialist",
    monday: "9:00 - 17:00",
    tuesday: "9:00 - 17:00",
    wednesday: "9:00 - 17:00",
    thursday: "9:00 - 17:00",
    friday: "9:00 - 17:00",
    saturday: "OFF",
    sunday: "OFF",
  },
  {
    id: 4,
    employee: "James Miller",
    position: "Inventory Manager",
    monday: "8:00 - 16:00",
    tuesday: "8:00 - 16:00",
    wednesday: "8:00 - 16:00",
    thursday: "8:00 - 16:00",
    friday: "8:00 - 16:00",
    saturday: "OFF",
    sunday: "OFF",
  },
  {
    id: 5,
    employee: "Olivia Davis",
    position: "Customer Service Rep",
    monday: "10:00 - 18:00",
    tuesday: "10:00 - 18:00",
    wednesday: "10:00 - 18:00",
    thursday: "OFF",
    friday: "10:00 - 18:00",
    saturday: "10:00 - 18:00",
    sunday: "OFF",
  },
]

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState("directory")
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Filter employees based on search term, department, and status
  useEffect(() => {
    let filtered = employees

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((employee) => employee.department === departmentFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((employee) => employee.status === statusFilter)
    }

    setFilteredEmployees(filtered)
  }, [searchTerm, departmentFilter, statusFilter])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleDepartmentFilter = (department: string) => {
    setDepartmentFilter(department)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-900/30 text-green-400"
      case "on_leave":
        return "bg-yellow-900/30 text-yellow-400"
      case "terminated":
        return "bg-red-900/30 text-red-400"
      default:
        return "bg-zinc-800 text-zinc-400"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "on_leave":
        return "On Leave"
      case "terminated":
        return "Terminated"
      default:
        return status
    }
  }

  // Get unique departments from employees
  const departments = Array.from(new Set(employees.map((e) => e.department)))

  return (
    <DashboardShell className="bg-black">
      <DashboardHeader
        heading="Staff Management"
        text="Manage employees, schedules, and performance."
        className="text-white"
      >
        {activeTab === "directory" && (
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1 bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4" />
                <span>Add Employee</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-zinc-900 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Employee</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Enter the details to add a new employee to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-zinc-400">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right text-zinc-400">
                    Position
                  </Label>
                  <Input
                    id="position"
                    placeholder="Job title"
                    className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right text-zinc-400">
                    Department
                  </Label>
                  <Select defaultValue="retail">
                    <SelectTrigger className="col-span-3 bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                      <SelectItem value="retail" className="focus:bg-zinc-800 focus:text-white">
                        Retail
                      </SelectItem>
                      <SelectItem value="marketing" className="focus:bg-zinc-800 focus:text-white">
                        Marketing
                      </SelectItem>
                      <SelectItem value="operations" className="focus:bg-zinc-800 focus:text-white">
                        Operations
                      </SelectItem>
                      <SelectItem value="finance" className="focus:bg-zinc-800 focus:text-white">
                        Finance
                      </SelectItem>
                      <SelectItem value="it" className="focus:bg-zinc-800 focus:text-white">
                        IT
                      </SelectItem>
                      <SelectItem value="hr" className="focus:bg-zinc-800 focus:text-white">
                        Human Resources
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right text-zinc-400">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@dilnozashop.com"
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
                  <Label htmlFor="hire-date" className="text-right text-zinc-400">
                    Hire Date
                  </Label>
                  <Input id="hire-date" type="date" className="col-span-3 bg-zinc-800 border-zinc-700 text-white" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  Add Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </DashboardHeader>

      <Tabs defaultValue="directory" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-800 text-zinc-400">
          <TabsTrigger value="directory" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
            Employee Directory
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-8 w-full bg-zinc-800 border-zinc-700 text-white"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Select onValueChange={handleDepartmentFilter} defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="all" className="focus:bg-zinc-800 focus:text-white">
                    All Departments
                  </SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department} className="focus:bg-zinc-800 focus:text-white">
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={handleStatusFilter} defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="all" className="focus:bg-zinc-800 focus:text-white">
                    All Statuses
                  </SelectItem>
                  <SelectItem value="active" className="focus:bg-zinc-800 focus:text-white">
                    Active
                  </SelectItem>
                  <SelectItem value="on_leave" className="focus:bg-zinc-800 focus:text-white">
                    On Leave
                  </SelectItem>
                  <SelectItem value="terminated" className="focus:bg-zinc-800 focus:text-white">
                    Terminated
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-12">
            {/* Employee List */}
            <Card className="md:col-span-8 bg-zinc-900 border-zinc-800 text-white">
              <CardHeader>
                <CardTitle className="text-white">Employee Directory</CardTitle>
                <CardDescription className="text-zinc-400">
                  {filteredEmployees.length} {filteredEmployees.length === 1 ? "employee" : "employees"} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800">
                      <TableHead className="text-zinc-400">Employee</TableHead>
                      <TableHead className="text-zinc-400">Position</TableHead>
                      <TableHead className="text-zinc-400">Department</TableHead>
                      <TableHead className="text-zinc-400">Status</TableHead>
                      <TableHead className="text-right text-zinc-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} className="border-zinc-800">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-zinc-700 text-zinc-300">
                                {getInitials(employee.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white">{employee.name}</p>
                              <p className="text-xs text-zinc-500">{employee.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-300">{employee.position}</TableCell>
                        <TableCell className="text-zinc-300">{employee.department}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                              employee.status,
                            )}`}
                          >
                            {getStatusLabel(employee.status)}
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
                              <DropdownMenuItem
                                className="flex items-center hover:bg-zinc-800 focus:bg-zinc-800"
                                onClick={() => setSelectedEmployee(employee)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> View profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center hover:bg-zinc-800 focus:bg-zinc-800">
                                <Mail className="mr-2 h-4 w-4" /> Send email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-zinc-800" />
                              <DropdownMenuItem className="flex items-center text-red-500 hover:bg-zinc-800 focus:bg-zinc-800">
                                <Trash2 className="mr-2 h-4 w-4" /> Remove employee
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

            {/* Employee Details */}
            <Card className="md:col-span-4 bg-zinc-900 border-zinc-800 text-white">
              <CardHeader>
                <CardTitle className="text-white">Employee Details</CardTitle>
                <CardDescription className="text-zinc-400">
                  {selectedEmployee ? "View employee information" : "Select an employee to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedEmployee ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-2">
                        <AvatarFallback className="text-xl bg-zinc-700 text-zinc-300">
                          {getInitials(selectedEmployee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-medium text-white">{selectedEmployee.name}</h3>
                      <p className="text-sm text-zinc-400">{selectedEmployee.position}</p>
                      <span
                        className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          selectedEmployee.status,
                        )}`}
                      >
                        {getStatusLabel(selectedEmployee.status)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-zinc-500" />
                        <span className="text-zinc-300">{selectedEmployee.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-zinc-500" />
                        <span className="text-zinc-300">{selectedEmployee.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-zinc-500" />
                        <span className="text-zinc-300">Hired: {formatDate(selectedEmployee.hire_date)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                      <h4 className="text-sm font-medium text-zinc-400 mb-2">Department</h4>
                      <p className="text-white">{selectedEmployee.department}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-pink-600 hover:bg-pink-700">Edit Profile</Button>
                      <Button
                        variant="outline"
                        className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                      >
                        View Schedule
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-zinc-500">
                    <p className="text-center">Select an employee from the list to view their details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Weekly Schedule</CardTitle>
                <CardDescription className="text-zinc-400">May 20 - May 26, 2025</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Previous Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Next Week
                </Button>
                <Button className="gap-1 bg-pink-600 hover:bg-pink-700" size="sm">
                  <Plus className="h-4 w-4" />
                  <span>Add Shift</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="text-zinc-400">Employee</TableHead>
                    <TableHead className="text-zinc-400">Monday</TableHead>
                    <TableHead className="text-zinc-400">Tuesday</TableHead>
                    <TableHead className="text-zinc-400">Wednesday</TableHead>
                    <TableHead className="text-zinc-400">Thursday</TableHead>
                    <TableHead className="text-zinc-400">Friday</TableHead>
                    <TableHead className="text-zinc-400">Saturday</TableHead>
                    <TableHead className="text-zinc-400">Sunday</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleData.map((schedule) => (
                    <TableRow key={schedule.id} className="border-zinc-800">
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{schedule.employee}</p>
                          <p className="text-xs text-zinc-500">{schedule.position}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-300">{schedule.monday}</TableCell>
                      <TableCell className="text-zinc-300">{schedule.tuesday}</TableCell>
                      <TableCell className="text-zinc-300">{schedule.wednesday}</TableCell>
                      <TableCell className="text-zinc-300">{schedule.thursday}</TableCell>
                      <TableCell className="text-zinc-300">{schedule.friday}</TableCell>
                      <TableCell className="text-zinc-300">{schedule.saturday}</TableCell>
                      <TableCell className="text-zinc-300">{schedule.sunday}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle className="text-white">Performance Reviews</CardTitle>
              <CardDescription className="text-zinc-400">
                Track employee performance and schedule reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Upcoming Reviews</h3>
                  <Button className="gap-1 bg-pink-600 hover:bg-pink-700" size="sm">
                    <Plus className="h-4 w-4" />
                    <span>Schedule Review</span>
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800">
                      <TableHead className="text-zinc-400">Employee</TableHead>
                      <TableHead className="text-zinc-400">Review Type</TableHead>
                      <TableHead className="text-zinc-400">Scheduled Date</TableHead>
                      <TableHead className="text-zinc-400">Reviewer</TableHead>
                      <TableHead className="text-zinc-400">Status</TableHead>
                      <TableHead className="text-right text-zinc-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-zinc-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-zinc-700 text-zinc-300">MB</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-white">Michael Brown</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-300">Quarterly</TableCell>
                      <TableCell className="text-zinc-300">May 25, 2025</TableCell>
                      <TableCell className="text-zinc-300">Sarah Johnson</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-400">
                          Scheduled
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-zinc-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-zinc-700 text-zinc-300">EW</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-white">Emma Wilson</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-300">Annual</TableCell>
                      <TableCell className="text-zinc-300">June 10, 2025</TableCell>
                      <TableCell className="text-zinc-300">Isabella Thomas</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                          Preparation
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-zinc-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-zinc-700 text-zinc-300">JM</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-white">James Miller</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-300">Quarterly</TableCell>
                      <TableCell className="text-zinc-300">June 15, 2025</TableCell>
                      <TableCell className="text-zinc-300">Isabella Thomas</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                          Preparation
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-white mb-4">Recent Reviews</h3>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800">
                        <TableHead className="text-zinc-400">Employee</TableHead>
                        <TableHead className="text-zinc-400">Review Type</TableHead>
                        <TableHead className="text-zinc-400">Date Completed</TableHead>
                        <TableHead className="text-zinc-400">Reviewer</TableHead>
                        <TableHead className="text-zinc-400">Rating</TableHead>
                        <TableHead className="text-right text-zinc-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-zinc-800">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-zinc-700 text-zinc-300">OD</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-white">Olivia Davis</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-300">Quarterly</TableCell>
                        <TableCell className="text-zinc-300">May 5, 2025</TableCell>
                        <TableCell className="text-zinc-300">Sarah Johnson</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-400">
                            Excellent
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-zinc-800">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-zinc-700 text-zinc-300">WT</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-white">William Taylor</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-300">Annual</TableCell>
                        <TableCell className="text-zinc-300">April 25, 2025</TableCell>
                        <TableCell className="text-zinc-300">Isabella Thomas</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-400">
                            Good
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
