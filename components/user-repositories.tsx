import type { GitHubRepo } from "@/components/github-profile-analyzer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, GitFork, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface UserRepositoriesProps {
  repos: GitHubRepo[]
}

export function UserRepositories({ repos }: UserRepositoriesProps) {
  if (repos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">No repositories found</CardContent>
      </Card>
    )
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {repos.map((repo) => (
          <Card key={repo.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {repo.name}
                    </a>
                  </CardTitle>
                  {repo.description && <CardDescription className="mt-1">{repo.description}</CardDescription>}
                </div>
                <Badge variant={repo.visibility === "public" ? "outline" : "secondary"}>{repo.visibility}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {repo.topics &&
                  repo.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {repo.language && (
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    <span>{repo.language}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  <span>{repo.forks_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

