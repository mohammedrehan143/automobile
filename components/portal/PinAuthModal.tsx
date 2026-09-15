"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { verifyPortalPinWithRole } from "@/lib/workshopStore";

interface PinAuthModalProps {
  portalName: "Admin Portal" | "Worker Portal" | "Workshop Portal" | "Workshop Portals";
  description?: string;
  onSuccess?: (role: "admin" | "worker") => void;
  targetPath?: string;
  isInline?: boolean;
}

const AUTH_STORAGE_KEY = "indian_auto_portal_auth_pin_verified";
const AUTH_ROLE_KEY = "indian_auto_portal_active_role";

export default function PinAuthModal({
  portalName,
  description = "Enter your 10-digit security password to proceed.",
  onSuccess,
  targetPath,
  isInline = false,
}: PinAuthModalProps) {
  const router = useRouter();
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleVerify = useCallback(
    async (codeToVerify: string) => {
      setIsVerifying(true);
      const auth = await verifyPortalPinWithRole(codeToVerify);

      if (auth.valid && (auth.role === "admin" || auth.role === "worker")) {
        const detectedRole: "admin" | "worker" = auth.role;

        setIsSuccess(true);
        setError(null);

        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_STORAGE_KEY, "true");
          sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
          localStorage.setItem(AUTH_ROLE_KEY, detectedRole);
          sessionStorage.setItem(AUTH_ROLE_KEY, detectedRole);
        }

        if (detectedRole === "worker") {
          setSuccessMessage("ACCESS GRANTED: OPENING WORKER TERMINAL...");
          setTimeout(() => {
            if (targetPath) {
              router.push(targetPath);
            } else if (typeof window !== "undefined" && window.location.pathname === "/worker") {
              if (onSuccess) onSuccess("worker");
            } else {
              router.push("/worker");
            }
          }, 300);
          return;
        }

        // Admin role
        if (detectedRole === "admin") {
          setSuccessMessage("ACCESS GRANTED: OPENING ADMIN DASHBOARD...");
          setTimeout(() => {
            if (targetPath) {
              router.push(targetPath);
            } else if (typeof window !== "undefined" && window.location.pathname === "/admin") {
              if (onSuccess) onSuccess("admin");
            } else {
              router.push("/admin");
            }
          }, 300);
          return;
        }
      } else {
        setIsShaking(true);
        setError("Invalid 10-digit security password. Please check and try again.");
        setTimeout(() => {
          setPin("");
          setIsShaking(false);
          setIsVerifying(false);
        }, 650);
      }
    },
    [onSuccess, targetPath, router]
  );

  const handleKeyPress = useCallback(
    (digit: string) => {
      if (pin.length < 10 && !isVerifying) {
        const nextPin = pin + digit;
        setPin(nextPin);
        setError(null);
        if (nextPin.length === 10) {
          handleVerify(nextPin);
        }
      }
    },
    [pin, isVerifying, handleVerify]
  );

  const handleDelete = useCallback(() => {
    if (!isVerifying) {
      setPin((prev) => prev.slice(0, -1));
      setError(null);
    }
  }, [isVerifying]);

  const handleClear = useCallback(() => {
    if (!isVerifying) {
      setPin("");
      setError(null);
    }
  }, [isVerifying]);

  // Keyboard and Paste listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleKeyPress(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (e.key === "Escape") {
        handleClear();
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const pasted = e.clipboardData?.getData("text")?.replace(/\D/g, "");
      if (pasted && pasted.length === 10 && !isVerifying) {
        e.preventDefault();
        setPin(pasted);
        handleVerify(pasted);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("paste", handlePaste);
    };
  }, [handleKeyPress, handleDelete, handleClear, handleVerify, isVerifying]);

  const numpadDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const containerClasses = isInline
    ? "w-full flex items-center justify-center p-2 sm:p-4 font-sans"
    : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn font-sans";

  return (
    <div className={containerClasses}>
      <div
        className={`relative w-full max-w-md bg-white border-2 border-slate-900 shadow-2xl p-6 sm:p-8 text-center transition-transform rounded-none text-slate-900 ${
          isShaking ? "animate-shake ring-2 ring-[#7B0818]" : ""
        }`}
      >
        {/* Top Navigation Row: Back Button & Gateway Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Link
            href="/"
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-bold uppercase transition-colors rounded-none flex items-center gap-1"
          >
            <span>[← BACK]</span>
          </Link>
          <div className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-300 text-slate-900 text-[10px] font-bold uppercase rounded-none tracking-wider">
            [SECURITY GATEWAY]
          </div>
        </div>

        {/* Portal Title */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wider">
          {portalName}
        </h2>
        <p className="text-xs text-slate-600 mt-1 mb-4 max-w-xs mx-auto">
          {description}
        </p>

        {/* 10-Digit Visual Boxes Indicator (Grouped 5 + 5 for perfect readability) */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-4">
          {/* First 5 digits */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {[0, 1, 2, 3, 4].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-6 h-9 sm:w-8 sm:h-11 flex items-center justify-center border-2 text-base sm:text-lg font-mono font-bold transition-all rounded-none ${
                    isSuccess
                      ? "border-emerald-700 bg-emerald-50 text-emerald-700 font-black"
                      : isFilled
                      ? "border-slate-900 bg-slate-100 text-slate-900 font-black"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {isFilled ? (
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-900 rounded-none" />
                  ) : (
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-none" />
                  )}
                </div>
              );
            })}
          </div>

          <span className="text-slate-400 font-mono font-bold px-0.5 select-none">-</span>

          {/* Second 5 digits */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {[5, 6, 7, 8, 9].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-6 h-9 sm:w-8 sm:h-11 flex items-center justify-center border-2 text-base sm:text-lg font-mono font-bold transition-all rounded-none ${
                    isSuccess
                      ? "border-emerald-700 bg-emerald-50 text-emerald-700 font-black"
                      : isFilled
                      ? "border-slate-900 bg-slate-100 text-slate-900 font-black"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                >
                  {isFilled ? (
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-900 rounded-none" />
                  ) : (
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Counter indicator */}
        <div className="text-[10px] font-mono text-slate-500 mb-3">
          {pin.length > 0 ? `${pin.length} / 10 digits entered` : "10-digit code required"}
        </div>

        {/* Error message */}
        {error && (
          <div className="text-xs text-[#7B0818] mb-3 animate-fadeIn font-bold uppercase">
            [ERROR: {error}]
          </div>
        )}

        {/* Success message */}
        {isSuccess && (
          <div className="text-xs text-emerald-700 mb-3 animate-fadeIn font-bold uppercase">
            [{successMessage || "PASSWORD VERIFIED. OPENING PORTAL..."}]
          </div>
        )}

        {/* On-Screen Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4 touch-manipulation select-none">
          {numpadDigits.map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={isVerifying}
              onClick={() => handleKeyPress(digit)}
              className="h-12 py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 active:border-slate-900 text-slate-900 text-xl font-black transition-colors rounded-none flex items-center justify-center disabled:opacity-50 cursor-pointer select-none touch-manipulation"
            >
              {digit}
            </button>
          ))}

          {/* Row 4: Clear, 0, Backspace */}
          <button
            type="button"
            disabled={isVerifying}
            onClick={handleClear}
            className="h-12 py-2.5 bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 text-slate-700 text-xs font-bold uppercase transition-colors rounded-none flex items-center justify-center disabled:opacity-50 cursor-pointer select-none touch-manipulation"
          >
            CLEAR
          </button>

          <button
            type="button"
            disabled={isVerifying}
            onClick={() => handleKeyPress("0")}
            className="h-12 py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 active:border-slate-900 text-slate-900 text-xl font-black transition-colors rounded-none flex items-center justify-center disabled:opacity-50 cursor-pointer select-none touch-manipulation"
          >
            0
          </button>

          <button
            type="button"
            disabled={isVerifying}
            onClick={handleDelete}
            className="h-12 py-2.5 bg-slate-50 hover:bg-slate-100 border-2 border-slate-300 text-slate-700 text-xs font-bold uppercase transition-colors rounded-none flex items-center justify-center disabled:opacity-50 cursor-pointer select-none touch-manipulation"
            aria-label="Backspace"
          >
            DEL
          </button>
        </div>

        {/* Back to Website Full Button */}
        <div className="mb-4">
          <Link
            href="/"
            className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 hover:border-slate-900 text-slate-800 text-xs font-bold uppercase transition-colors rounded-none flex items-center justify-center gap-1"
          >
            <span>[RETURN TO MAIN WEBSITE]</span>
          </Link>
        </div>

        {/* Security Guidance Bar */}
        <div className="pt-3 border-t-2 border-slate-200 flex flex-col items-center justify-center gap-1 text-xs text-slate-600">
          <div className="text-slate-800 font-bold uppercase text-[11px]">
            [10-DIGIT DATABASE PASSWORD REQUIRED]
          </div>
          <span className="text-[10px] text-slate-500">
            Type using on-screen keypad or keyboard • Auto-unlocks at 10 digits
          </span>
          <div className="mt-1 px-2.5 py-1 bg-slate-100 border border-slate-300 text-[10px] font-mono text-slate-700">
            Admin: 9876543210 &bull; Worker: 1234567890
          </div>
        </div>
      </div>
    </div>
  );
}

export function checkPinAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem(AUTH_STORAGE_KEY) === "true" ||
    sessionStorage.getItem(AUTH_STORAGE_KEY) === "true"
  );
}

export function checkAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const isAuth =
    localStorage.getItem(AUTH_STORAGE_KEY) === "true" ||
    sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
  const role = getActiveRole();
  return isAuth && role === "admin";
}

export function checkWorkerAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const isAuth =
    localStorage.getItem(AUTH_STORAGE_KEY) === "true" ||
    sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
  const role = getActiveRole();
  return isAuth && role === "worker";
}

export function getActiveRole(): "admin" | "worker" | null {
  if (typeof window === "undefined") return null;
  return (
    (localStorage.getItem(AUTH_ROLE_KEY) as "admin" | "worker") ||
    (sessionStorage.getItem(AUTH_ROLE_KEY) as "admin" | "worker") ||
    null
  );
}

export function logoutPin(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
  sessionStorage.removeItem(AUTH_ROLE_KEY);
}

