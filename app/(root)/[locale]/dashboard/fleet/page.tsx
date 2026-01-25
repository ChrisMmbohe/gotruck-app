"use client";

import { DashboardPage } from "@/components/auth/DashboardPage";
import { Can } from "@/components/auth/AccessControl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Truck, AlertTriangle, CheckCircle, Wrench, Plus, Search, Filter, Gauge, Fuel, Calendar, User, MapPin, Activity } from "lucide-react";
import { UserRole } from "@/lib/auth/roles";

const vehicles = [
  { id: 1, name: "KBZ-421", status: "active", location: "Nairobi, Kenya", driver: "John Kamau", mileage: 45200, fuel: 75, maintenance: 12, health: 92 },
  { id: 2, name: "UAZ-102", status: "active", location: "Kampala, Uganda", driver: "Sarah Auma", mileage: 38900, fuel: 60, maintenance: 8, health: 88 },
  { id: 3, name: "TZA-305", status: "active", location: "Dar es Salaam, TZ", driver: "Hassan Mkwawa", mileage: 52100, fuel: 85, maintenance: 5, health: 95 },
  { id: 4, name: "KBZ-189", status: "maintenance", location: "Nairobi Workshop", driver: "-", mileage: 67800, fuel: 20, maintenance: 0, health: 45 },
  { id: 5, name: "UAZ-234", status: "inactive", location: "Kampala Depot", driver: "-", mileage: 29400, fuel: 90, maintenance: 18, health: 78 },
  { id: 6, name: "RWA-189", status: "active", location: "Kigali, Rwanda", driver: "Marie Uwase", mileage: 31200, fuel: 68, maintenance: 15, health: 89 },
];

export default function FleetPage() {
  return (
    <DashboardPage
      requiredPermission="VIEW_FLEET"
      title="Fleet Management"
      description="Manage your vehicle fleet across EAC region"
    >
      <FleetContent />
    </DashboardPage>
  );
}

function FleetContent() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] -z-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Fleet Management</h1>
              <p className="text-slate-300 text-lg">Complete visibility and control over your vehicle fleet</p>
            </div>
            <Button className="bg-white text-slate-900 hover:bg-slate-100">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search vehicles, drivers, or locations..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fleet Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-blue-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">Total Fleet</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{vehicles.length}</div>
            <p className="text-xs text-slate-500 mt-1">Vehicles registered</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-green-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-green-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">Active Now</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {vehicles.filter((v) => v.status === "active").length}
            </div>
            <p className="text-xs text-slate-500 mt-1">On the road</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-amber-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">Maintenance</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Wrench className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {vehicles.filter((v) => v.status === "maintenance").length}
            </div>
            <p className="text-xs text-slate-500 mt-1">In workshop</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group hover:border-slate-500/50">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-slate-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-slate-600">Fleet Health</CardTitle>
            <div className="p-2 bg-slate-500/10 rounded-lg">
              <Activity className="h-5 w-5 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">87%</div>
            <p className="text-xs text-slate-500 mt-1">Average score</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in-up delay-200">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-xl transition-all duration-300 border-slate-200 group">
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    vehicle.status === "active"
                      ? "bg-green-500/10"
                      : vehicle.status === "maintenance"
                      ? "bg-amber-500/10"
                      : "bg-slate-500/10"
                  }`}>
                    <Truck className={`h-5 w-5 ${
                      vehicle.status === "active"
                        ? "text-green-600"
                        : vehicle.status === "maintenance"
                        ? "text-amber-600"
                        : "text-slate-600"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{vehicle.name}</h3>
                    <p className="text-xs text-slate-500">ID: {vehicle.id}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    vehicle.status === "active"
                      ? "success"
                      : vehicle.status === "maintenance"
                      ? "warning"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {vehicle.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                  {vehicle.status === "maintenance" && <Wrench className="h-3 w-3 mr-1" />}
                  {vehicle.status === "inactive" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {vehicle.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 space-y-4">
              {/* Driver & Location */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{vehicle.driver || "Unassigned"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">{vehicle.location}</span>
                </div>
              </div>
              
              {/* Metrics */}
              <div className="space-y-3 pt-3 border-t">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Gauge className="h-3.5 w-3.5" />
                      <span>Health Score</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{vehicle.health}%</span>
                  </div>
                  <Progress value={vehicle.health} className="h-1.5" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Fuel className="h-3.5 w-3.5" />
                      <span>Fuel Level</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{vehicle.fuel}%</span>
                  </div>
                  <Progress value={vehicle.fuel} className="h-1.5 [&>div]:bg-amber-500" />
                </div>
              </div>
              
              {/* Footer Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-0.5">Mileage</p>
                  <p className="text-sm font-bold text-slate-900">{vehicle.mileage.toLocaleString()} km</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    <p className="text-xs text-slate-500">Next Service</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{vehicle.maintenance} days</p>
                </div>
              </div>
              
              {/* Action Button */}
              <Button variant="outline" className="w-full mt-4 group-hover:bg-slate-50 transition-colors">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
