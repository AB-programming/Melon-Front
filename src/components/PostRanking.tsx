'use client';

import { TrendingUp } from "lucide-react"
import { Card, CardHeader } from '@heroui/react';

export default function PostRanking() {
  const trendingTopics = [
    { rank: 1, topic: "#NextJS", posts: "12.5K" },
    { rank: 2, topic: "#React", posts: "8.9K" },
    { rank: 3, topic: "#TypeScript", posts: "6.2K" },
    { rank: 4, topic: "#TailwindCSS", posts: "4.8K" },
    { rank: 5, topic: "#WebDev", posts: "3.1K" },
    { rank: 6, topic: "#JavaScript", posts: "2.7K" },
    { rank: 7, topic: "#Frontend", posts: "2.3K" },
    { rank: 8, topic: "#UI设计", posts: "1.9K" },
    { rank: 9, topic: "#开源项目", posts: "1.5K" },
    { rank: 10, topic: "#编程学习", posts: "1.2K" },
  ]

  return (
    <div className="h-full overflow-y-auto p-4">
      <Card className="sticky top-0 bg-background">
        <CardHeader className="pb-3">
          <h3 className="flex items-center text-lg">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
            热门话题排行榜
          </h3>
        </CardHeader>
        <div className="space-y-3">
          {trendingTopics.map((item) => (
            <div
              key={item.rank}
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3">
                {/*<Badge*/}
                {/*  variant={item.rank <= 3 ? "default" : "secondary"}*/}
                {/*  className="w-6 h-6 p-0 flex items-center justify-center text-xs"*/}
                {/*>*/}
                {/*  {item.rank}*/}
                {/*</Badge>*/}
                <span className="font-medium text-sm">{item.topic}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.posts} 帖子</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
