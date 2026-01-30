"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ServiceUpdate = {
  id: string;
  client_id: string | null;
  created_at: string;
  title: string | null;
  body: string | null;
};


export default function DashboardPage() {
  const [user, setUser] = useState<string | null>(null);
  const [updates, setUpdates] = useState<ServiceUpdate[]>([])
  const [loadingUpdates, setLoadingUpdates] = useState(true)
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error.message);
        router.push("/login");
        return;
      }

      if (!data.session) {
        router.push("/login");
        return;
      }

      setUser(data.session.user.email ?? null);



      const { data: updatesData, error: updatesError } = await supabase
        .from('service_updates')
        .select()

      if (updatesError) {
        setLoadingUpdates(false)
        console.log(updatesError.message);
        return;
      } 

      setUpdates(updatesData ?? []);
      setLoadingUpdates(false);
      };

    checkSession();
  }, [router]);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-sm opacity-70">Checking session...</p>
      </main>
    );
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">Signed in as: {user}</p>
          {loadingUpdates && (
            <p>Loading updates...</p>
          )}
          {!loadingUpdates && updates.length === 0 && (
            <p>No updates yet.</p>
          )}
          {!loadingUpdates && updates.map(update => (
            <div key={update.id} className="text-sm border-b pb-2">
              <div className="font-medium">{update.title ?? "Untitled"}</div>
              <div className="opacity-80">{update.body ?? ""}</div>
            </div>
          ))}
          <Button onClick={logout} variant="outline" className="w-full">
            Log out
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
