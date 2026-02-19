import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
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

  if (loading || !onboardingChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If onboarding not completed and not already on an onboarding page, redirect
  const isOnboardingRoute = location.pathname.startsWith("/onboarding");
  if (!onboardingCompleted && !isOnboardingRoute) {
    return <Navigate to="/onboarding/profile" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
