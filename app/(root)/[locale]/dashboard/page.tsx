"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Truck, Package, MapPin, TrendingUp, Clock, AlertCircle, 
  ArrowUp, ArrowDown, Activity, DollarSign, Navigation, Users 
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] -z-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Command Center</h1>
              <p className="text-slate-300 text-lg">Real-time freight operations across East Africa</p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-sm px-3 py-1">
              <Activity className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Active Now</p>
              <p className="text-3xl font-bold">142</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">On Schedule</p>
              <p className="text-3xl font-bold">94%</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Avg Response</p>
              <p className="text-3xl font-bold">1.2h</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Today's Revenue</p>
              <p className="text-3xl font-bold">KES 4.2M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-blue-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">Active Shipments</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">142</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success" className="text-xs gap-1">
                <ArrowUp className="h-3 w-3" /> 12%
              </Badge>
              <p className="text-xs text-slate-500">vs last month</p>
            </div>
            <Progress value={85} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-green-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-green-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">Fleet Utilization</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Truck className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">48/52</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success" className="text-xs gap-1">
                <ArrowUp className="h-3 w-3" /> 92%
              </Badge>
              <p className="text-xs text-slate-500">capacity used</p>
            </div>
            <Progress value={92} className="mt-3 h-1.5 [&>div]:bg-green-500" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-amber-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">On-Time Delivery</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">94.2%</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success" className="text-xs gap-1">
                <ArrowUp className="h-3 w-3" /> 2.1%
              </Badge>
              <p className="text-xs text-slate-500">improvement</p>
            </div>
            <Progress value={94} className="mt-3 h-1.5 [&>div]:bg-amber-500" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-purple-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">Revenue (MTD)</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">KES 4.2M</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="success" className="text-xs gap-1">
                <ArrowUp className="h-3 w-3" /> 18%
              </Badge>
              <p className="text-xs text-slate-500">vs last month</p>
            </div>
            <Progress value={72} className="mt-3 h-1.5 [&>div]:bg-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics & Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up delay-200">
        {/* Live Activity Feed */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300 border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900">Live Operations Feed</CardTitle>
              <Badge variant="outline" className="text-xs">
                <Activity className="w-3 h-3 mr-1 animate-pulse" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-500/10 rounded-lg mt-1">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900">Shipment #SH-3421 Delivered</p>
                      <Badge variant="success" className="text-xs">Completed</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-1">Nairobi, Kenya → Kampala, Uganda</p>
                    <p className="text-xs text-slate-500">Delivered 15 mins ahead of schedule</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">2h ago</span>
                </div>
              </div>
              
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg mt-1">
                    <Navigation className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900">Truck KBZ-421 En Route</p>
                      <Badge variant="info" className="text-xs">In Transit</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-1">Approaching Malaba border crossing</p>
                    <p className="text-xs text-slate-500">ETA: 2.5 hours • Driver: John Kamau</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">4h ago</span>
                </div>
              </div>
              
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg mt-1">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900">Maintenance Required</p>
                      <Badge variant="warning" className="text-xs">Action Needed</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-1">Truck UAZ-102 service due</p>
                    <p className="text-xs text-slate-500">Scheduled maintenance in 3 days</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">6h ago</span>
                </div>
              </div>
              
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg mt-1">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900">New Driver Onboarded</p>
                      <Badge variant="outline" className="text-xs">Team Update</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-1">Sarah Auma joined the team</p>
                    <p className="text-xs text-slate-500">Route: Tanzania corridor</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">1d ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="hover:shadow-lg transition-all duration-300 border-slate-200">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-lg font-bold text-slate-900">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Border Crossings</span>
                <span className="text-xl font-bold text-slate-900">28</span>
              </div>
              <Progress value={70} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">Today's activity</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Fuel Efficiency</span>
                <span className="text-xl font-bold text-slate-900">8.2 km/L</span>
              </div>
              <Progress value={82} className="h-2 [&>div]:bg-green-500" />
              <p className="text-xs text-slate-500 mt-1">+5% improvement</p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Driver Satisfaction</span>
                <span className="text-xl font-bold text-slate-900">4.8/5</span>
              </div>
              <Progress value={96} className="h-2 [&>div]:bg-purple-500" />
              <p className="text-xs text-slate-500 mt-1">Based on 156 reviews</p>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-slate-600">All systems operational</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Performance */}
      <Card className="animate-fade-in-up delay-300 hover:shadow-lg transition-all duration-300 border-slate-200">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-900">Top Routes Performance</CardTitle>
            <Badge variant="outline" className="text-xs">Last 30 Days</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Nairobi → Kampala</p>
                    <p className="text-xs text-slate-500">Northern Corridor</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">1,248</p>
                  <p className="text-xs text-slate-500">shipments</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={85} className="flex-1 h-2" />
                <span className="text-sm font-medium text-green-600">85%</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Mombasa → Dar es Salaam</p>
                    <p className="text-xs text-slate-500">Central Corridor</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">892</p>
                  <p className="text-xs text-slate-500">shipments</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={92} className="flex-1 h-2 [&>div]:bg-green-500" />
                <span className="text-sm font-medium text-green-600">92%</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Kampala → Kigali</p>
                    <p className="text-xs text-slate-500">Regional Link</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">567</p>
                  <p className="text-xs text-slate-500">shipments</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={78} className="flex-1 h-2 [&>div]:bg-purple-500" />
                <span className="text-sm font-medium text-purple-600">78%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
