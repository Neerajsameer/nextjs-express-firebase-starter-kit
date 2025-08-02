"use client";

import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import Loader from "@/components/ui/loader";
import FirebaseAuth from "@/lib/firebase/firebaseAuthClass";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [ready, setReady] = useState(true);
  const { getUser, organisationId } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sync token with server on mount to ensure authentication state is consistent
    const syncAuth = async () => {
      const firebaseAuth = new FirebaseAuth();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const user = firebaseAuth.getCurrentUser();
      setReady(true);
      if (user) await firebaseAuth.syncTokenWithServer();

      getUser();
    };

    syncAuth();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <div className="h-screen w-screen flex flex-row overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full flex flex-col overflow-x-hidden">
        <Header />

        {/* Page Content */}
        <div className="w-full h-full overflow-y-scroll p-4 md:p-6">
          {ready && organisationId ? children : <Loader loading align="center" />}
        </div>
      </div>
    </div>
  );
}
