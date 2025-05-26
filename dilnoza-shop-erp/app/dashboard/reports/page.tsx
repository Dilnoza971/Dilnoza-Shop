import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { SalesReport } from "@/components/sales-report"
import { InventoryReport } from "@/components/inventory-report"
import { CustomerReport } from "@/components/customer-report"

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Reports & Analytics"
        text="View detailed reports and analytics for your business."
      ></DashboardHeader>
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>View your sales performance over time.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <SalesReport />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analysis</CardTitle>
              <CardDescription>Track your inventory levels and product performance.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <InventoryReport />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Analyze customer behavior and demographics.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <CustomerReport />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
