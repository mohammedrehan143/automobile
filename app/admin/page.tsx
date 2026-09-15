"use client";

import { useState, useEffect } from "react";
import PinAuthModal, { checkAdminAuthenticated } from "@/components/portal/PinAuthModal";
import PortalHeader from "@/components/portal/PortalHeader";
import AdminDashboard from "@/components/portal/AdminDashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const isAuth = checkAdminAuthenticated();
    setIsAuthenticated(isAuth);
    setIsCheckingAuth(false);
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent animate-spin rounded-none" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-[#7B0818] selection:text-white font-sans w-full max-w-full overflow-x-hidden">
      {/* PIN Authentication Gate */}
      {!isAuthenticated && (
        <PinAuthModal
          portalName="Admin Portal"
          description="Enter your 10-digit security password to access vehicle analytics, customer tracking, and branch reports."
          onSuccess={() => setIsAuthenticated(true)}
        />
      )}

      {/* Authenticated Admin View */}
      {isAuthenticated && (
        <>
          <PortalHeader
            currentPortal="admin"
            onLogout={() => setIsAuthenticated(false)}
          />
          <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 w-full max-w-full min-w-0">
            <AdminDashboard />
          </main>
        </>
      )}
    </div>
  );
}
