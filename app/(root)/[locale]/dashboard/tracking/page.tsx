"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function TrackingPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(36.8219); // Nairobi
  const [lat] = useState(-1.2921);
  const [zoom] = useState(6);

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
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    // Add sample markers for trucks
    const trucks = [
      { id: 1, name: "Truck KBZ-421", coordinates: [36.8219, -1.2921] },
      { id: 2, name: "Truck UAZ-102", coordinates: [32.5825, 0.3476] }, // Kampala
      { id: 3, name: "Truck TZA-305", coordinates: [39.2083, -6.7924] }, // Dar es Salaam
    ];

    trucks.forEach((truck) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(truck.name);

      new mapboxgl.Marker({ color: "#000" })
        .setLngLat(truck.coordinates as [number, number])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [lng, lat, zoom]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Live GPS Tracking</h1>
        <p className="text-muted-foreground">Monitor your fleet in real-time across EAC</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div ref={mapContainer} className="h-[600px] rounded-lg" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Active Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Truck KBZ-421</p>
                    <p className="text-xs text-muted-foreground">Nairobi, Kenya</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Truck UAZ-102</p>
                    <p className="text-xs text-muted-foreground">Kampala, Uganda</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Truck TZA-305</p>
                    <p className="text-xs text-muted-foreground">Dar es Salaam, TZ</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5" />
                  <div>
                    <p className="font-medium">Speed Alert</p>
                    <p className="text-xs text-muted-foreground">Truck KBZ-421 • 10m ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5" />
                  <div>
                    <p className="font-medium">Border Crossing</p>
                    <p className="text-xs text-muted-foreground">Truck UAZ-102 • 1h ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
