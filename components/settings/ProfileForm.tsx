/**
 * Profile Form Component
 * Comprehensive user profile editor with role-based fields and form validation.
 * Note: Schemas are included inline to ensure self-containment.
 */

'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Check, Camera, Mail, Phone, User, Truck, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { JoinedDate } from "@/components/settings/JoinedDate";

// --- Role-specific blocks ---

function DriverProfileBlock({ register, errors, watch, setValue }: {
  register: any;
  errors: any;
  watch: any;
  setValue: any;
}) {
  return (
    <div className="rounded-lg border bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Truck className="h-6 w-6 text-blue-600" />
        <span className="font-semibold text-blue-700 text-lg">Driver Details</span>
      </div>
      <div className="space-y-2">
        <Label>Vehicle Type</Label>
        <Select 
          defaultValue={watch('vehicleType')}
          onValueChange={(val) => setValue('vehicleType', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MOTORBIKE">Motorbike / Boda Boda</SelectItem>
            <SelectItem value="VAN">Delivery Van</SelectItem>
            <SelectItem value="TRUCK_SMALL">Small Truck (3-ton)</SelectItem>
            <SelectItem value="TRUCK_LARGE">Large Truck (10-ton+)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-blue-500 mt-1">Choose the vehicle you operate for deliveries.</p>
      </div>
      <div className="space-y-2 mt-4">
        <Label htmlFor="licensePlate">License Plate</Label>
        <Input id="licensePlate" placeholder="KAA 001A" {...register('licensePlate')} />
        {errors.licensePlate && typeof errors.licensePlate === 'object' && 'message' in errors.licensePlate && (
          <p className="text-xs text-destructive">{(errors.licensePlate as any).message}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">Enter your official vehicle registration number.</p>
      </div>
      <div className="mt-4 p-2 bg-blue-50 rounded text-xs text-blue-700 flex items-center gap-2">
        <Truck className="h-4 w-4" />
        <span>Tip: Keep your vehicle details up to date for faster shipment assignments.</span>
      </div>
    </div>
  );
}


function ShipperProfileBlock({ register, errors }: {
  register: any;
  errors: any;
}) {
  return (
    <div className="rounded-lg border bg-gradient-to-br from-green-50 via-white to-green-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Building className="h-6 w-6 text-green-600" />
        <span className="font-semibold text-green-700 text-lg">Shipper Details</span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name <span className="text-xs text-muted-foreground">(Optional)</span></Label>
        <div className="relative">
          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="companyName" className="pl-10" {...register('companyName')} />
        </div>
        {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
        <p className="text-xs text-green-500 mt-1">Provide your company name for business shipments and invoicing.</p>
      </div>
      <div className="mt-4 p-2 bg-green-50 rounded text-xs text-green-700 flex items-center gap-2">
        <Building className="h-4 w-4" />
        <span>Tip: Verified company info helps build trust with carriers and partners.</span>
      </div>
    </div>
  );
}


function AdminProfileBlock() {
  return (
    <div className="rounded-lg border bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <User className="h-6 w-6 text-gray-600" />
        <span className="font-semibold text-gray-700 text-lg">Admin Details</span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">No additional admin fields required.</p>
      </div>
      <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-700 flex items-center gap-2">
        <User className="h-4 w-4" />
        <span>Tip: Admins manage platform settings and user permissions.</span>
      </div>
    </div>
  );
}

// --- Inline Schemas to resolve import errors ---

const baseProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  currency: z.string(),
  timezone: z.string(),
});

const shipperProfileSchema = baseProfileSchema.extend({
  currency: z.string(),
  timezone: z.string(),
  companyName: z.string().optional(),
});

const driverProfileSchema = baseProfileSchema.extend({
  currency: z.string(),
  timezone: z.string(),
  vehicleType: z.enum(['MOTORBIKE', 'VAN', 'TRUCK_SMALL', 'TRUCK_LARGE']),
  licensePlate: z.string().min(4, 'License plate is required'),
});

const adminProfileSchema = baseProfileSchema.extend({
  currency: z.string(),
  timezone: z.string(),
});

type ShipperProfileFormData = z.infer<typeof shipperProfileSchema>;
type DriverProfileFormData = z.infer<typeof driverProfileSchema>;
type AdminProfileFormData = z.infer<typeof adminProfileSchema>;

type ProfileFormData = ShipperProfileFormData | DriverProfileFormData | AdminProfileFormData;

// --- Interfaces ---

export type UserRole = 'ADMIN' | 'SHIPPER' | 'DRIVER';

export interface UserProfile {
  id: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  preferences?: {
    currency?: string;
    timezone?: string;
  };
  driverData?: {
    vehicleType?: 'MOTORBIKE' | 'VAN' | 'TRUCK_SMALL' | 'TRUCK_LARGE';
    licensePlate?: string;
  };
  shipperData?: {
    companyName?: string;
  };
}

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate?: (data: ProfileFormData) => Promise<void>;
}

// --- Role-specific form components ---

function DriverProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(profile.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const form = useForm<DriverProfileFormData>({
    resolver: zodResolver(driverProfileSchema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      currency: profile.preferences?.currency || 'KES',
      timezone: profile.preferences?.timezone || 'Africa/Nairobi',
      vehicleType: profile.driverData?.vehicleType || 'VAN',
      licensePlate: profile.driverData?.licensePlate || '',
    },
  });
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (data: DriverProfileFormData) => {
    setIsSubmitting(true);
    try {
      if (onUpdate) {
        await onUpdate(data);
      }
      toast({ title: "Profile updated", description: "Your changes have been saved successfully." });
    } catch (error) {
      toast({ title: "Update failed", description: "There was an error saving your profile. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8 p-4 bg-gradient-to-br from-blue-100 via-white to-blue-50 rounded-2xl border-2 border-blue-200 shadow-xl">
      {/* Role Header */}
      <div className="flex items-center gap-4 mb-4">
        <Truck className="h-8 w-8 text-blue-700" />
        <h2 className="text-2xl font-bold text-blue-800 tracking-tight">Driver Profile</h2>
        <span className="ml-auto px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold uppercase">DRIVER</span>
      </div>
      <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded flex items-center gap-2">
        <Truck className="h-5 w-5 text-blue-500" />
        <span className="text-blue-700 text-sm">Manage your vehicle and contact details for optimal delivery assignments.</span>
      </div>
      {/* Header & Avatar */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-xl border shadow-sm">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-blue-200 shadow-lg">
            <AvatarImage src={previewImage || ''} />
            <AvatarFallback className="text-4xl bg-blue-100 text-blue-700">{profile.firstName?.[0]}{profile.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
            <Camera className="h-5 w-5" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-2xl font-bold text-blue-900">{profile.firstName} {profile.lastName}</h1>
          <p className="text-blue-700 flex items-center justify-center md:justify-start gap-2">
            <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded text-xs font-bold uppercase tracking-wider">{profile.role}</span>
            • {profile.email}
          </p>
        </div>
      </div>
      {/* ...existing card structure... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700"><User className="h-5 w-5 text-blue-600" />Basic Information</CardTitle>
            <CardDescription className="text-blue-500">Manage your public personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                <Input id="email" className="pl-10" {...register('email')} disabled />
              </div>
              <p className="text-[10px] text-blue-400">Email changes require support verification.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                <Input id="phone" className="pl-10" placeholder="+254..." {...register('phone')} />
              </div>
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          </CardContent>
        </Card>
        {/* Vehicle Details */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700"><Truck className="h-5 w-5 text-blue-600" />Vehicle Details</CardTitle>
            <CardDescription className="text-blue-500">Information related to your driver status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DriverProfileBlock register={register} errors={errors} watch={watch} setValue={setValue} />
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">Status: Active</p>
              <p className="text-xs text-blue-500">Joined <JoinedDate date={profile.createdAt} /></p>
            </div>
          </CardContent>
        </Card>
        {/* Preferences */}
        <Card className="md:col-span-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700"><MapPin className="h-5 w-5 text-blue-600" />Regional Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Preferred Currency</Label>
              <Select value={watch('currency')} onValueChange={(v) => setValue('currency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                  <SelectItem value="UGX">UGX (Ugandan Shilling)</SelectItem>
                  <SelectItem value="TZS">TZS (Tanzanian Shilling)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={watch('timezone')} onValueChange={(v) => setValue('timezone', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Nairobi">EAT (Nairobi, UTC+3)</SelectItem>
                  <SelectItem value="Africa/Kampala">EAT (Kampala, UTC+3)</SelectItem>
                  <SelectItem value="Africa/Dar_es_Salaam">EAT (Dar es Salaam, UTC+3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Action Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-blue-200">
        <Button variant="ghost" type="button" onClick={() => window.history.back()} className="text-blue-700">Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px] bg-blue-700 hover:bg-blue-800 text-white">
          {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : (<><Check className="mr-2 h-4 w-4" />Save Changes</>)}
        </Button>
      </div>
    </form>
  );
}


function ShipperProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(profile.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const form = useForm<ShipperProfileFormData>({
    resolver: zodResolver(shipperProfileSchema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      currency: profile.preferences?.currency || 'KES',
      timezone: profile.preferences?.timezone || 'Africa/Nairobi',
      companyName: profile.shipperData?.companyName || '',
    },
  });
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (data: ShipperProfileFormData) => {
    setIsSubmitting(true);
    try {
      if (onUpdate) {
        await onUpdate(data);
      }
      toast({ title: "Profile updated", description: "Your changes have been saved successfully." });
    } catch (error) {
      toast({ title: "Update failed", description: "There was an error saving your profile. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8 p-4 bg-gradient-to-br from-green-100 via-white to-green-50 rounded-2xl border-2 border-green-200 shadow-xl">
      {/* Role Header */}
      <div className="flex items-center gap-4 mb-4">
        <Building className="h-8 w-8 text-green-700" />
        <h2 className="text-2xl font-bold text-green-800 tracking-tight">Shipper Profile</h2>
        <span className="ml-auto px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold uppercase">SHIPPER</span>
      </div>
      <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-400 rounded flex items-center gap-2">
        <Building className="h-5 w-5 text-green-500" />
        <span className="text-green-700 text-sm">Provide your business details for seamless shipment management and invoicing.</span>
      </div>
      {/* Header & Avatar */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-xl border shadow-sm">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-green-200 shadow-lg">
            <AvatarImage src={previewImage || ''} />
            <AvatarFallback className="text-4xl bg-green-100 text-green-700">{profile.firstName?.[0]}{profile.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
            <Camera className="h-5 w-5" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-2xl font-bold text-green-900">{profile.firstName} {profile.lastName}</h1>
          <p className="text-green-700 flex items-center justify-center md:justify-start gap-2">
            <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs font-bold uppercase tracking-wider">{profile.role}</span>
            • {profile.email}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700"><User className="h-5 w-5 text-green-600" />Basic Information</CardTitle>
            <CardDescription className="text-green-500">Manage your public personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-green-400" />
                <Input id="email" className="pl-10" {...register('email')} disabled />
              </div>
              <p className="text-[10px] text-green-400">Email changes require support verification.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-green-400" />
                <Input id="phone" className="pl-10" placeholder="+254..." {...register('phone')} />
              </div>
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          </CardContent>
        </Card>
        {/* Business Details */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700"><Building className="h-5 w-5 text-green-600" />Business Details</CardTitle>
            <CardDescription className="text-green-500">Information related to your shipper status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ShipperProfileBlock register={register} errors={errors} />
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">Status: Active</p>
              <p className="text-xs text-green-500">Joined <JoinedDate date={profile.createdAt} /></p>
            </div>
          </CardContent>
        </Card>
        {/* Preferences */}
        <Card className="md:col-span-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700"><MapPin className="h-5 w-5 text-green-600" />Regional Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Preferred Currency</Label>
              <Select value={watch('currency')} onValueChange={(v) => setValue('currency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                  <SelectItem value="UGX">UGX (Ugandan Shilling)</SelectItem>
                  <SelectItem value="TZS">TZS (Tanzanian Shilling)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={watch('timezone')} onValueChange={(v) => setValue('timezone', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Nairobi">EAT (Nairobi, UTC+3)</SelectItem>
                  <SelectItem value="Africa/Kampala">EAT (Kampala, UTC+3)</SelectItem>
                  <SelectItem value="Africa/Dar_es_Salaam">EAT (Dar es Salaam, UTC+3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Action Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-green-200">
        <Button variant="ghost" type="button" onClick={() => window.history.back()} className="text-green-700">Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px] bg-green-700 hover:bg-green-800 text-white">
          {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : (<><Check className="mr-2 h-4 w-4" />Save Changes</>)}
        </Button>
      </div>
    </form>
  );
}


function AdminProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(profile.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const form = useForm<AdminProfileFormData>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      currency: profile.preferences?.currency || 'KES',
      timezone: profile.preferences?.timezone || 'Africa/Nairobi',
    },
  });
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (data: AdminProfileFormData) => {
    setIsSubmitting(true);
    try {
      if (onUpdate) {
        await onUpdate(data);
      }
      toast({ title: "Profile updated", description: "Your changes have been saved successfully." });
    } catch (error) {
      toast({ title: "Update failed", description: "There was an error saving your profile. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-8 p-4 bg-gradient-to-br from-gray-100 via-white to-gray-50 rounded-2xl border-2 border-gray-200 shadow-xl">
      {/* Role Header */}
      <div className="flex items-center gap-4 mb-4">
        <User className="h-8 w-8 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Profile</h2>
        <span className="ml-auto px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-semibold uppercase">ADMIN</span>
      </div>
      <div className="mb-4 p-3 bg-gray-50 border-l-4 border-gray-400 rounded flex items-center gap-2">
        <User className="h-5 w-5 text-gray-500" />
        <span className="text-gray-700 text-sm">Admins manage platform settings, users, and permissions.</span>
      </div>
      {/* Header & Avatar */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-xl border shadow-sm">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-gray-200 shadow-lg">
            <AvatarImage src={previewImage || ''} />
            <AvatarFallback className="text-4xl bg-gray-100 text-gray-700">{profile.firstName?.[0]}{profile.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-gray-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
            <Camera className="h-5 w-5" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h1>
          <p className="text-gray-700 flex items-center justify-center md:justify-start gap-2">
            <span className="px-2 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-bold uppercase tracking-wider">{profile.role}</span>
            • {profile.email}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700"><User className="h-5 w-5 text-gray-600" />Basic Information</CardTitle>
            <CardDescription className="text-gray-500">Manage your public personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register('firstName')} />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register('lastName')} />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" className="pl-10" {...register('email')} disabled />
              </div>
              <p className="text-[10px] text-gray-400">Email changes require support verification.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="phone" className="pl-10" placeholder="+254..." {...register('phone')} />
              </div>
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          </CardContent>
        </Card>
        {/* Admin Details */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700"><Building className="h-5 w-5 text-gray-600" />Admin Details</CardTitle>
            <CardDescription className="text-gray-500">Information related to your admin status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AdminProfileBlock />
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-800">Status: Active</p>
              <p className="text-xs text-gray-500">Joined <JoinedDate date={profile.createdAt} /></p>
            </div>
          </CardContent>
        </Card>
        {/* Preferences */}
        <Card className="md:col-span-2 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700"><MapPin className="h-5 w-5 text-gray-600" />Regional Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Preferred Currency</Label>
              <Select value={watch('currency')} onValueChange={(v) => setValue('currency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                  <SelectItem value="UGX">UGX (Ugandan Shilling)</SelectItem>
                  <SelectItem value="TZS">TZS (Tanzanian Shilling)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={watch('timezone')} onValueChange={(v) => setValue('timezone', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Nairobi">EAT (Nairobi, UTC+3)</SelectItem>
                  <SelectItem value="Africa/Kampala">EAT (Kampala, UTC+3)</SelectItem>
                  <SelectItem value="Africa/Dar_es_Salaam">EAT (Dar es Salaam, UTC+3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Action Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button variant="ghost" type="button" onClick={() => window.history.back()} className="text-gray-700">Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px] bg-gray-700 hover:bg-gray-800 text-white">
          {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : (<><Check className="mr-2 h-4 w-4" />Save Changes</>)}
        </Button>
      </div>
    </form>
  );
}

export default function App({ profile, onUpdate }: ProfileFormProps) {
  // Normalize role to uppercase for compatibility with form logic
  const normalizedRole = profile.role?.toUpperCase?.();
  if (normalizedRole === 'DRIVER') {
    return <DriverProfileForm profile={profile} onUpdate={onUpdate} />;
  }
  if (normalizedRole === 'SHIPPER') {
    return <ShipperProfileForm profile={profile} onUpdate={onUpdate} />;
  }
  return <AdminProfileForm profile={profile} onUpdate={onUpdate} />;
}
