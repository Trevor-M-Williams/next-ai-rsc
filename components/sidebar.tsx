"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserButton } from "@clerk/nextjs";
import { OrganizationSwitcher } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

import InsightsIcon from "@mui/icons-material/InsightsOutlined";
import GovernanceIcon from "@mui/icons-material/AccountBalanceOutlined";
import AnalysisIcon from "@mui/icons-material/QueryStats";
import ChatIcon from "@mui/icons-material/ChatOutlined";
import FilesIcon from "@mui/icons-material/FolderOutlined";
import NotesIcon from "@mui/icons-material/NotesOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";

import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const buttonClassName = "w-full justify-start text-md flex gap-4 h-10";

  const HomeIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
    >
      <path d="M5,10 L5,19 C5,19.5523 5.44772,20 6,20 L18,20 C18.5523,20 19,19.5523 19,19 L19,10"></path>
      <path d="M21,11 L12.307,4.23875 C12.1264,4.09832 11.8736,4.09832 11.693,4.23875 L3,11"></path>
    </svg>
  );

  const links = [
    { href: "/dashboard", label: "Overview", Icon: HomeIcon },
    {
      href: "/dashboard/insights",
      label: "Insights",
      Icon: InsightsIcon,
    },
    {
      href: "/dashboard/governance",
      label: "Governance",
      Icon: GovernanceIcon,
    },
    { href: "/dashboard/analysis", label: "Analysis", Icon: AnalysisIcon },
    {
      href: "/dashboard/chat",
      label: "Chat",
      Icon: ChatIcon,
    },
    {
      href: "/dashboard/files",
      label: "Files",
      Icon: FilesIcon,
    },
  ];

  return (
    <div className=" h-full border-r px-2 py-6 flex flex-col justify-between bg-background">
      <div>
        <div className="flex justify-center mb-4 pb-2 border-b min-h-[3rem] ">
          <OrganizationSwitcher
            afterCreateOrganizationUrl="/dashboard"
            afterSelectOrganizationUrl="/dashboard"
            hidePersonal={true}
          />
        </div>

        <div className="flex flex-col gap-2">
          {links.map(({ href, label, Icon }, index) => {
            let highlight = false;
            if (href === "/dashboard") {
              if (label === "Overview") {
                highlight = pathname === href;
              } else {
                highlight = false;
              }
            } else {
              highlight = pathname === href || pathname.includes(href);
            }

            return (
              <Link href={href} key={index} className="flex">
                <Button
                  tabIndex={-1}
                  key={index}
                  variant="ghost"
                  className={`${buttonClassName} ${
                    highlight ? "bg-secondary" : ""
                  }`}
                >
                  {Icon && <Icon />}
                  <span className="hidden ">{label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 border-t pt-4">
        <Link href="/dashboard">
          <Button
            tabIndex={-1}
            variant="ghost"
            className={`${buttonClassName} ${
              pathname.includes("settings") ? "bg-secondary" : ""
            }`}
          >
            <SettingsIcon />
            <span className="hidden ">Settings</span>
          </Button>
        </Link>

        <div
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            "hover:bg-accent hover:text-accent-foreground",
            "h-10 px-4 py-2",
            "cursor-pointer",
            buttonClassName
          )}
        >
          <UserButton afterSignOutUrl="/sign-in" />
          <span className="hidden ">Account</span>
        </div>
      </div>
    </div>
  );
}
