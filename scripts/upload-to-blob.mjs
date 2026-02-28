import { put } from "@vercel/blob";
import { readFileSync } from "fs";
import { resolve } from "path";
import { readFile } from "fs/promises";

// Load .env.local manually
const envPath = resolve(process.cwd(), ".env.local");
const envContent = await readFile(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
}

const filePath = resolve(
  process.cwd(),
  "public/ebook/hermetic-principles-starter-guide.pdf"
);

const file = readFileSync(filePath);

const blob = await put("hermetic-principles-starter-guide.pdf", file, {
  access: "public",
  contentType: "application/pdf",
});

console.log("\n✓ Uploaded successfully\n");
console.log("URL:", blob.url);
console.log("\nAdd this to your thank-you page as the download href.\n");
