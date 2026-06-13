import { NextResponse } from "next/server";

/**
 * Decap CMS OAuth proxy — Step 1: Redirect to GitHub authorization.
 *
 * When Decap CMS initiates login, it opens a popup to this endpoint.
 * We redirect the popup to GitHub's OAuth authorization page with the
 * correct client_id and redirect_uri (our callback endpoint).
 */
export async function GET() {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "OAUTH_GITHUB_CLIENT_ID is not configured." },
      { status: 500 }
    );
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || "https://vikore-vana.vercel.app"}/api/auth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "repo,user",
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
}
