"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Package, Truck, Clock, ArrowUp, ArrowDown, Activity, Calendar } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 3200000, expenses: 2100000 },
  { month: "Feb", revenue: 3800000, expenses: 2300000 },
  { month: "Mar", revenue: 3500000, expenses: 2200000 },
  { month: "Apr", revenue: 4200000, expenses: 2600000 },
  { month: "May", revenue: 3900000, expenses: 2400000 },
  { month: "Jun", revenue: 4500000, expenses: 2700000 },
];

const shipmentsData = [
  { month: "Jan", shipments: 120, onTime: 112, delayed: 8 },
  { month: "Feb", shipments: 142, onTime: 135, delayed: 7 },
  { month: "Mar", shipments: 135, onTime: 128, delayed: 7 },
  { month: "Apr", shipments: 158, onTime: 151, delayed: 7 },
  { month: "May", shipments: 145, onTime: 137, delayed: 8 },
  { month: "Jun", shipments: 172, onTime: 162, delayed: 10 },
];

const routePerformance = [
  { route: "Nairobi-Kampala", value: 35, color: "#3b82f6" },
  { route: "Mombasa-Dar", value: 28, color: "#10b981" },
  { route: "Kampala-Kigali", value: 18, color: "#f59e0b" },
  { route: "Other Routes", value: 19, color: "#8b5cf6" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] -z-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics & Insights</h1>
              <p className="text-slate-300 text-lg">Data-driven decisions for optimal operations</p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="30days">
                <SelectTrigger className="w-[150px] bg-white/10 border-white/20 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-green-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-green-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Revenue</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">KES 23.1M</div>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="success" className="text-xs">
                <ArrowUp className="h-3 w-3 mr-1" />
                12.5%
              </Badge>
              <p className="text-xs text-slate-500">vs last period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-blue-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">Avg Delivery Time</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">2.3 days</div>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="success" className="text-xs">
                <ArrowDown className="h-3 w-3 mr-1" />
                8%
              </Badge>
              <p className="text-xs text-slate-500">improvement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-amber-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">Fleet Efficiency</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Truck className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">8.2 km/L</div>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="success" className="text-xs">
                <ArrowUp className="h-3 w-3 mr-1" />
                5.2%
              </Badge>
              <p className="text-xs text-slate-500">improvement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-purple-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">On-Time Delivery</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">94.2%</div>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="success" className="text-xs">
                <ArrowUp className="h-3 w-3 mr-1" />
                2.1%
              </Badge>
              <p className="text-xs text-slate-500">vs last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in-up delay-200">
        <Card className="lg:col-span-2 hover:shadow-xl transition-all duration-300 border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-lg font-bold text-slate-900">Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#f59e0b" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-lg font-bold text-slate-900">Route Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={routePerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {routePerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {routePerformance.map((route, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }} />
                    <span className="text-slate-600">{route.route}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{route.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-in-up delay-300 hover:shadow-xl transition-all duration-300 border-slate-200">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-lg font-bold text-slate-900">Shipment Performance Trend</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shipmentsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Bar dataKey="onTime" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="delayed" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
