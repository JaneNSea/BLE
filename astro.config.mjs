import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://JaneNSea.github.io',
  base: '/BLE',
  output: 'static',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
  //发布到项目型 GitHub Pages 仓库时，在这里增加：
  
});
