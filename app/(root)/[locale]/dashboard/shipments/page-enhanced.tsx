"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, MapPin, Clock, CheckCircle, Search, Filter, Plus,
  ArrowRight, TrendingUp, Calendar, User, Truck, Download
} from "lucide-react";

const shipments = [
  {
    id: "SH-3421",
    origin: "Nairobi, Kenya",
    destination: "Kampala, Uganda",
    status: "delivered",
    cargo: "Electronics",
    weight: "12.5 tons",
    vehicle: "KBZ-421",
    driver: "John Kamau",
    estimatedDelivery: "2026-01-10",
    actualDelivery: "2026-01-10",
    progress: 100,
  },
  {
    id: "SH-3422",
    origin: "Mombasa, Kenya",
    destination: "Dar es Salaam, Tanzania",
    status: "in-transit",
    cargo: "Textiles",
    weight: "8.3 tons",
    vehicle: "TZA-305",
    driver: "Hassan Mkwawa",
    estimatedDelivery: "2026-01-16",
    progress: 65,
  },
  {
    id: "SH-3423",
    origin: "Kampala, Uganda",
    destination: "Kigali, Rwanda",
    status: "in-transit",
    cargo: "Food Products",
    weight: "15.2 tons",
    vehicle: "UAZ-102",
    driver: "Sarah Auma",
    estimatedDelivery: "2026-01-15",
    progress: 45,
  },
  {
    id: "SH-3424",
    origin: "Nairobi, Kenya",
    destination: "Juba, South Sudan",
    status: "pending",
    cargo: "Construction Materials",
    weight: "22.0 tons",
    vehicle: "-",
    driver: "-",
    estimatedDelivery: "2026-01-20",
    progress: 0,
  },
];

export default function ShipmentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] -z-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Shipment Management</h1>
              <p className="text-slate-300 text-lg">Track and manage freight orders across EAC</p>
            </div>
            <Button className="bg-white text-slate-900 hover:bg-slate-100">
              <Plus className="h-4 w-4 mr-2" />
              New Shipment
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Total Shipments</p>
              <p className="text-3xl font-bold">{shipments.length}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">In Transit</p>
              <p className="text-3xl font-bold">{shipments.filter(s => s.status === "in-transit").length}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Delivered Today</p>
              <p className="text-3xl font-bold">{shipments.filter(s => s.status === "delivered").length}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">On-Time Rate</p>
              <p className="text-3xl font-bold">94%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search by shipment ID, origin, or destination..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Grid */}
      <div className="grid gap-6">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className="hover:shadow-xl transition-all duration-300 border-slate-200 group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    shipment.status === "delivered" ? "bg-green-500/10" :
                    shipment.status === "in-transit" ? "bg-blue-500/10" :
                    "bg-slate-500/10"
                  }`}>
                    <Package className={`h-6 w-6 ${
                      shipment.status === "delivered" ? "text-green-600" :
                      shipment.status === "in-transit" ? "text-blue-600" :
                      "text-slate-600"
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{shipment.id}</h3>
                      <Badge 
                        variant={
                          shipment.status === "delivered" ? "success" :
                          shipment.status === "in-transit" ? "info" :
                          "outline"
                        }
                      >
                        {shipment.status === "delivered" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {shipment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{shipment.cargo} • {shipment.weight}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Route */}
              <div className="flex items-center gap-3 mb-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-semibold text-slate-900">{shipment.origin}</p>
                  </div>
                  <p className="text-xs text-slate-500">Origin</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-16 h-0.5 bg-slate-300 relative">
                    <div 
                      className="h-full bg-blue-500 absolute left-0" 
                      style={{ width: `${shipment.progress}%` }}
                    />
                    <Truck className="absolute -top-2 h-5 w-5 text-blue-600" style={{ left: `calc(${shipment.progress}% - 10px)` }} />
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900">{shipment.destination}</p>
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-xs text-slate-500">Destination</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-4 gap-4">
                {shipment.driver !== "-" && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Driver</p>
                      <p className="text-sm font-medium text-slate-900">{shipment.driver}</p>
                    </div>
                  </div>
                )}
                {shipment.vehicle !== "-" && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Vehicle</p>
                      <p className="text-sm font-medium text-slate-900">{shipment.vehicle}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">ETA</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Progress</p>
                    <p className="text-sm font-medium text-slate-900">{shipment.progress}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
