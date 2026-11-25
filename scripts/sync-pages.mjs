import { copyFileSync, cpSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = resolve(projectRoot, "dist");

copyFileSync(resolve(distRoot, "app.html"), resolve(distRoot, "index.html"));

for (const directory of ["assets", "images"]) {
  const target = resolve(projectRoot, directory);
  if (existsSync(target)) rmSync(target, { recursive: true });
  cpSync(resolve(distRoot, directory), target, { recursive: true });
}

for (const file of ["index.html", "danny-zhang-resume.pdf", ".nojekyll", "CNAME"]) {
  copyFileSync(resolve(distRoot, file), resolve(projectRoot, file));
}
