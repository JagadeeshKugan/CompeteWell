import { useAppStore as useZustandStore } from "../store/useAppStore";
import { useAppStore as useContextStore } from "../store/app-context";

export function useAppState() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useZustandStore();
  const {
    searchQuery,
    setSearchQuery,
    webHealth,
    apiHealth,
    checkHealthStatus,
  } = useContextStore();

  return {
    isSidebarCollapsed: !sidebarOpen,
    setIsSidebarCollapsed: (collapsed: boolean) => setSidebarOpen(!collapsed),
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    webHealth,
    apiHealth,
    checkHealthStatus,
  };
}
