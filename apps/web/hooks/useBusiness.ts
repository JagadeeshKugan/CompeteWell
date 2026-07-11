import { useAppStore } from "../store/app-context";
import { SUPPORTED_BUSINESSES } from "../lib/constants";

export function useBusiness() {
  const { selectedBusiness, setSelectedBusiness, showAnalyzeModal, setShowAnalyzeModal } = useAppStore();

  return {
    selectedBusiness,
    setSelectedBusiness,
    businesses: SUPPORTED_BUSINESSES,
    showAnalyzeModal,
    setShowAnalyzeModal,
  };
}
