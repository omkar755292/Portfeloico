"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CreditCard,
  Ellipsis
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/store/slices/userSlice";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { toggleMobileSidebar, toggleSidebar } from "@/store/slices/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/providers";

const menuItems = [
  {
    section: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/" },
      { icon: Users, label: "Users", href: "/users" },
      { icon: MessageSquare, label: "Messages", href: "/messages" },
      { icon: CreditCard, label: "Billing", href: "/billing" },
    ],
  },
  {
    section: "Settings",
    items: [
      { icon: Settings, label: "Settings", href: "/settings" },
    ],
  },
];

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem = ({ icon: Icon, label, href, isActive, isCollapsed }: NavItemProps) => {
  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 px-6 py-3 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground",
        isCollapsed && "px-3 justify-center"
      )}
    >
      <Icon className="h-4 w-4" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

export function Sidebar() {
  const { isCollapsed, isMobileOpen } = useAppSelector((state) => state.sidebar);
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    dispatch(toggleMobileSidebar());
  }, [pathname, dispatch]);


  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => dispatch(toggleMobileSidebar())}
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Backdrop for mobile */}
      {
        isMobileOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => dispatch(toggleMobileSidebar())}
          />
        )
      }

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-background border-r transition-all duration-300",
          "z-40 flex flex-col",
          isCollapsed ? "w-16" : "w-64",
          // Mobile styles
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          {!isCollapsed ? (
            <h1 className="text-lg font-semibold px-6 py-2">Portfolio Admin</h1>
          ) : (
            <div className="h-12 flex items-center justify-center">
              <Image width={32} height={32} src="/logo.png" alt="" className="h-8 w-8" />
            </div>
          )}
          <div className="opacity-0 lg:opacity-100 absolute -right-[16px] top-[12px] z-20 bg-white dark:bg-primary-foreground lg:visible">
            <Button
              onClick={() => dispatch(toggleSidebar())}
              className="h-8 w-8 rounded-md"
              variant="outline"
              size="icon"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {menuItems.map((section, idx) => (
            <div key={idx} className="py-4">
              {!isCollapsed && (
                <div className="px-6 mb-2">
                  <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
                    {section.section}
                  </p>
                </div>
              )}
              <nav>
                {section.items.map((item) => (
                  <NavItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    isActive={pathname === item.href}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </nav>
            </div>
          ))}
        </ScrollArea>

        <div className="border-t p-4">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-9"
                    onClick={() => dispatch(logout())}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => dispatch(logout())}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
