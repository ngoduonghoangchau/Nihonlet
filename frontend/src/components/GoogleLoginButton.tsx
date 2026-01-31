import React from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();
  const { googleLogin, isLoading } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        navigate("/dashboard");
      }
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-2.5 px-4 border border-[#e5d5dd] rounded-lg bg-gray-50">
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
};

export default GoogleLoginButton;
