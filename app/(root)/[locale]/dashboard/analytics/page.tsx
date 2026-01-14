"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 3200000 },
  { month: "Feb", revenue: 3800000 },
  { month: "Mar", revenue: 3500000 },
  { month: "Apr", revenue: 4200000 },
  { month: "May", revenue: 3900000 },
  { month: "Jun", revenue: 4500000 },
];

const shipmentsData = [
  { month: "Jan", shipments: 120 },
  { month: "Feb", shipments: 142 },
  { month: "Mar", shipments: 135 },
  { month: "Apr", shipments: 158 },
  { month: "May", shipments: 145 },
  { month: "Jun", shipments: 172 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground">Track performance and optimize operations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (KES)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.1M</div>
            <p className="text-xs text-green-600">+12.5% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 days</div>
            <p className="text-xs text-green-600">-8% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2 km/L</div>
            <p className="text-xs text-green-600">+5.2% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-green-600">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue (KES)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipments Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={shipmentsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="shipments" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Route Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nairobi → Kampala</p>
                <p className="text-xs text-muted-foreground">45 trips this month</p>
              </div>
              <div className="text-right">
                <p className="font-medium">95% on-time</p>
                <p className="text-xs text-muted-foreground">Avg. 12.5 hours</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mombasa → Dar es Salaam</p>
                <p className="text-xs text-muted-foreground">32 trips this month</p>
              </div>
              <div className="text-right">
                <p className="font-medium">92% on-time</p>
                <p className="text-xs text-muted-foreground">Avg. 8.2 hours</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Kampala → Kigali</p>
                <p className="text-xs text-muted-foreground">28 trips this month</p>
              </div>
              <div className="text-right">
                <p className="font-medium">97% on-time</p>
                <p className="text-xs text-muted-foreground">Avg. 6.8 hours</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
