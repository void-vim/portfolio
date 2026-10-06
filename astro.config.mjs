// @ts-check
import { defineConfig } from "astro/config";

import lenis from "astro-lenis";
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: "https://jaenudin.vercel.app",
  integrations: [lenis(), icon()],
});
