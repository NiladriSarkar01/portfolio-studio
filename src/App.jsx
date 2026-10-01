import { useState } from "react";
import BootScreen from "./components/Boot/BootScreen";
import LoginScreen from "./components/Login/LoginScreen";
import Desktop from "./components/Desktop/Desktop";

// App moves through three phases: boot → login → desktop
export default function App() {
  const [phase, setPhase] = useState("boot"); // 'boot' | 'login' | 'desktop'

  return (
    <div className="w-full h-full">
      {phase === "boot" && <BootScreen onDone={() => setPhase("login")} />}
      {phase === "login" && <LoginScreen onDone={() => setPhase("desktop")} />}
      {phase === "desktop" && <Desktop />}
    </div>
  );
}
