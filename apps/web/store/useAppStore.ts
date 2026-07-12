import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  selectedBusiness: string;
  theme: "light" | "dark";
  selectedCompetitor: string;
  currentWizardStep: number;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSelectedBusiness: (business: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  setSelectedCompetitor: (competitor: string) => void;
  setCurrentWizardStep: (step: number) => void;
  nextWizardStep: () => void;
  prevWizardStep: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  selectedBusiness: "Downtown Coffee Co.",
  theme: "light",
  selectedCompetitor: "",
  currentWizardStep: 1,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSelectedBusiness: (business) => set({ selectedBusiness: business }),
  setTheme: (theme) => set({ theme }),
  setSelectedCompetitor: (competitor) => set({ selectedCompetitor: competitor }),
  setCurrentWizardStep: (step) => set({ currentWizardStep: step }),
  nextWizardStep: () => set((state) => ({ currentWizardStep: state.currentWizardStep + 1 })),
  prevWizardStep: () => set((state) => ({ currentWizardStep: Math.max(1, state.currentWizardStep - 1) })),
}));
