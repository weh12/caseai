'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Plus } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { categories, tools as defaultTools, AITool } from "../../data/tools"
// import { getFaviconUrl } from "@/utils/getFavicon"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all-tools')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allTools, setAllTools] = useState<AITool[]>([])
  const [hoveredTool, setHoveredTool] = useState<AITool | null>(null)
  const [searchResults, setSearchResults] = useState<AITool[]>([])
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  // 加载用户添加的工具和默认工具
  useEffect(() => {
    const loadUserTools = async () => {
      try {
        const response = await fetch('/api/tools')
        if (!response.ok) throw new Error('Failed to load tools')
        const data = await response.json()
        setAllTools([...defaultTools, ...data.tools])
        setSearchResults([...defaultTools, ...data.tools]) // 初始化搜索结果
      } catch (error) {
        console.error('Error loading user tools:', error)
      }
    }
    
    loadUserTools()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.get('title'),
          url: formData.get('url'),
          description: formData.get('description'),
          category: formData.get('category'),
        }),
      })

      if (response.ok) {
        setSuccessMessage('添加成功！')
        setIsOpen(false)
        window.location.reload()
      } else {
        throw new Error('保存失败')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('添加失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    const results = allTools.filter(tool => tool.title.toLowerCase().includes(query))
    setSearchResults(results)
  }

  const handleAddWebsiteClick = () => {
    const adminCode = prompt('请输入管理员代码？');
    if (adminCode === '18907469946') {
      setIsOpen(true); // 正常弹出添加网站的对话框
    } else {
      alert('你不是管理员'); // 弹出错误提示
      setIsOpen(false);
      location.reload(); //刷新网页
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 border-r bg-white p-4 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-4">
          <Link href="#" className="flex items-center space-x-2">
            <Image src="/AI.png" alt="Logo" width={32} height={32} />
            <span className="font-bold">AI工具集</span>
          </Link>
          
          {/* Add Website Button */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="w-full flex items-center justify-center p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full" onClick={handleAddWebsiteClick}>
                <Plus className="w-5 h-5" />
                <span className="ml-2">添加网站</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加新网站</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label>网站名称</label>
                  <input 
                    name="title" 
                    type="text" 
                    className="w-full p-2 border rounded" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label>网址</label>
                  <input 
                    name="url" 
                    type="url" 
                    placeholder="https://"
                    className="w-full p-2 border rounded" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label>网站描述</label>
                  <input 
                    name="description" 
                    type="text" 
                    className="w-full p-2 border rounded" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label>分类</label>
                  <select 
                    name="category" 
                    className="w-full p-2 border rounded" 
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? '添加中...' : '确认添加'}
                </button>
              </form>
            </DialogContent>
          </Dialog>

          {/* 显示全部工具按钮 */}
          <button
            onClick={() => setActiveCategory('all-tools')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 w-full text-left ${
              activeCategory === 'all-tools' ? 'bg-gray-100' : ''
            }`}
          >
            <span>⚓   全部工具</span>
          </button>
          
          <nav className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 w-full text-left ${
                  activeCategory === category.id ? 'bg-gray-100' : ''
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search Section */}
        <div className="sticky top-0 bg-white z-10 shadow p-1">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <Image 
                src="/AI1.png" 
                alt="AI Tools Logo" 
                width={70} 
                height={30} 
                className="mx-auto mb-6"
              />
              <div className="relative">
                <Input
                  placeholder="站内AI工具搜索"
                  className="pl-10 h-12 rounded-full"
                  onChange={handleSearch}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {["站内", "Bing", "百度", "Google", "Perplexity"].map((engine) => (
                  <Button key={engine} variant="ghost" size="sm">
                    {engine}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="common" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="common">常用</TabsTrigger>
            <TabsTrigger value="search">搜索</TabsTrigger>
            <TabsTrigger value="community">社区</TabsTrigger>
            <TabsTrigger value="images">图片</TabsTrigger>
            <TabsTrigger value="life">生活</TabsTrigger>
          </TabsList>

          <TabsContent value="common" className="mt-6">
            {/* Featured Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                {
                  title: "每日AI快讯",
                  image: "/daily-ai-news.png?height=200&width=400",
                  description: "最新AI资讯动态"
                },
                {
                  title: "AI最新项目",
                  image: "/chuangke.png?height=200&width=400",
                  description: "4小时快速入门AI大模型"
                },
                {
                  title: "AI交流群",
                  image: "/ai-bot-wechat-community.png?height=200&width=400",
                  description: "限时开放，免费进"
                }
              ].map((card) => (
                <Card key={card.title} className="overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={400}
                    height={200}
                    className="w-full object-cover"
                  />
                </Card>
              ))}
            </div>

            {/* 显示所有工具或根据分类显示工具 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {(activeCategory === 'all-tools' ? searchResults : searchResults.filter(tool => tool.category === activeCategory))
                .map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow relative"
                    onMouseEnter={() => setHoveredTool(tool)}
                    onMouseLeave={() => setHoveredTool(null)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={tool.icon}
                        alt={tool.title}
                        className="w-10 h-10 rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg'
                        }}
                      />
                      <div>
                        <h3 className="font-medium">{tool.title}</h3>
                        <p className="text-sm text-gray-500">
                          {tool.description.length > 34 ? `${tool.description.slice(0, 34)}...` : tool.description}
                        </p>
                      </div>
                    </div>
                    {hoveredTool === tool && (
                      <div className="absolute left-0 bottom-full mb-2 w-48 bg-black text-white p-2 rounded">
                        {tool.description}
                      </div>
                    )}
                  </a>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* 成功提示对话框 */}
      {successMessage && (
        <Dialog open={true} onOpenChange={() => setSuccessMessage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{successMessage}</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {/* Floating Add Button */}
      <div className="fixed bottom-4 right-4 lg:hidden">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
              <Plus className="w-5 h-5" />
            </button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  )
}

