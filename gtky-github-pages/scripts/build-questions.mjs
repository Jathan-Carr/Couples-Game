import { writeFileSync, mkdirSync } from "node:fs";
import { SURFACE } from "./questions/surface.mjs";
import { PERSONAL } from "./questions/personal.mjs";
import { DEEP } from "./questions/deep.mjs";
import { TOGETHER } from "./questions/together.mjs";
import { compile } from "./compile.mjs";

const outDir = new URL("../public/data/", import.meta.url);
mkdirSync(outDir, { recursive: true });

const surface = compile("surface", SURFACE);
const personal = compile("personal", PERSONAL);
const deep = compile("deep", DEEP);
const together = compile("together", TOGETHER);

writeFileSync(new URL("surface.json", outDir), JSON.stringify(surface, null, 2));
writeFileSync(new URL("personal.json", outDir), JSON.stringify(personal, null, 2));
writeFileSync(new URL("deep.json", outDir), JSON.stringify(deep, null, 2));
writeFileSync(new URL("together.json", outDir), JSON.stringify(together, null, 2));
writeFileSync(new URL("questions.json", outDir), JSON.stringify([...surface, ...personal, ...deep, ...together]));

console.log({
  surface: surface.length,
  personal: personal.length,
  deep: deep.length,
  together: together.length,
  total: surface.length + personal.length + deep.length + together.length,
});
