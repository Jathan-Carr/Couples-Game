import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const zipName = "gtky-github-pages.zip";
const zipPath = resolve(root, zipName);
const publicZip = resolve(root, "public", zipName);

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

rmSync(zipPath, { force: true });
rmSync(publicZip, { force: true });
run("npm", ["run", "build"]);
rmSync(resolve(root, "docs", zipName), { force: true });

run("zip", [
  "-r",
  zipPath,
  "README.md",
  "LICENSE",
  "package.json",
  "package-lock.json",
  "index.html",
  "vite.config.js",
  ".gitignore",
  ".github",
  "public",
  "src",
  "scripts",
  "docs",
  "-x",
  "*.zip",
  "-x",
  "public/*.zip",
]);

mkdirSync(resolve(root, "public"), { recursive: true });
cpSync(zipPath, publicZip);
cpSync(zipPath, resolve(root, "docs", zipName));
if (!existsSync(publicZip)) process.exit(1);
console.log(`Wrote ${zipName} (also copied to public/ and docs/ for download).`);
