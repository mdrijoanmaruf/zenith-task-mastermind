
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border py-4 mt-auto">
      <div className="container flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
        </p>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center"
          >
            <Github className="h-4 w-4 mr-1" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
