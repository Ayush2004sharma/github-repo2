"use client"

import { useState } from "react"
import { UserRepositories } from "@/components/user-repositories"
import { CommitActivity } from "@/components/commit-activity"
import { UserProfile } from "@/components/user-profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export interface GitHubUser {
  login: string
  avatar_url: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
  created_at: string
}

export interface GitHubRepo {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  topics: string[]
  visibility: string
}

export interface CommitData {
  date: string
  count: number
}

export function GitHubProfileAnalyzer() {
  const [username, setUsername] = useState("")
  const [inputUsername, setInputUsername] = useState("")
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [commitData, setCommitData] = useState<CommitData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = async () => {
    if (!inputUsername.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Fetch user profile
      const userResponse = await fetch(`https://api.github.com/users/${inputUsername}`)

      if (!userResponse.ok) {
        throw new Error(userResponse.status === 404 ? "User not found" : "Error fetching user data")
      }

      const userData = await userResponse.json()
      setUser(userData)
      setUsername(inputUsername)

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${inputUsername}/repos?per_page=100&sort=updated`)

      if (!reposResponse.ok) {
        throw new Error("Error fetching repositories")
      }

      const reposData = await reposResponse.json()
      setRepos(reposData)

      // Fetch commit activity (last year's commit data)
      // For this demo, we'll create sample commit data
      // In a real app, you would need to fetch commit data for each repository
      // and aggregate it, which requires multiple API calls

      const today = new Date()
      const commitActivity: CommitData[] = []

      // Generate sample data for the last 30 days
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        commitActivity.push({
          date: date.toISOString().split("T")[0],
          // Random count between 0-10 for demo purposes
          count: Math.floor(Math.random() * 11),
        })
      }

      setCommitData(commitActivity)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter GitHub username"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchUserData()}
                disabled={loading}
              />
            </div>
            <Button onClick={fetchUserData} disabled={loading || !inputUsername.trim()} className="gap-2">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <Search size={16} />
                  Analyze Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {user && (
        <div className="space-y-6">
          <UserProfile user={user} />

          <Tabs defaultValue="repositories">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="repositories">Repositories ({repos.length})</TabsTrigger>
              <TabsTrigger value="activity">Commit Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="repositories" className="mt-4">
              <UserRepositories repos={repos} />
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <CommitActivity commitData={commitData} username={username} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

