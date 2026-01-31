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

      console.log("🔐 AuthInitializer: Starting...", { 
        hasUser: !!user, 
        hasAccessToken: !!accessToken,
        user: user?.email 
      });

      // LUÔN thử refresh token khi app load (nếu có cookie)
      try {
        if (user && !accessToken) {
          console.log("🔄 Attempting token refresh...");
          await performRefresh();
          console.log("✅ Token refresh successful");
        } else if (!user) {
          console.log("ℹ️ No persisted user, skipping refresh");
        }
      } catch (error) {
        console.error("❌ Token refresh failed:", error);
        // Nếu refresh fail, vẫn cho vào app (sẽ redirect về login)
      } finally {
        setIsInitialized(true);
        console.log("🏁 AuthInitializer: Complete");
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
