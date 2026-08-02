import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';

function wrapMarkdownTables() {
  return (tree) => {
    const wrapChildren = (node) => {
      if (!Array.isArray(node.children)) return;

      node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-scroll'] },
            children: [child],
          };
        }

        wrapChildren(child);
        return child;
      });
    };

    wrapChildren(tree);
  };
}

export default defineConfig({
  site: 'https://JaneNSea.github.io',
  base: '/BLE',
  output: 'static',
  integrations: [mdx()],
  markdown: {
    processor: unified({ rehypePlugins: [wrapMarkdownTables] }),
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
  //发布到项目型 GitHub Pages 仓库时，在这里增加：
  
});
