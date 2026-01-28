"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem("demo_user");
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
  }, [router]);

  function logout() {
    localStorage.removeItem("demo_user");
    router.push("/login");
  }

  if (!user) return null;

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">Signed in as: {user}</p>
          <Button onClick={logout} variant="outline" className="w-full">
            Log out
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
