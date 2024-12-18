import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { getFaviconUrl } from '@/utils/getFavicon';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data/userTools.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const tools = JSON.parse(fileContent);
    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Error reading tools:', error);
    return NextResponse.json({ tools: [] });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = path.join(process.cwd(), 'data/userTools.json');
    
    let tools = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      tools = JSON.parse(fileContent);
    } catch {}

    const newTool = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      url: data.url,
      icon: getFaviconUrl(data.url),
      category: data.category,
      addedAt: new Date().toISOString()
    };
    
    tools.push(newTool);
    await fs.writeFile(filePath, JSON.stringify(tools, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, tool: newTool });
  } catch (error) {
    console.error('Error saving tool:', error);
    return NextResponse.json({ success: false, error: '保存失败' });
  }
}