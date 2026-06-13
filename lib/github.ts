const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const TOKEN = process.env.GITHUB_TOKEN!;

export async function githubRequest(
    endpoint: string,
    options: RequestInit = {}
) {
    const response = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}${endpoint}`,
        {
            ...options,
            headers: {
                Authorization: `token ${TOKEN}`,
                Accept: "application/vnd.github+json",
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
    }

    return response.json();
}

export async function getFile(path: string) {
    return githubRequest(`/contents/${path}`);
}
export async function createOrUpdateFile(
    filePath: string,
    content: string,
    message: string,
    isBase64: boolean = false
) {
    let sha: string | undefined;

    try {
        const existing = await githubRequest(`/contents/${filePath}`);
        sha = existing.sha;
    } catch {
        // file does not exist yet
    }

    const body = {
        message,
        content: isBase64 ? content : Buffer.from(content).toString("base64"),
        ...(sha ? { sha } : {})
    };

    return githubRequest(`/contents/${filePath}`, {
        method: "PUT",
        body: JSON.stringify(body)
    });
}

export async function deleteFile(filePath: string, message: string) {
    let sha: string | undefined;

    try {
        const existing = await githubRequest(`/contents/${filePath}`);
        sha = existing.sha;
    } catch {
        // file does not exist, nothing to delete
        return;
    }

    if (!sha) return;

    const body = {
        message,
        sha
    };

    return githubRequest(`/contents/${filePath}`, {
        method: "DELETE",
        body: JSON.stringify(body)
    });
}