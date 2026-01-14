import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Clock, CheckCircle } from "lucide-react";

const shipments = [
  {
    id: "SH-3421",
    origin: "Nairobi, Kenya",
    destination: "Kampala, Uganda",
    status: "delivered",
    cargo: "Electronics",
    vehicle: "Truck KBZ-421",
    estimatedDelivery: "2026-01-10",
  },
  {
    id: "SH-3422",
    origin: "Mombasa, Kenya",
    destination: "Dar es Salaam, Tanzania",
    status: "in-transit",
    cargo: "Textiles",
    vehicle: "Truck TZA-305",
    estimatedDelivery: "2026-01-16",
  },
  {
    id: "SH-3423",
    origin: "Kampala, Uganda",
    destination: "Kigali, Rwanda",
    status: "in-transit",
    cargo: "Food Products",
    vehicle: "Truck UAZ-102",
    estimatedDelivery: "2026-01-15",
  },
  {
    id: "SH-3424",
    origin: "Nairobi, Kenya",
    destination: "Juba, South Sudan",
    status: "pending",
    cargo: "Construction Materials",
    vehicle: "-",
    estimatedDelivery: "2026-01-20",
  },
];

export default function ShipmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shipments</h1>
          <p className="text-muted-foreground">Manage freight orders and deliveries</p>
        </div>
        <Button>Create Shipment</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {["All", "Pending", "In Transit", "Delivered"].map((status) => (
          <Card key={status}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{status}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {status === "All"
                  ? shipments.length
                  : shipments.filter(
                      (s) =>
                        s.status ===
                        status.toLowerCase().replace(" ", "-")
                    ).length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{shipment.id}</span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        shipment.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : shipment.status === "in-transit"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {shipment.status === "delivered" && <CheckCircle className="h-3 w-3 inline mr-1" />}
                      {shipment.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {shipment.origin} → {shipment.destination}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      ETA: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Cargo:</span> {shipment.cargo}
                    {" | "}
                    <span className="text-muted-foreground">Vehicle:</span> {shipment.vehicle}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
