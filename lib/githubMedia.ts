import path from "node:path";
import { createOrUpdateFile, deleteFile } from "./github";
import { slugify } from "./adminContent";

export async function saveUploadToGithub(file: File) {
    const extension = path.extname(file.name).toLowerCase();
    const base = slugify(path.basename(file.name, extension)) || "image";
    const name = `${base}-${Date.now()}${extension}`;
    
    // convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Content = buffer.toString("base64");
    
    await createOrUpdateFile(
        `public/uploads/${name}`,
        base64Content,
        `Upload media: ${name}`,
        true
    );

    return `/uploads/${name}`;
}

export async function deleteUploadFromGithub(publicPath: string) {
    const name = path.basename(publicPath);
    await deleteFile(`public/uploads/${name}`, `Delete media: ${name}`);
}
