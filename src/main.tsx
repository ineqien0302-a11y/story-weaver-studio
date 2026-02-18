import { createRoot } from "react-dom/client";
import "@fontsource/inter";
import "@fontsource/merriweather";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
