import { useAppStore } from "../store/app-context";

export function useAppState() {
  const {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    searchQuery,
    setSearchQuery,
    webHealth,
    apiHealth,
    checkHealthStatus,
  } = useAppStore();

  return {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    searchQuery,
    setSearchQuery,
    webHealth,
    apiHealth,
    checkHealthStatus,
  };
}
