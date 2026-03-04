import { auth } from '@clerk/nextjs/server'
import { getUserLinks } from '@/data/links'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CreateLinkDialog } from './CreateLinkDialog'
import { EditLinkDialog } from './EditLinkDialog'
import { DeleteLinkDialog } from './DeleteLinkDialog'

export default async function DashboardPage() {
  const { userId } = await auth()
  const userLinks = await getUserLinks(userId!)

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Links</h1>
        <CreateLinkDialog />
      </div>
      {userLinks.length === 0 ? (
        <p className="text-muted-foreground">No links yet. Create your first shortened link!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userLinks.map((link) => (
            <Card key={link.id} className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle className="font-mono text-base">{link.shortCode}</CardTitle>
                <CardDescription className="truncate">{link.url}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(link.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-1 pt-0">
                <EditLinkDialog
                  linkId={link.id}
                  currentUrl={link.url}
                  currentShortCode={link.shortCode}
                />
                <DeleteLinkDialog linkId={link.id} shortCode={link.shortCode} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
