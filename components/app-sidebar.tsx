import { Home, Inbox, LogIn } from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Feedback",
        url: "feedback",
        icon: Inbox,
    }
]

const link = [{title: "SIGNIN", url: "signin", icon: LogIn}] 

export function AppSidebar() {
  return (
    <Sidebar className="py-2">
      <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>M.A.L.I</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {link.map((link) => (
          <SidebarMenuItem key={link.title}>
              <SidebarMenuButton asChild>
                  <a href={link.url}>
                    <link.icon />
                      <span>{link.title}</span>
                  </a>
              </SidebarMenuButton>
          </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
  </Sidebar>
  )
}
