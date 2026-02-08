import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Calendar, Tag, ExternalLink } from 'lucide-react'
import Fuse from 'fuse.js'
import { format } from 'date-fns'

interface Melon {
  id: string
  date: string
  title: string
  category: string
  source: string
  content: string
  link: string
  tags: string[]
}

interface MelonHubProps {
  data: Melon[]
}

const categories = ['全部', '女团', '美国政治', '国际新闻', '科技']

export default function MelonHub({ data }: MelonHubProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')

  const fuse = useMemo(() => {
    return new Fuse(data, {
      keys: ['title', 'content', 'tags', 'category'],
      threshold: 0.4,
    })
  }, [data])

  const filteredData = useMemo(() => {
    let result = data

    if (selectedCategory !== '全部') {
      result = result.filter((item) => item.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery)
      result = fuseResults.map((r) => r.item)
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [data, selectedCategory, searchQuery, fuse])

  const groupedByDate = useMemo(() => {
    const groups: Record<string, Melon[]> = {}
    filteredData.forEach((item) => {
      if (!groups[item.date]) {
        groups[item.date] = []
      }
      groups[item.date].push(item)
    })
    return groups
  }, [filteredData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            🍉 吃瓜 hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            每日瓜田 · 自动更新 · 随时吃
          </p>
        </div>

        {/* Search & Filter */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="搜索瓜..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="flex-wrap h-auto gap-1 bg-white/50 backdrop-blur">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Results */}
        <div className="space-y-8">
          {Object.entries(groupedByDate).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-4 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {format(new Date(date), 'yyyy年MM月dd日')}
                </span>
                <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                  {items.length} 个瓜
                </Badge>
              </div>

              <div className="grid gap-4">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur border-0"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                              {item.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{item.source}</span>
                          </div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="shrink-0"
                        >
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                        {item.content}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-3 w-3 text-gray-400" />
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-pink-50"
                            onClick={() => setSearchQuery(tag)}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">🤷 没找到这个瓜</p>
            <p className="text-sm mt-2">换个关键词试试？</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500">
            每日自动更新 · 数据来源 X/微博/新闻
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Made with 🍉 by 阳仔
          </p>
        </div>
      </div>
    </div>
  )
}