import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Calendar, Tag, ExternalLink } from 'lucide-react'
import Fuse from 'fuse.js'

// 🍉 瓜田数据 - 每日更新
const MELONS_DATA = [
  {
    "id": "2026-02-10-1",
    "date": "2026-02-10",
    "title": "科技巨头2026年AI投资超6700亿美元，超越登月计划",
    "category": "科技",
    "source": "The Verge/WSJ",
    "content": "Meta、Microsoft、Amazon和Alphabet计划在2026年向AI基础设施投入超过6700亿美元，这一数字超过了美国历史上许多大型资本项目（按GDP占比计算），仅次于1803年路易斯安那购地案。",
    "link": "https://www.theverge.com",
    "tags": ["AI", "投资", "科技巨头", "2026"]
  },
  {
    "id": "2026-02-10-2",
    "date": "2026-02-10",
    "title": "ChatGPT免费用户将看到广告，Plus订阅成去广告唯一途径",
    "category": "AI",
    "source": "The Verge",
    "content": "OpenAI宣布ChatGPT免费用户将很快开始在对话中看到「赞助」链接，只有每月支付至少20美元的Plus订阅用户才能享受无广告体验。这一商业化举措引发用户热议。",
    "link": "https://www.theverge.com",
    "tags": ["ChatGPT", "OpenAI", "广告", "订阅"]
  },
  {
    "id": "2026-02-10-3",
    "date": "2026-02-10",
    "title": "AI.com平台超级碗广告引发关注，承诺推动AI代理主流化",
    "category": "AI",
    "source": "AI.com/The Verge",
    "content": "AI.com在超级碗投放30秒广告，展示名为「Mark」、「Sam」、「Elon」的AI代理。Crypto.com CEO Kris Marszalek表示将领导该平台，目标是「以他推动加密货币大规模消费者采用的方式，将AI代理和AGI主流化」。",
    "link": "https://ai.com",
    "tags": ["AI代理", "超级碗", "Crypto.com", "AGI"]
  },
  {
    "id": "2026-02-10-4",
    "date": "2026-02-10",
    "title": "欧盟认定Meta封禁竞品AI违反反垄断法",
    "category": "科技",
    "source": "European Commission",
    "content": "欧盟委员会裁定Meta封禁ChatGPT和Copilot等竞品AI进入WhatsApp的决定违反欧盟反垄断法。欧盟罕见快速介入，称该问题「紧急」，存在对新兴AI行业竞争造成「不可挽回」损害的风险。",
    "link": "https://ec.europa.eu",
    "tags": ["欧盟", "Meta", "反垄断", "WhatsApp"]
  },
  {
    "id": "2026-02-10-5",
    "date": "2026-02-10",
    "title": "Trump世界秩序阴影笼罩慕尼黑安全会议",
    "category": "美国政治",
    "source": "BBC News",
    "content": "欧洲领导人本周齐聚慕尼黑安全会议，欧洲安全正处于十字路口。Trump的世界秩序阴影笼罩会议，引发对美国与欧洲防务关系的担忧。",
    "link": "https://www.bbc.com/news/articles/cgrzjv1kykxo",
    "tags": ["Trump", "欧洲", "防务", "北约"]
  },
  {
    "id": "2026-02-10-6",
    "date": "2026-02-10",
    "title": "日本高市早苗联盟获得议会超级多数，经济挑战待解",
    "category": "国际新闻",
    "source": "BBC News/Reuters",
    "content": "日本首相高市早苗领导的执政联盟确保了议会超级多数席位。日本正面临经济增长乏力、公共债务攀升和劳动力快速老龄化的挑战。与此同时，泰国Anutin的政党在大选中意外获胜。",
    "link": "https://www.bbc.com/news/articles/cddn7qed35eo",
    "tags": ["日本", "选举", "高市早苗", "泰国"]
  },
  {
    "id": "2026-02-10-7",
    "date": "2026-02-10",
    "title": "BLACKPINK Jennie《Dracula》Remix创K-pop soloist Spotify纪录",
    "category": "女团",
    "source": "Allkpop",
    "content": "BLACKPINK Jennie与Tame Impala合作的《Dracula》Remix成为K-pop soloist历史上最大的Remix首秀。同时，Jennie也成为第23届韩国音乐奖提名最多的K-pop soloist。",
    "link": "https://www.allkpop.com/article/2026/02/dracula-remix-by-blackpinks-jennie-becomes-the-biggest-remix-debut-for-a-k-pop-soloist-on-spotify-history",
    "tags": ["BLACKPINK", "Jennie", "Dracula", "Spotify", "纪录"]
  },
  {
    "id": "2026-02-10-8",
    "date": "2026-02-10",
    "title": "BTS宣布免费光化门回归现场演出",
    "category": "女团",
    "source": "Allkpop",
    "content": "BTS宣布将于2月23日在首尔光化门举行免费回归现场演出，门票将于当日开放申请。这是组合近期的重大回归活动之一。",
    "link": "https://www.allkpop.com/article/2026/02/bts-announces-free-gwanghwamun-comeback-live-tickets-available-february-23",
    "tags": ["BTS", "回归", "光化门", "免费演出"]
  },
  {
    "id": "2026-02-10-9",
    "date": "2026-02-10",
    "title": "ENHYPEN Jungwon生日捐赠1亿韩元加入荣誉学会",
    "category": "女团",
    "source": "Allkpop",
    "content": "ENHYPEN成员Jungwon在生日之际向韩国慈善机构捐赠1亿韩元（约68,592美元），正式加入荣誉学会（Honor Society）。同日，Stray Kids的I.N也捐赠1亿韩元支持癌症患者。",
    "link": "https://www.allkpop.com/article/2026/02/enhypens-jungwon-celebrates-birthday-with-100-million-krw-68592-usd-donation-joining-the-honor-society",
    "tags": ["ENHYPEN", "Jungwon", "捐赠", "慈善"]
  },
  {
    "id": "2026-02-10-10",
    "date": "2026-02-10",
    "title": "冬季奥运会奖牌质量问题引调查，乌克兰运动员头盔禁令引争议",
    "category": "国际新闻",
    "source": "BBC News",
    "content": "米兰-科尔蒂纳冬奥组委会表示正在「密切关注」奖牌质量问题，此前多位运动员反映奖牌出现问题。同时，乌克兰钢架雪车选手Vladyslav Heraskevych称IOC禁止其佩戴印有战争中遇难者图像的头盔，令他「心碎」。",
    "link": "https://www.bbc.com/sport/articles/c4g5lj59rr9o",
    "tags": ["冬奥会", "奖牌", "乌克兰", "IOC"]
  },
  // 历史数据
  {
    "id": "2026-02-09-1",
    "date": "2026-02-09",
    "title": "AI导致裁员？数据显示仅7%裁员与AI相关",
    "category": "科技",
    "source": "X/GlobalMktObserv",
    "content": "人工智能被引用为1月份108,435个裁员中的7,624个裁员的原因，仅占当月所有裁员的7%。自2023年以来，AI已成为裁员公告中越来越常见的归因因素。",
    "link": "https://x.com/GlobalMktObserv/status/2020529508772700416",
    "tags": ["AI", "裁员", "就业市场"]
  },
  {
    "id": "2026-02-09-2",
    "date": "2026-02-09",
    "title": "Apple在AI领域落后了吗？",
    "category": "科技",
    "source": "X/DailyAITechNews",
    "content": "Apple以用户为中心的AI功能正在引起轰动，如AirPods的实时翻译和iPhone的视觉智能。Tim Cook强调隐私保护是Apple AI战略的核心。",
    "link": "https://x.com/DailyAITechNews/status/2020473704417792106",
    "tags": ["Apple", "AI", "Tim Cook"]
  },
  {
    "id": "2026-02-09-3",
    "date": "2026-02-09",
    "title": "Trump政府战略转向：从军事威慑到外交谈判",
    "category": "美国政治",
    "source": "X/DailyNewsEgypt",
    "content": "马斯喀特会谈的恢复标志着Trump政府'极限施压'运动的关键转折，从纯粹的军事威慑转向外交谈判。",
    "link": "https://x.com/DailyNewsEgypt/status/2020475422878617981",
    "tags": ["Trump", "外交", "中东"]
  },
  {
    "id": "2026-02-09-4",
    "date": "2026-02-09",
    "title": "Trump拒绝为涉种族主义视频道歉",
    "category": "美国政治",
    "source": "X/CNN",
    "content": "尽管共和党呼吁道歉，Trump总统拒绝为分享一个已被删除的、将奥巴马一家描绘成猿猴的种族主义视频道歉。",
    "link": "https://x.com/CNN",
    "tags": ["Trump", "CNN", "争议"]
  },
  {
    "id": "2026-02-09-5",
    "date": "2026-02-09",
    "title": "日本高市 coalition 获得议会超级多数",
    "category": "国际新闻",
    "source": "X/ReutersWorld",
    "content": "日本高市早苗领导的执政联盟确保了议会超级多数席位；泰国Anutin的政党在大选中获胜。同时，黎巴嫩建筑物倒塌造成至少6人死亡。",
    "link": "https://twitter.com/ReutersWorld",
    "tags": ["日本", "泰国", "选举"]
  },
  {
    "id": "2026-02-09-6",
    "date": "2026-02-09",
    "title": "BLACKPINK首张概念照发布，《DEADLINE》回归倒计时",
    "category": "女团",
    "source": "Korea JoongAng Daily",
    "content": "BLACKPINK发布新EP《DEADLINE》首张概念照，展现精致造型。这是组合三年五个月以来的首张专辑，定于2月27日发布。同时VOGUE KOREA确认她们正在准备世界巡演。",
    "link": "https://koreajoongangdaily.joins.com/news/2026-02-09/entertainment/kpop/Blackpink-unveils-refined-look-in-first-portraits-for-new-EP-Deadline/2519147",
    "tags": ["BLACKPINK", "DEADLINE", "回归", "K-pop"]
  },
  {
    "id": "2026-02-08-1",
    "date": "2026-02-08",
    "title": "BLACKPINK新专辑《DEADLINE》定档",
    "category": "女团",
    "source": "Korea Herald",
    "content": "BLACKPINK第3张迷你专辑《DEADLINE》定档2026年2月27日下午2点（KST）发布！这是组合三年多来的首张团体专辑。",
    "link": "https://www.koreaherald.com/article/10672006",
    "tags": ["BLACKPINK", "K-pop", "新专辑"]
  },
  {
    "id": "2026-02-08-2",
    "date": "2026-02-08",
    "title": "Jennie与Tame Impala合作《Dracula》Remix",
    "category": "女团",
    "source": "Hypebeast",
    "content": "Jennie与Tame Impala合作推出《Dracula》Remix版本，引发BTS粉丝和BLINKs的Spotify榜单友好交流。",
    "link": "https://hypebeast.com/2026/2/tame-impala-dracule-jennie-blackpink-remix-single-stream",
    "tags": ["Jennie", "Tame Impala", "合作"]
  },
  {
    "id": "2026-02-08-3",
    "date": "2026-02-08",
    "title": "Trump承诺资助纽约隧道项目",
    "category": "美国政治",
    "source": "X/Twitter",
    "content": "Trump被曝承诺资助纽约隧道项目，条件是重命名宾州车站和杜勒斯机场。",
    "link": "https://x.com/polidemitolog",
    "tags": ["Trump", "美国", "基建"]
  },
  {
    "id": "2026-02-08-4",
    "date": "2026-02-08",
    "title": "印美贸易协定取得进展",
    "category": "国际新闻",
    "source": "X/Twitter",
    "content": "莫迪总理与Trump通话后，印度和美国正就贸易协定框架进行磋商。",
    "link": "https://x.com/SinghPramod2784",
    "tags": ["印度", "美国", "贸易"]
  },
  {
    "id": "2026-02-08-5",
    "date": "2026-02-08",
    "title": "AI从炒作到商业落地研讨会",
    "category": "科技",
    "source": "PrashantAdvait Foundation",
    "content": "讨论如何将AI技术转化为实用、可扩展的商业应用。",
    "link": "https://x.com/Prashant_Advait",
    "tags": ["AI", "科技", "商业"]
  }
]

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

const categories = ['全部', 'AI', '科技', '女团', '美国政治', '国际新闻']

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

export default function MelonHub() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')

  const fuse = useMemo(() => {
    return new Fuse(MELONS_DATA, {
      keys: ['title', 'content', 'tags', 'category'],
      threshold: 0.4,
    })
  }, [])

  const filteredData = useMemo(() => {
    let result = MELONS_DATA

    if (selectedCategory !== '全部') {
      result = result.filter((item) => item.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery)
      result = fuseResults.map((r) => r.item)
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [selectedCategory, searchQuery, fuse])

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
                <span className="text-sm font-medium">{formatDate(date)}</span>
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
          <p className="text-sm text-gray-500">每日自动更新 · 数据来源 X/微博/新闻</p>
          <p className="text-xs text-gray-400 mt-1">Made with 🍉 by 阳仔</p>
        </div>
      </div>
    </div>
  )
}