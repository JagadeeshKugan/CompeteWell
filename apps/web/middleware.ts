import { NextResponse, NextRequest } from "next/server";

// Define route categories
const PUBLIC_PATHS = ["/login", "/register", "/verify-email", "/forgot-password", "/reset-password"];
const PROTECTED_PREFIXES = ["/dashboard", "/businesses", "/reports", "/competitors", "/settings", "/onboarding"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  // Skip Next.js assets, public files, and Next.js internal API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isPublicAuthPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path)) || pathname === "/";

  // Helper to delete cookies and redirect to login
  const clearAuthAndRedirectToLogin = () => {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/" && pathname !== "/login") {
      loginUrl.searchParams.set("callbackUrl", request.url);
    }
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  };

  // Helper to handle refresh token rotation and cookie update
  const tryTokenRefresh = async (): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    refreshExpiresIn?: number;
    user?: { onboarding_completed: boolean } | null;
  }> => {
    if (!refreshToken) return { success: false };

    try {
      const refreshRes = await fetch(`${apiUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Refresh-Token": refreshToken,
        },
      });

      if (!refreshRes.ok) return { success: false };

      const refreshData = await refreshRes.json();
      return {
        success: true,
        accessToken: refreshData.access_token,
        refreshToken: refreshData.refresh_token,
        expiresIn: refreshData.expires_in,
        refreshExpiresIn: refreshData.refresh_token_expires_in,
        user: refreshData.user,
      };
    } catch {
      return { success: false };
    }
  };

  // 1. Process Protected Paths
  if (isProtectedPath) {
    let activeToken = accessToken;
    let currentUser = null;

    if (activeToken) {
      // Validate access token by fetching profile
      try {
        const userRes = await fetch(`${apiUrl}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${activeToken}`,
          },
        });

        if (userRes.ok) {
          currentUser = await userRes.json();
        }
      } catch {
        // Connection error or timeout - proceed to check refresh token
      }
    }

    // Access token expired/invalid, try rotating with refresh token
    if (!currentUser && refreshToken) {
      const refreshResult = await tryTokenRefresh();
      if (refreshResult.success && refreshResult.accessToken) {
        activeToken = refreshResult.accessToken;
        currentUser = refreshResult.user;

        // Create a redirect to the same URL to apply new cookies
        const nextResponse = NextResponse.redirect(request.url);
        
        nextResponse.cookies.set("access_token", refreshResult.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: refreshResult.expiresIn,
        });

        nextResponse.cookies.set("refresh_token", refreshResult.refreshToken!, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: refreshResult.refreshExpiresIn,
        });

        // Enforce onboarding check on the rotated user redirect
        const onboardingCompleted = currentUser?.onboarding_completed;
        if (!onboardingCompleted && pathname !== "/onboarding") {
          const onboardUrl = new URL("/onboarding", request.url);
          const onboardResponse = NextResponse.redirect(onboardUrl);
          // Copy cookies to onboard redirect response
          onboardResponse.cookies.set("access_token", refreshResult.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: refreshResult.expiresIn,
          });
          onboardResponse.cookies.set("refresh_token", refreshResult.refreshToken!, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: refreshResult.refreshExpiresIn,
          });
          return onboardResponse;
        }

        return nextResponse;
      }
    }

    // User is fully unauthenticated
    if (!currentUser) {
      return clearAuthAndRedirectToLogin();
    }

    // User authenticated: verify onboarding completion
    const onboardingCompleted = currentUser.onboarding_completed;

    if (!onboardingCompleted && pathname !== "/onboarding") {
      // Redirect to onboarding page
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (onboardingCompleted && pathname === "/onboarding") {
      // Redirect to dashboard page
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Proceed to next page
    return NextResponse.next();
  }

  // 2. Process Public Auth/Landing Paths
  if (isPublicAuthPath) {
    const activeToken = accessToken;
    let currentUser = null;

    if (activeToken) {
      try {
        const userRes = await fetch(`${apiUrl}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${activeToken}`,
          },
        });
        if (userRes.ok) {
          currentUser = await userRes.json();
        }
      } catch {}
    }

    if (!currentUser && refreshToken) {
      const refreshResult = await tryTokenRefresh();
      if (refreshResult.success && refreshResult.accessToken) {
        currentUser = refreshResult.user;

        // Cookies need to be set on the redirect response
        const targetPath = currentUser?.onboarding_completed ? "/dashboard" : "/onboarding";
        const redirectResponse = NextResponse.redirect(new URL(targetPath, request.url));

        redirectResponse.cookies.set("access_token", refreshResult.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: refreshResult.expiresIn,
        });

        redirectResponse.cookies.set("refresh_token", refreshResult.refreshToken!, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: refreshResult.refreshExpiresIn,
        });

        return redirectResponse;
      }
    }

    // If authenticated, redirect away from public auth pages
    if (currentUser) {
      const targetPath = currentUser.onboarding_completed ? "/dashboard" : "/onboarding";
      return NextResponse.redirect(new URL(targetPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all matching routes except files and assets
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\..*).*)",
  ],
};
