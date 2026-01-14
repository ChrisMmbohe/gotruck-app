import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Organization Name</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="Your Company Ltd"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input
                type="tel"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                placeholder="+254 700 000 000"
              />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currency Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Primary Currency</label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md">
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="UGX">UGX - Ugandan Shilling</option>
                <option value="TZS">TZS - Tanzanian Shilling</option>
              </select>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-sm text-muted-foreground">Get SMS for critical updates</p>
              </div>
              <input type="checkbox" className="h-4 w-4" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Browser notifications</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">API Key</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="password"
                  className="flex-1 px-3 py-2 border rounded-md"
                  value="••••••••••••••••••••"
                  readOnly
                />
                <Button variant="outline">Regenerate</Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Use this API key to integrate GoTruck with your systems
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
