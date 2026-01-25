/**
 * Profile Settings Page
 * Comprehensive user profile management with completion tracking
 */

import { Suspense } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Loader2, User, Shield, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileForm from '@/components/settings/ProfileForm';
import { ProfileCompletionTracker } from '@/components/settings/ProfileCompletionTracker';
import { connectToDatabase } from '@/lib/db/mongodb';
import { UserRepository } from '@/lib/db/models/User';

async function getProfile() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const db = await connectToDatabase();
  const userRepo = new UserRepository(db.db);

  const profile = await userRepo.getByClerkId(userId);

  if (!profile) {
    // Create default profile if doesn't exist
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      redirect('/sign-in');
    }

    return await userRepo.create({
      clerkId: userId,
      email,
      role: 'shipper', // Default role
    } as any);
  }

  return profile;
}

export default async function ProfileSettingsPage() {
  const profile = await getProfile();

  return (
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and account preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Completion Tracker Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ProfileCompletionTracker completion={profile.completion} />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                }
              >
                <ProfileForm profile={profile} />
              </Suspense>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <div className="rounded-lg border border-dashed p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Document Management</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload and manage your verification documents
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Coming soon: License, registration, insurance, and other documents
                </p>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="rounded-lg border border-dashed p-12 text-center">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Security Settings</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Manage your password, 2FA, and security preferences
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Security settings are managed through Clerk authentication
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
