import React, { useEffect, useState, useRef } from "react";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import { useAppSelector } from "../hooks/useRedux";
import { Loader2 } from "lucide-react";

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * AuthInitializer component
 * - Handles initial authentication check on app load
 * - If user exists in persisted storage but no accessToken, attempts refresh
 * - Shows loading spinner during initialization
 */
const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const { user, accessToken, isLoading } = useAppSelector((state) => state.auth);
  const { performRefresh } = useTokenRefresh();
  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initialize = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      console.log("AuthInitializer: Starting...", { 
        hasUser: !!user, 
        hasAccessToken: !!accessToken,
      });

      try {
        if (user && !accessToken) {
          await performRefresh();
        }
      } catch {
        // If refresh fails, allow app to load (will redirect to login via ProtectedRoute)
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, [user, accessToken, performRefresh]);

  // Show loading during initialization
  if (!isInitialized || (user && !accessToken && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-[#9a4c73] text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
