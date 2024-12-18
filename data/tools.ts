export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface AITool {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  category: string;
}

export const categories: Category[] = [
  { id: 'ai-apps', label: 'AI应用集', icon: '📱' },
  { id: 'ai-writing', label: 'AI写作工具', icon: '✍️' },
  { id: 'ai-image', label: 'AI图像工具', icon: '🎨' },
  { id: 'ai-video', label: 'AI视频工具', icon: '🎥' },
  { id: 'ai-office', label: 'AI办公工具', icon: '💼' },
  { id: 'ai-design', label: 'AI设计工具', icon: '🎯' },
  { id: 'ai-chat', label: 'AI对话聊天', icon: '💬' },
  { id: 'ai-coding', label: 'AI编程工具', icon: '💻' },
]


export const tools: AITool[] = [
  // {
  //   id: '1',
  //   title: '悠船',
  //   description: 'Midjourney官方推出的中文版...',
  //   url: '/placeholder.svg',
  //   icon: '/placeholder.svg',
  //   category: 'ai-image'
  // },
]


