export const site = {
  name: '你的名字',
  initials: 'YN',
  role: '独立开发者 · 产品工程师',
  location: 'China',
  status: '正在构建有真实价值的产品',
  description:
    '我关注软件、硬件与真实需求之间的连接，擅长把模糊问题拆解成可以验证、可以交付的系统。',
  email: 'hello@example.com',
  avatar: '/avatar-placeholder.svg',
  resume: '/resume.pdf',
  social: {
    github: 'https://github.com/your-name',
  },
  capabilities: ['系统设计', '全栈开发', '嵌入式 / IoT', '产品思维', '独立交付'],
} as const;

export const navigation = [
  { label: '产品', href: '/products/' },
  { label: '项目', href: '/projects/' },
  { label: '技术笔记', href: '/notes/' },
  { label: '关于', href: '/about/' },
] as const;
