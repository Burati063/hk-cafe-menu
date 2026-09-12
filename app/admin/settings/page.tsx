"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Settings, Save } from "lucide-react";

interface SettingsForm {
  cafe_name: string;
  cafe_tagline: string;
  cafe_description: string;
  opening_hours: string;
  phone: string;
  address: string;
  currency: string;
  menu_url: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<SettingsForm>();

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        reset({
          cafe_name: data.cafe_name ?? "HK Cafe",
          cafe_tagline: data.cafe_tagline ?? "Authentic Hong Kong Flavours Since 1979",
          cafe_description: data.cafe_description ?? "",
          opening_hours: data.opening_hours ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
          currency: data.currency ?? "HKD",
          menu_url: data.menu_url ?? "",
        });
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: SettingsForm) => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-accent" />
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Configure your cafe information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Cafe Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cafe Information</CardTitle>
            <CardDescription>Displayed on the public menu page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cafe-name">Cafe Name</Label>
              <Input id="cafe-name" {...register("cafe_name")} placeholder="HK Cafe" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" {...register("cafe_tagline")} placeholder="Authentic Hong Kong Flavours…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                {...register("cafe_description")}
                placeholder="A short description about your cafe…"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact & Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact & Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="hours">Opening Hours</Label>
              <Textarea
                id="hours"
                rows={3}
                {...register("opening_hours")}
                placeholder={"Mon–Fri: 7:00am – 10:00pm\nSat–Sun: 8:00am – 11:00pm"}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} placeholder="+852 2345 6789" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency Code</Label>
                <Input id="currency" {...register("currency")} placeholder="HKD" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} placeholder="123 Nathan Road, Mong Kok, HK" />
            </div>
          </CardContent>
        </Card>

        {/* QR / Menu URL */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Menu URL</CardTitle>
            <CardDescription>The public URL used for QR code generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <Label htmlFor="menu-url">Public Menu URL</Label>
              <Input
                id="menu-url"
                {...register("menu_url")}
                placeholder="https://hkcafe.vercel.app/menu"
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving} className="w-full gap-2">
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Settings
        </Button>
      </form>
    </div>
  );
}
