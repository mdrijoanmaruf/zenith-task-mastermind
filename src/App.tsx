import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "@/context/TaskContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Layout } from "@/components/layout/Layout";
import { FirebaseProvider } from "@/context/FirebaseContext";
import Dashboard from "@/pages/Dashboard";
import TasksPage from "@/pages/TasksPage";
import NewTaskPage from "@/pages/NewTaskPage";
import CalendarPage from "@/pages/CalendarPage";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import TodayTasksPage from "@/pages/TodayTasksPage";
import UpcomingTasksPage from "@/pages/UpcomingTasksPage";
import TagsPage from "@/pages/TagsPage";
import TagViewPage from "@/pages/TagViewPage";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";

const queryClient = new QueryClient();

// Check if Firebase is initialized properly
try {
  const auth = getAuth();
  console.log("Firebase Auth initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const App = () => (
  <FirebaseProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TaskProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename="/">
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/new-task" element={<NewTaskPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/today" element={<TodayTasksPage />} />
                  <Route path="/upcoming" element={<UpcomingTasksPage />} />
                  <Route path="/tags" element={<TagsPage />} />
                  <Route path="/tags/:id" element={<TagViewPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TaskProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </FirebaseProvider>
);

export default App;
