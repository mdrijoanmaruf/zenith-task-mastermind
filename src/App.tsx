
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "@/context/TaskContext";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import TasksPage from "@/pages/TasksPage";
import NewTaskPage from "@/pages/NewTaskPage";
import CalendarPage from "@/pages/CalendarPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TaskProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/new-task" element={<NewTaskPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              {/* Add more routes here */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TaskProvider>
  </QueryClientProvider>
);

export default App;
