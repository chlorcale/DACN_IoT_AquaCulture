import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import Overview from "./pages/Overview.jsx";
import Devices from "./pages/Devices.jsx";
import Camera from "./pages/Camera.jsx";
import Alerts from "./pages/Alerts.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";
import Settings from "./pages/Settings.jsx";
import Catalog from "./pages/Catalog.jsx";
import Monitoring from "./pages/Monitoring.jsx";
import Project from "./pages/Project.jsx";

const PAGES = {
  overview: Overview,
  devices: Devices,
  camera: Camera,
  alerts: Alerts,
  ai: AIAssistant,
  settings: Settings,
  catalog: Catalog,
  monitoring: Monitoring,
  project: Project
};

export default function App() {
  const [page, setPage] = useState("overview");
  const PageComponent = PAGES[page] || Overview;

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />
      <main>
        <TopBar />
        <PageComponent />
      </main>
    </div>
  );
}
