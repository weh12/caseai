import { Card, CardContent } from "@/components/ui/card"
import { AITool } from "../../types/tools"
import Image from "next/image"
import Link from "next/link"

interface ToolGridProps {
  tools: AITool[]
}

export function ToolGrid({ tools }: ToolGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tools.map((tool) => (
        <Link key={tool.id} href="#" className="block">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Image
                  src={tool.icon}
                  alt={tool.title}
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="font-medium">{tool.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

