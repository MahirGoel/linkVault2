import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuickAddLink } from "@/components/QuickAddLink";
import { CommandPalette } from "@/components/CommandPalette";
import { AddLinkModal } from "@/components/AddLinkModal";
import { CreatePlaylistModal } from "@/components/CreatePlaylistModal";
import { LoginPage } from "@/components/LoginPage";
import { useToast } from "@/hooks/use-toast";
import Feed from "@/pages/Feed";
import Playlists from "@/pages/Playlists";
import Shared from "@/pages/Shared";
import Account from "@/pages/Account";
import Tags from "@/pages/Tags";
import Categories from "@/pages/Categories";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Feed} />
      <Route path="/links" component={Feed} />
      <Route path="/playlists" component={Playlists} />
      <Route path="/shared" component={Shared} />
      <Route path="/account" component={Account} />
      <Route path="/settings" component={Account} />
      <Route path="/tags" component={Tags} />
      <Route path="/categories" component={Categories} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated } = useAuth();
  const [addLinkModalOpen, setAddLinkModalOpen] = useState(false);
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const { toast } = useToast();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const handleQuickAdd = (url: string) => {
    toast({
      title: "Link saved",
      description: url,
    });
  };

  return (
    <>
      <CommandPalette
        onAddLink={() => setAddLinkModalOpen(true)}
        onCreatePlaylist={() => setCreatePlaylistOpen(true)}
      />

      <SidebarProvider style={sidebarStyle as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <header className="flex items-center justify-between gap-4 px-4 py-2 border-b h-14 flex-shrink-0">
              <div className="flex items-center gap-2">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
              </div>
              <div className="flex items-center gap-2">
                <QuickAddLink
                  onAdd={handleQuickAdd}
                  onOpenFullModal={() => setAddLinkModalOpen(true)}
                />
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 overflow-hidden">
              <Router />
            </main>
          </div>
        </div>
      </SidebarProvider>

      <AddLinkModal
        open={addLinkModalOpen}
        onClose={() => setAddLinkModalOpen(false)}
        onSave={(data) => {
          toast({
            title: "Link saved",
            description: data.title || data.url,
          });
        }}
        categories={["Development", "Design", "Marketing", "Business", "Personal", "Learning"]}
      />

      <CreatePlaylistModal
        open={createPlaylistOpen}
        onClose={() => setCreatePlaylistOpen(false)}
        onSave={(data) => {
          toast({
            title: "Playlist created",
            description: data.name,
          });
        }}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <AuthenticatedApp />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
