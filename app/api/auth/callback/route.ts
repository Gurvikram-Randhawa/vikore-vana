import { NextRequest, NextResponse } from "next/server";

/**
 * Decap CMS OAuth proxy — Step 2: Handle the GitHub callback.
 *
 * After the user authorizes on GitHub, GitHub redirects back here with a
 * `code` query parameter. We exchange that code for an access token, then
 * return an HTML page that posts the token back to the Decap CMS parent
 * window via `postMessage`.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return new NextResponse("Missing authorization code.", { status: 400 });
  }

  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse("OAuth environment variables are not configured.", {
      status: 500,
    });
  }

  // Exchange the authorization code for an access token
  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    }
  );

  const tokenData = await tokenResponse.json();

  // Build the message that Decap CMS expects from the OAuth popup
  const content = tokenData.access_token
    ? {
        token: tokenData.access_token,
        provider: "github",
      }
    : {
        error: tokenData.error_description || "Failed to retrieve access token.",
      };

  const messageType = tokenData.access_token
    ? "success"
    : "error";

  // Return an HTML page that sends the token to the parent window (Decap CMS)
  // via postMessage, then closes the popup.
  const html = `<!DOCTYPE html>
<html>
<head><title>Authorizing...</title></head>
<body>
  <script>
    (function() {
      function sendMessage(message) {
        var target = window.opener || window.parent || window;
        var origin = target === window ? window.location.origin : '*';
        target.postMessage(
          'authorization:github:' + message.type + ':' + JSON.stringify(message.content),
          origin
        );
      }

      var messageType = '${messageType}';
      var content = ${JSON.stringify(content)};

      sendMessage({
        type: messageType,
        content: content
      });

      if (messageType === 'error') {
        document.body.innerHTML = '<p>Authentication Error: ' + (content.error || 'Unknown error') + '</p><p>Please close this window and try again.</p>';
      } else {
        setTimeout(function() { window.close(); }, 1000);
      }
    })();
  </script>
  <p>Authorizing with GitHub... This window will close automatically.</p>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
