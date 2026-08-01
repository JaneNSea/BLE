export const site = {
  name: 'JaneNSea',
  initials: 'JN',
  role: '独立开发者 · 产品工程师',
  location: 'China',
  status: '正在构建有真实价值的产品',
  description:
    '',
  email: '2298983695@qq.com',
  avatar: '/avatar.jpg',
  resume: '/resume.pdf',
  social: {
    github: 'https://github.com/JaneNSea',
  },
  repository: {
    slug: 'JaneNSea/BLE',
    url: 'https://github.com/JaneNSea/BLE',
    api: 'https://api.github.com/repos/JaneNSea/BLE',
  },
  capabilities: ['系统设计', '全栈开发', 'OpenHarmony开发', '产品设计', 'Agent开发','Arkts开发'],
} as const;

export const navigation = [
  { label: '首页', href: '/' },
  { label: '产品', href: '/products/' },
  { label: '项目', href: '/projects/' },
  { label: '技术笔记', href: '/notes/' },
  { label: '留言', href: '/comments/' },
  { label: '关于', href: '/about/' },
] as const;
