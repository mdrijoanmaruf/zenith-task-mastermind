
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import Firebase dependencies
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

createRoot(document.getElementById("root")!).render(<App />);
