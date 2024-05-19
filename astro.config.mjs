import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import auth from "auth-astro";
import netlify from "@astrojs/netlify";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), auth(), react()],
  output: 'server',
  adapter: netlify()
});