import { MobileMenu } from "@/components/common/mobile-menu";
import { RobotStatusDropdown } from "@/components/common/robot-status-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { fetcher } from "@/lib/utils";
import { ServerStatus } from "@/types";
import {
  BookText,
  BrainCircuit,
  LogOut,
  Mail,
  TestTubeDiagonal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

const routeMap = [
  { path: "/", title: "Dashboard" },
  { path: "/control", title: "Robot Control" },
  { path: "/calibration", title: "Calibration" },
  { path: "/inference", title: "AI Control" },
  { path: "/admin", title: "Admin Configuration" },
  { path: "/docs", title: "API Documentation" },
  { path: "/viz", title: "Camera Overview" },
  { path: "/network", title: "Network Management" },
  { path: "/browse", title: "Browse Datasets", isPrefix: true },
];

function ServerIP() {
  const { data: serverStatus } = useSWR<ServerStatus>(["/status"], ([url]) =>
    fetcher(url),
  );

  if (!serverStatus) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-xs text-muted-foreground cursor-pointer">
            {serverStatus.server_ip}:{serverStatus.server_port}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{serverStatus.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function RecordingStatus() {
  const { data: serverStatus } = useSWR<ServerStatus>(["/status"], ([url]) =>
    fetcher(url),
  );

  if (!serverStatus || !serverStatus.is_recording) return null;

  return (
    <span className="relative inline-block">
      <span className="animate-ping absolute inline-flex size-3 rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full size-3 bg-red-500"></span>
    </span>
  );
}

function AIControlStatus() {
  const { data: serverStatus } = useSWR<ServerStatus>(["/status"], ([url]) =>
    fetcher(url),
  );

  if (!serverStatus || serverStatus.ai_running_status !== "running") return null;

  return (
    <a href="/inference">
      <span className="relative inline-block">
        <span className="animate-ping absolute inline-flex size-5 rounded-full bg-green-400 opacity-75"></span>
        <BrainCircuit className="size-5 text-primary" />
      </span>
    </a>
  );
}

function AccountTopBar() {
  const { session, proUser, logout } = useAuth();
  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarFallback className="bg-purple-600 text-white">
            {session.user_email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>{session.user_email}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TopBar() {
  const currentPath = window.location.pathname;
  const navigate = useNavigate();
  const { session } = useAuth();

  const matchedRoute = routeMap.find(({ path, isPrefix }) =>
    isPrefix ? currentPath.startsWith(path) : currentPath === path,
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-purple-50 border-b border-purple-200">
      {/* 브랜드 영역 */}
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-700">
          Roboseasy
        </h1>
        {matchedRoute?.title && (
          <span className="text-sm text-muted-foreground">
            {matchedRoute.title}
          </span>
        )}
      </div>

      {/* 오른쪽 버튼들 */}
      <div className="flex items-center gap-2">
        <MobileMenu />
        <ServerIP />
        <AIControlStatus />
        <RecordingStatus />
        <RobotStatusDropdown />

        <Button variant="outline" asChild>
          <a
            href="https://roboseasy.github.io/"
            target="_blank"
            rel="noreferrer"
          >
            <BookText className="size-4 mr-1" />
            Docs
          </a>
        </Button>

        <ThemeToggle />

        {session ? (
          <AccountTopBar />
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate("/sign-in")}>
              Sign in
            </Button>
            <Button onClick={() => navigate("/sign-up")}>Sign up</Button>
          </>
        )}
      </div>
    </div>
  );
}
