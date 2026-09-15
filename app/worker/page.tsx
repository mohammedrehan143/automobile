"use client";

import { useState, useEffect } from "react";
import PinAuthModal, { checkWorkerAuthenticated } from "@/components/portal/PinAuthModal";
import PortalHeader from "@/components/portal/PortalHeader";
import WorkerForm from "@/components/portal/WorkerForm";

export default function WorkerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const isAuth = checkWorkerAuthenticated();
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
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* PIN Authentication Gate */}
      {!isAuthenticated && (
        <PinAuthModal
          portalName="Worker Portal"
          description="Enter your 10-digit security password to log customer vehicle jobs, services, and billing."
          onSuccess={() => setIsAuthenticated(true)}
        />
      )}

      {/* Authenticated Worker View */}
      {isAuthenticated && (
        <>
          <PortalHeader
            currentPortal="worker"
            onLogout={() => setIsAuthenticated(false)}
          />
          <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
            <WorkerForm />
          </main>
        </>
      )}
    </div>
  );
}
