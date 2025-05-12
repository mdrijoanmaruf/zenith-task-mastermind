
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // On mobile, sidebar should be closed by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 pt-16"> {/* Added pt-16 to prevent overlap with header */}
        <Sidebar isOpen={isSidebarOpen} />
        <div 
          className={cn(
            "flex-1 transition-all duration-300",
            isSidebarOpen ? "ml-0 md:ml-64" : "ml-0"
          )}
        >
          <main className="container mx-auto py-6 px-4">
            <Outlet />
          </main>
        </div>
      </div>
      <div className={cn(
        "transition-all duration-300",
        isSidebarOpen ? "ml-0 md:ml-64" : "ml-0"
      )}>
        <Footer />
      </div>
    </div>
  );
}
