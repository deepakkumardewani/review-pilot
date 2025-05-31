"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { useAppwrite } from "@/hooks/useAppwrite";
import { useStore } from "@/store";
import { account } from "@/lib/appwrite";
import logger from "@/lib/logger";

export default function OAuthCallbackPage() {
  const { user } = useAppwrite();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setUsername = useStore((state) => state.setUsername);
  // const documentCreationAttempted = useRef(false);

  const fetchGitHubUsername = async (): Promise<string> => {
    try {
      const session = await account.getSession("current");
      const accessToken = session.providerAccessToken;

      if (!accessToken) {
        throw new Error("No GitHub access token found in session");
      }

      const response = await fetch("https://api.github.com/user", {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const userData = await response.json();
      return userData.login;
    } catch (err) {
      logger.error("Error fetching GitHub username:", err);
      throw err;
    }
  };

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exit if no user yet
        if (!user) {
          logger.info("OAuth Callback: No user object yet, waiting...");
          return;
        }

        logger.info(`OAuth Callback: User found: ${user.$id}`);

        // Check session storage if we've handled this user before
        const alreadyHandled = localStorage.getItem(
          `oauth_handled_${user.$id}`
        );
        if (alreadyHandled) {
          logger.info(
            "OAuth callback already handled for this session, redirecting to dashboard page"
          );
          localStorage.setItem(`is_authenticated_${user.$id}`, "true");
          const username = localStorage.getItem(`github_username_${user.$id}`);
          if (!username) {
            const githubUsername = await fetchGitHubUsername();
            setUsername(githubUsername);
            localStorage.setItem(`github_username_${user.$id}`, githubUsername);
          }
          router.push("/dashboard");
          return;
        }

        // Mark that we've attempted document creation
        // documentCreationAttempted.current = true;

        logger.info(`OAuth callback - Creating document for user: ${user.$id}`);

        // Fetch GitHub username and set in store
        try {
          const githubUsername = await fetchGitHubUsername();
          setUsername(githubUsername);
          localStorage.setItem(`github_username_${user.$id}`, githubUsername);
          logger.info(`GitHub username fetched and set: ${githubUsername}`);
        } catch (err) {
          logger.error("Failed to fetch GitHub username:", err);
          // Continue with flow even if username fetch fails
        }

        // Store in local storage that we've handled this user
        localStorage.setItem(`oauth_handled_${user.$id}`, "true");
        localStorage.setItem(`is_authenticated_${user.$id}`, "true");
        logger.info(`OAuth Callback: LocalStorage flags set for ${user.$id}`);

        // Redirect to create page
        logger.info(`OAuth Callback: Redirecting ${user.$id} to /dashboard`);

        router.push("/dashboard");
      } catch (err: any) {
        logger.error("Error in OAuth callback:", err);
        setError(err.message || "An error occurred during authentication");
        setIsLoading(false);
      }
    };

    if (user) {
      handleCallback();
    } else {
      logger.info("OAuth Callback: No user object yet, waiting...");
    }
  }, [user, router]);

  if (error) {
    logger.error(`OAuth Callback: Redirecting to / due to error: ${error}`);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !error) {
    return <LoadingScreen />;
  }

  return null;
}
