import type { GitHubUser } from "@/components/github-profile-analyzer"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, GitFork } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfileProps {
  user: GitHubUser
}

export function UserProfile({ user }: UserProfileProps) {
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 rounded-full">
              <AvatarImage src={user.avatar_url} alt={user.login} />
              <AvatarFallback>{user.login.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:underline flex items-center gap-1 mt-1"
              >
                <span>@{user.login}</span>
              </a>
            </div>

            {user.bio && <p className="text-muted-foreground">{user.bio}</p>}

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1 text-sm">
                <GitFork className="h-4 w-4" />
                <span>{user.public_repos} repositories</span>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <Users className="h-4 w-4" />
                <span>
                  {user.followers} followers · {user.following} following
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

