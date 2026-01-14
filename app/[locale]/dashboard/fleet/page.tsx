import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, AlertTriangle, CheckCircle, Wrench } from "lucide-react";

const vehicles = [
  { id: 1, name: "Truck KBZ-421", status: "active", location: "Nairobi, Kenya", driver: "John Kamau" },
  { id: 2, name: "Truck UAZ-102", status: "active", location: "Kampala, Uganda", driver: "Sarah Auma" },
  { id: 3, name: "Truck TZA-305", status: "active", location: "Dar es Salaam, TZ", driver: "Hassan Mkwawa" },
  { id: 4, name: "Truck KBZ-189", status: "maintenance", location: "Nairobi Workshop", driver: "-" },
  { id: 5, name: "Truck UAZ-234", status: "inactive", location: "Kampala Depot", driver: "-" },
];

export default function FleetPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fleet Management</h1>
          <p className="text-muted-foreground">Manage your vehicles and drivers</p>
        </div>
        <Button>Add Vehicle</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicles.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter((v) => v.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vehicles.filter((v) => v.status === "maintenance").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Vehicle</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Location</th>
                  <th className="text-left p-4 font-medium">Driver</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{vehicle.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          vehicle.status === "active"
                            ? "bg-green-100 text-green-700"
                            : vehicle.status === "maintenance"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {vehicle.status === "active" && <CheckCircle className="h-3 w-3" />}
                        {vehicle.status === "maintenance" && <Wrench className="h-3 w-3" />}
                        {vehicle.status === "inactive" && <AlertTriangle className="h-3 w-3" />}
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{vehicle.location}</td>
                    <td className="p-4 text-sm">{vehicle.driver}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
