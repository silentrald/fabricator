import { CardRepo } from "@/types/repo";
import { FilesystemService, StoreService } from "@/types/services";
import { getCurrentInstance, ComponentInternalInstance } from "vue";

export default function useGlobal(params?: {
  app?: ComponentInternalInstance | null
}) {
  const app = params ? params.app : getCurrentInstance();
  return (app as any).appContext.config.globalProperties as {
    $repos: {
      card: CardRepo;
    };
    $services: {
      store: StoreService;
      filesystem: FilesystemService;
    };
  };
}
