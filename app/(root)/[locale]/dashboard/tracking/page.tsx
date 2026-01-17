"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { 
  Navigation, Truck, Clock, MapPin, Activity, Filter,
  Search, ChevronRight, Fuel, AlertCircle, CheckCircle
} from "lucide-react";

export default function TrackingPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(36.8219); // Nairobi
  const [lat] = useState(-1.2921);
  const [zoom] = useState(6);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error("Mapbox token not found");
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [lng, lat],
      zoom: zoom,
      projection: { name: 'mercator' } as any,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add sample markers for trucks with custom styling
    const trucks = [
      { 
        id: "KBZ-421", 
        name: "Truck KBZ-421", 
        coordinates: [36.8219, -1.2921],
        status: "moving",
        speed: 68,
        destination: "Kampala"
      },
      { 
        id: "UAZ-102", 
        name: "Truck UAZ-102", 
        coordinates: [32.5825, 0.3476],
        status: "idle",
        speed: 0,
        destination: "Kigali"
      },
      { 
        id: "TZA-305", 
        name: "Truck TZA-305", 
        coordinates: [39.2083, -6.7924],
        status: "moving",
        speed: 72,
        destination: "Nairobi"
      },
    ];

    trucks.forEach((truck) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='${truck.status === 'moving' ? '%2310b981' : '%23f59e0b'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2'/%3E%3Cpath d='M15 18H9'/%3E%3Ccircle cx='7' cy='18' r='2'/%3E%3Ccircle cx='17' cy='18' r='2'/%3E%3Cpath d='M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14'/%3E%3C/svg%3E")`;
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div style="padding: 8px; min-width: 180px;">
            <div style="font-weight: 600; margin-bottom: 4px; color: #1e293b;">${truck.name}</div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 2px;">Speed: ${truck.speed} km/h</div>
            <div style="font-size: 12px; color: #64748b;">To: ${truck.destination}</div>
          </div>
        `);

      new mapboxgl.Marker(el)
        .setLngLat(truck.coordinates as [number, number])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedVehicle(truck.id);
      });
    });
  }, [lng, lat, zoom]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] -z-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Live Fleet Tracking</h1>
              <p className="text-slate-300">Real-time vehicle monitoring across EAC region</p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              48 Vehicles Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search by vehicle ID, driver, or route..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="moving">Moving</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-routes">
              <SelectTrigger className="w-[180px]">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-routes">All Routes</SelectItem>
                <SelectItem value="nairobi-kampala">Nairobi → Kampala</SelectItem>
                <SelectItem value="mombasa-dar">Mombasa → Dar</SelectItem>
                <SelectItem value="kampala-kigali">Kampala → Kigali</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content: Map + Vehicle Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map */}
        <Card className="lg:col-span-2 overflow-hidden border-slate-200 shadow-xl">
          <CardContent className="p-0 relative">
            <div ref={mapContainer} className="h-[700px] w-full" />
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="font-medium text-slate-700">Moving</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-medium text-slate-700">Idle</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="font-medium text-slate-700">Alert</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle List */}
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="border-b bg-slate-50/50 pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">Active Vehicles (48)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="moving" className="w-full">
                <TabsList className="w-full grid grid-cols-3 m-2">
                  <TabsTrigger value="moving" className="text-xs">Moving</TabsTrigger>
                  <TabsTrigger value="idle" className="text-xs">Idle</TabsTrigger>
                  <TabsTrigger value="alert" className="text-xs">Alerts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="moving" className="mt-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {[
                      { id: "KBZ-421", driver: "John Kamau", location: "Nairobi", speed: 68, fuel: 78, eta: "2.5h" },
                      { id: "TZA-305", driver: "Hassan Mkwawa", location: "Dar es Salaam", speed: 72, fuel: 65, eta: "4h" },
                      { id: "RWA-189", driver: "Marie Uwase", location: "Kigali", speed: 55, fuel: 82, eta: "1.2h" },
                    ].map((vehicle) => (
                      <div 
                        key={vehicle.id}
                        className="p-4 border-b hover:bg-slate-50/80 cursor-pointer transition-colors group relative"
                        onClick={() => setSelectedVehicle(vehicle.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-500/10 rounded-lg">
                              <Truck className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{vehicle.id}</p>
                              <p className="text-xs text-slate-500">{vehicle.driver}</p>
                            </div>
                          </div>
                          <Badge variant="success" className="text-xs">
                            <Navigation className="h-3 w-3 mr-1" />
                            {vehicle.speed} km/h
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin className="h-3 w-3" />
                            {vehicle.location}
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Fuel className="h-3 w-3" />
                            {vehicle.fuel}%
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Clock className="h-3 w-3" />
                            ETA {vehicle.eta}
                          </div>
                        </div>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="idle" className="mt-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {[
                      { id: "UAZ-102", driver: "Sarah Auma", location: "Kampala Depot", duration: "45m", reason: "Rest Break" },
                      { id: "KBZ-256", driver: "Peter Odhiambo", location: "Mombasa Port", duration: "2h", reason: "Loading" },
                    ].map((vehicle) => (
                      <div 
                        key={vehicle.id}
                        className="p-4 border-b hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-amber-500/10 rounded-lg">
                              <Truck className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{vehicle.id}</p>
                              <p className="text-xs text-slate-500">{vehicle.driver}</p>
                            </div>
                          </div>
                          <Badge variant="warning" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {vehicle.duration}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">{vehicle.location}</span>
                          <span className="text-slate-500">{vehicle.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="alert" className="mt-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {[
                      { id: "UAZ-189", issue: "Low Fuel", severity: "warning", location: "Near Nakuru" },
                      { id: "TZA-421", issue: "Maintenance Due", severity: "info", location: "Arusha" },
                    ].map((vehicle) => (
                      <div 
                        key={vehicle.id}
                        className="p-4 border-b hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${vehicle.severity === 'warning' ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                              <AlertCircle className={`h-4 w-4 ${vehicle.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{vehicle.id}</p>
                              <p className="text-xs text-slate-500">{vehicle.issue}</p>
                            </div>
                          </div>
                          <Badge variant={vehicle.severity === 'warning' ? 'warning' : 'info'} className="text-xs">
                            {vehicle.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600">{vehicle.location}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
