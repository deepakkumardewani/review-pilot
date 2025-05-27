import { useState, useEffect } from "react";
import { account } from "@/lib/appwrite";
import { Models, OAuthProvider } from "appwrite";
import { useRouter } from "next/navigation";

interface UseAppwriteReturn {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  oauthLogin: (provider: string) => Promise<void>;
}

/**
 * Hook to handle Appwrite authentication
 */
export const useAppwrite = (): UseAppwriteReturn => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // Check if user is logged in on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentUser = await account.get();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
        throw err;
        // User is not logged in, don't show error
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login with OAuth provider (Google, GitHub)
  const oauthLogin = async (provider: string) => {
    try {
      setLoading(true);
      setError(null);

      const providerEnum =
        provider === "google" ? OAuthProvider.Google : OAuthProvider.Github;

      // Redirect to OAuth callback page instead of directly to create page
      const successUrl = `${window.location.origin}/auth/callback`;
      const failureUrl = `${window.location.origin}`;

      // Create OAuth2 session for the provider
      account.createOAuth2Session(
        providerEnum,
        successUrl, // Callback page that will handle document creation
        failureUrl // Failure URL
      );

      // Note: Code after this point will NOT execute due to the redirect
    } catch (err) {
      setError((err as string) || `Failed to log in with ${provider}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      reset();

      // Delete current session
      await account.deleteSession("current");

      router.push("/");
    } catch (err) {
      setError((err as string) || "Failed to log out");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    localStorage.removeItem("is_authenticated");
    localStorage.removeItem("persist:portfolio");
    setUser(null);
    setLoading(true);
    setError(null);
  };
  return {
    user,
    loading,
    error,
    logout,
    oauthLogin,
  };
};
