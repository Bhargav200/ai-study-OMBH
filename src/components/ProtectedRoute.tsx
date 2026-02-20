import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DEV_BYPASS = true; // Set to false to enforce auth

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    if (DEV_BYPASS) {
      setOnboardingChecked(true);
      setOnboardingCompleted(true);
      return;
    }

    if (!user) {
      setOnboardingChecked(true);
      return;
    }

    const checkOnboarding = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .single();

      setOnboardingCompleted(data?.onboarding_completed ?? false);
      setOnboardingChecked(true);
    };

    checkOnboarding();
  }, [user]);

  if (!DEV_BYPASS && (loading || !onboardingChecked)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!DEV_BYPASS && !user) {
    return <Navigate to="/login" replace />;
  }

  const isOnboardingRoute = location.pathname.startsWith("/onboarding");
  if (!DEV_BYPASS && !onboardingCompleted && !isOnboardingRoute) {
    return <Navigate to="/onboarding/profile" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
