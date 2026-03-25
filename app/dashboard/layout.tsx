import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Toaster } from 'sonner'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'

export default async function ourDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-lg font-semibold">
            Welcome, {session?.user?.name ?? 'User'}
          </h1>

          {/* Push avatar to the right side of the header */}
          <div className="ml-auto flex items-center gap-2">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name ?? 'Avatar'}
                className="size-8 rounded-full"
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-600">
                {session?.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
            )}
          </div>
        </header>
        {children}
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  )
}
