"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import OnBoarding from "./onboarding/page";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // wait until auth state is resolved
    if (loading) return;

    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.replace("/admin");
      }else if(user.role === "driver") {
        router.replace("/driver");
      } 
      else {
        router.replace("/user/dashboard");
      }
    }
    
  }, [isAuthenticated, user, loading, router]);

  // While checking auth → render nothing (or spinner)
  if (loading) return null;

  // Not logged in → show onboarding
 if (!loading && !isAuthenticated) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <OnBoarding />
    </div>
  );
}
  // Logged in but redirecting
  return null;
}
