export const site = {
  name: 'JaneNSea',
  initials: 'JN',
  role: '独立开发者 · 产品工程师',
  location: 'China',
  status: '正在构建安全、开放、有真实价值的产品',
  description:
    '我不只关心技术能否实现，更在意产品能否创造真实价值、系统是否安全可信、能力能否沉淀为可扩展的平台。面向国产基础软件与信创生态，我持续探索新领域，也在实践 AI 时代更高效、更可验证的软件开发范式。',
  email: '2298983695@qq.com',
  avatar: '/avatar.jpg',
  resume: '/resume.pdf',
  social: {
    github: 'https://github.com/JaneNSea',
    gitcode: 'https://gitcode.com/JaneNSea',
  },
  repository: {
    slug: 'JaneNSea/BLE',
    url: 'https://github.com/JaneNSea/BLE',
    api: 'https://api.github.com/repos/JaneNSea/BLE',
  },
  capabilities: ['系统设计', '全栈开发', '平台架构', '安全设计', 'OpenHarmony 开发', 'Agent 开发', '鸿蒙开发'],
} as const;

export const navigation = [
  { label: '首页', href: '/' },
  { label: '产品', href: '/products/' },
  { label: '项目', href: '/projects/' },
  { label: '技术笔记', href: '/notes/' },
  { label: '留言', href: '/comments/' },
  { label: '关于', href: '/about/' },
] as const;
