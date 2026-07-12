import { useAppStore as useZustandStore } from "../store/useAppStore";
import { useAppStore as useContextStore } from "../store/app-context";
import { SUPPORTED_BUSINESSES } from "../lib/constants";

export function useBusiness() {
  const { selectedBusiness, setSelectedBusiness } = useZustandStore();
  const { showAnalyzeModal, setShowAnalyzeModal } = useContextStore();

  return {
    selectedBusiness,
    setSelectedBusiness,
    businesses: SUPPORTED_BUSINESSES,
    showAnalyzeModal,
    setShowAnalyzeModal,
  };
}
