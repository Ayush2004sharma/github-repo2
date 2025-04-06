"use client"

import type { CommitData } from "@/components/github-profile-analyzer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface CommitActivityProps {
  commitData: CommitData[]
  username: string
}

export function CommitActivity({ commitData, username }: CommitActivityProps) {
  // Format dates for display
  const formattedData = commitData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count: item.count,
    fullDate: item.date,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit Activity</CardTitle>
        <CardDescription>Daily commit activity for {username} over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 60,
              }}
            >
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
              <YAxis
                allowDecimals={false}
                label={{ value: "Commits", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border border-border p-2 rounded-md shadow-md">
                        <p className="font-medium">{data.fullDate}</p>
                        <p className="text-primary">{data.count} commits</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

