import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { SidebarOptInForm } from "@/components/sidebar-opt-in-form"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"


const data = {
  navMain: [
    {
      title: "Raise an issue",
      url: "/dashboard/raise-issue",
      // items: [
      //   {
      //     title: "Chat group",
      //     url: "#",
      //   },
      //   {
      //     title: "Project Structure",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Chat group",
      url: "/dashboard/chat",
      // items: [
      //   {
      //     title: "Routing",
      //     url: "#",
      //   },
      //   {
      //     title: "Data Fetching",
      //     url: "#",
      //     isActive: true,
      //   },
      //   {
      //     title: "Rendering",
      //     url: "#",
      //   },
      //   {
      //     title: "Caching",
      //     url: "#",
      //   },
      //   {
      //     title: "Styling",
      //     url: "#",
      //   },
      //   {
      //     title: "Optimizing",
      //     url: "#",
      //   },
      //   {
      //     title: "Configuring",
      //     url: "#",
      //   },
      //   {
      //     title: "Testing",
      //     url: "#",
      //   },
      //   {
      //     title: "Authentication",
      //     url: "#",
      //   },
      //   {
      //     title: "Deploying",
      //     url: "#",
      //   },
      //   {
      //     title: "Upgrading",
      //     url: "#",
      //   },
      //   {
      //     title: "Examples",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Clock in/Clock out",
      url: "/dashboard/clock",

    },
    // {
    //   title: "Articles",
    //   url: "#",
    //   // items: [
    //   //   {
    //   //     title: "Accessibility",
    //   //     url: "#",
    //   //   },
    //   //   {
    //   //     title: "Fast Refresh",
    //   //     url: "#",
    //   //   },
    //   // ],
    // },
     {
      title: "Profile",
      url: "#",
  

    }, 
         {
      title: "Actions",
      url: "#",
       items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
      ],

    }, 
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Micro Manage</span>
                  {/* <span className=""></span> */}
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
