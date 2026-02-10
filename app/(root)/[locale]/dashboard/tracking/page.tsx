"use client";

import { DashboardPage } from "@/components/auth/DashboardPage";
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
import { SAMPLE_TRUCKS } from "@/lib/sample-data/trucks";
import { FREIGHT_CORRIDORS } from "@/lib/sample-data/routes";
import { generateGPSUpdate } from "@/lib/sample-data/gps-simulator";
import { useGPSSimulation } from "@/hooks/use-gps-simulation";

export default function TrackingPage() {
  return (
    <DashboardPage
      requiredPermission="VIEW_TRACKING"
      title="Live Tracking"
      description="Real-time vehicle monitoring across EAC"
    >
      <TrackingContent />
    </DashboardPage>
  );
}

function TrackingContent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [lng] = useState(36.8219); // Nairobi
  const [lat] = useState(-1.2921);
  const [zoom] = useState(6);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const { truckLocations } = useGPSSimulation({ updateInterval: 3000, enabled: true });
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [routeFilter, setRouteFilter] = useState('all-routes');

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

    // Draw corridors on the map
    map.current.on('load', () => {
      FREIGHT_CORRIDORS.forEach((corridor) => {
        const coordinates = corridor.waypoints.map(wp => [wp.longitude, wp.latitude]);
        
        // Add corridor source and route line
        const sourceId = `corridor-${corridor.id}`;
        const layerId = `corridor-layer-${corridor.id}`;

        if (!map.current!.getSource(sourceId)) {
          map.current!.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: coordinates,
              },
              properties: {},
            },
          });

          map.current!.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': '#3b82f6',
              'line-width': 2,
              'line-opacity': 0.4,
            },
          });
        }
      });
    });

    // Add markers for sample trucks with custom styling
    SAMPLE_TRUCKS.forEach((truck) => {
      const location = truckLocations.get(truck.id);
      const latitude = location?.latitude ?? truck.lastLatitude;
      const longitude = location?.longitude ?? truck.lastLongitude;
      const isMoving = truck.status === 'in_transit';
      
      const el = document.createElement('div');
      el.className = `custom-marker truck-marker-${truck.id}`;
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='${isMoving ? '%2310b981' : '%23f59e0b'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2'/%3E%3Cpath d='M15 18H9'/%3E%3Ccircle cx='7' cy='18' r='2'/%3E%3Ccircle cx='17' cy='18' r='2'/%3E%3Cpath d='M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14'/%3E%3C/svg%3E")`;
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';

      // Generate a realistic speed for visualization
      const speed = location?.speed ?? (isMoving ? 60 + Math.random() * 20 : 0);

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`
          <div style="padding: 10px; min-width: 220px; font-family: system-ui;">
            <div style="font-weight: 700; margin-bottom: 8px; color: #1e293b; font-size: 13px;">${truck.plateNumber}</div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 3px;">Driver: <span style="font-weight: 500;">${truck.assignedDriver?.name || 'Unassigned'}</span></div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 3px;">Speed: <span style="font-weight: 500;">${Math.round(speed)} km/h</span></div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 3px;">Status: <span style="font-weight: 500; text-transform: capitalize;">${truck.status.replace('_', ' ')}</span></div>
            <div style="font-size: 12px; color: #64748b;">Route: <span style="font-weight: 500;">${location?.nextWaypoint || truck.destination || 'N/A'}</span></div>
          </div>
        `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude] as [number, number])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.set(truck.id, marker);

      el.addEventListener('click', () => {
        setSelectedVehicle(truck.plateNumber);
      });
    });
  }, [lng, lat, zoom]);

  // Update marker positions based on GPS simulation
  useEffect(() => {
    if (!map.current) return;

    truckLocations.forEach((location) => {
      const marker = markersRef.current.get(location.truckId);
      if (marker) {
        // Update marker position with smooth animation
        marker.setLngLat([location.longitude, location.latitude]);
      }
    });
  }, [truckLocations]);

  // Filter trucks based on search and filter criteria
  const getFilteredTrucks = (status?: string) => {
    let filtered = SAMPLE_TRUCKS.filter(truck => {
      // Status filter
      if (statusFilter !== 'all' && truck.status !== statusFilter) {
        return false;
      }

      // Route filter - map old route format to corridor IDs
      if (routeFilter !== 'all-routes') {
        const routeMap: Record<string, string> = {
          'nairobi-kampala': 'nairobi-kampala',
          'mombasa-dar': 'mombasa-dar',
          'kampala-kigali': 'kampala-kigali',
        };
        const filteredCorridor = routeMap[routeFilter];
        if (truck.currentRoute !== filteredCorridor) {
          return false;
        }
      }

      // Search filter - match plate number, driver name, or route
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          truck.plateNumber.toLowerCase().includes(query) ||
          truck.assignedDriver?.name.toLowerCase().includes(query) ||
          truck.currentRoute?.toLowerCase().includes(query) ||
          truck.destination?.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // Further filter by specific status if provided
    if (status && status !== 'all') {
      filtered = filtered.filter(t => {
        if (status === 'moving') return t.status === 'in_transit';
        if (status === 'idle') return t.status === 'available' || t.status === 'inactive';
        if (status === 'alert') return t.status === 'maintenance';
        return true;
      });
    }

    return filtered;
  };

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
              {SAMPLE_TRUCKS.length} Vehicles Available
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_transit">Moving</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={routeFilter} onValueChange={setRouteFilter}>
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
              <CardTitle className="text-sm font-bold text-slate-900">
                Active Vehicles ({getFilteredTrucks('moving').length})
              </CardTitle>
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
                    {getFilteredTrucks('moving').length > 0 ? (
                      getFilteredTrucks('moving').map((truck) => {
                        const location = truckLocations.get(truck.id);
                        const speed = location?.speed ?? (60 + Math.random() * 20);
                        const fuel = 50 + Math.random() * 50;
                        const distance = location ? 150 + Math.random() * 350 : 200;
                        const eta = (distance / speed).toFixed(1);
                        return (
                          <div 
                            key={truck.id}
                            className="p-4 border-b hover:bg-slate-50/80 cursor-pointer transition-colors group relative"
                            onClick={() => setSelectedVehicle(truck.plateNumber)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-green-500/10 rounded-lg">
                                  <Truck className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 text-sm">{truck.plateNumber}</p>
                                  <p className="text-xs text-slate-500">{truck.assignedDriver?.name || 'Unassigned'}</p>
                                </div>
                              </div>
                              <Badge variant="success" className="text-xs">
                                <Navigation className="h-3 w-3 mr-1" />
                                {Math.round(speed)} km/h
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="flex items-center gap-1 text-slate-600">
                                <MapPin className="h-3 w-3" />
                                {location?.nextWaypoint || truck.destination || 'Route'}
                              </div>
                              <div className="flex items-center gap-1 text-slate-600">
                                <Fuel className="h-3 w-3" />
                                {Math.round(fuel)}%
                              </div>
                              <div className="flex items-center gap-1 text-slate-600">
                                <Clock className="h-3 w-3" />
                                ETA {eta}h
                              </div>
                            </div>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-500">
                        <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No vehicles moving</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="idle" className="mt-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {getFilteredTrucks('idle').length > 0 ? (
                      getFilteredTrucks('idle').map((truck) => {
                        const duration = `${Math.floor(Math.random() * 4) + 1}h`;
                        const reasons = ['Rest Break', 'Loading', 'Unloading', 'Fuel Stop', 'Inspection'];
                        const reason = reasons[Math.floor(Math.random() * reasons.length)];
                        return (
                          <div 
                            key={truck.id}
                            className="p-4 border-b hover:bg-slate-50/80 cursor-pointer transition-colors"
                            onClick={() => setSelectedVehicle(truck.plateNumber)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                  <Truck className="h-4 w-4 text-amber-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 text-sm">{truck.plateNumber}</p>
                                  <p className="text-xs text-slate-500">{truck.assignedDriver?.name || 'Unassigned'}</p>
                                </div>
                              </div>
                              <Badge variant="warning" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {duration}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600">{truck.destination || 'Depot'}</span>
                              <span className="text-slate-500">{reason}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-500">
                        <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No idle vehicles</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="alert" className="mt-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {getFilteredTrucks('alert').length > 0 ? (
                      getFilteredTrucks('alert').map((truck) => {
                        const issues = [
                          { title: 'Maintenance Due', severity: 'warning' },
                          { title: 'Low Fuel', severity: 'warning' },
                          { title: 'Engine Check', severity: 'info' },
                          { title: 'Tire Replacement', severity: 'warning' },
                        ];
                        const issue = issues[Math.floor(Math.random() * issues.length)];
                        return (
                          <div 
                            key={truck.id}
                            className="p-4 border-b hover:bg-slate-50/80 cursor-pointer transition-colors"
                            onClick={() => setSelectedVehicle(truck.plateNumber)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${issue.severity === 'warning' ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                                  <AlertCircle className={`h-4 w-4 ${issue.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'}`} />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 text-sm">{truck.plateNumber}</p>
                                  <p className="text-xs text-slate-500">{issue.title}</p>
                                </div>
                              </div>
                              <Badge variant={issue.severity === 'warning' ? 'warning' : 'info'} className="text-xs">
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-600">{truck.destination || 'Service Center'}</p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No alerts at this time</p>
                      </div>
                    )}
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
