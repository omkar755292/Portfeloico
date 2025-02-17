"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Settings,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  MessageSquare,
  CreditCard,
  Ellipsis,
  Home,
  ExternalLink,
  Landmark
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { toggleMobileSidebar, toggleSidebar } from "@/store/slices/sidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/providers";

const menuItems = [
  {
    section: "Main",
    items: [
      { icon: Home, label: "Home", href: "/" },
      { icon: LayoutDashboard, label: "Portal", href: "/portal" },
      { icon: Users, label: "Users", href: "/users" },
      { icon: MessageSquare, label: "Messages", href: "/messages" },
      { icon: CreditCard, label: "Billing", href: "/billing" },
    ],
  },
  {
    section: "Analytics & Marketing",
    items: [
      { icon: Landmark, label: "Marketing", href: "/marketing" },
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

  // Close mobile sidebar on route change
  useEffect(() => {
    dispatch(toggleMobileSidebar(false));
  }, [pathname, dispatch]);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => {
          dispatch(toggleMobileSidebar(!isMobileOpen));
          dispatch(toggleSidebar(false));
        }}
      >
        {isMobileOpen ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
      </Button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => {
            dispatch(toggleMobileSidebar(false))
            dispatch(toggleSidebar(true))
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full shadow bg-background border-r transition-all duration-300",
          "z-40 flex flex-col",
          isCollapsed ? "w-16" : "w-64",
          // Mobile styles
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-4 py-2">
          {isCollapsed ? (
            <Link href="/" className="h-12 flex items-center justify-center">
              <Image width={32} height={32} src="/calen.png" alt="" className="h-8 w-8" />
            </Link>
          ) : (
            <Link href="/" className="h-12 py-2 px-2 flex items-center justify-center">
              <Image width={32} height={32} src="/calen.png" alt="" className="h-8 w-8" />
              <h1 className="text-lg font-semibold">Portfolio Admin</h1>
            </Link>
          )}
          <div className="opacity-0 lg:opacity-100 absolute -right-[16px] top-[12px] z-20 bg-white dark:bg-primary-foreground lg:visible">
            <Button
              onClick={() => dispatch(toggleSidebar(!isCollapsed))}
              className="h-8 w-8 rounded-md"
              variant="ghost"
              size="icon"
            >
              {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {menuItems.map((section, idx) => (
            <div key={idx} className="py-4">
              {!isCollapsed ? (
                <div className="px-6 mb-2">
                  <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
                    {section.section}
                  </p>
                </div>
              ) : (
                <div className="px-6 mb-2">
                  <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
                    <Ellipsis className="h-4 w-4" />
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

        <div className="p-4">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-9 font-medium text-xs text-muted-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Ratings & Feedback
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-xs font-medium text-muted-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              Ratings & Feedback
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
