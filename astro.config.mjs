import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.NETLIFY_URL
});
