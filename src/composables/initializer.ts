import logger from "@/modules/logger";
import { CardRepo } from "@/types/repo";
import { Result } from "@/types/result";
import { StoreService } from "@/types/services";

export default function useInitializer({
  storeService,
  cardRepo,

  showDialog,
  hideDialog,
  updateDialog,
}: {
  storeService: StoreService;
  cardRepo: CardRepo;

  showDialog(): Promise<void>;
  hideDialog(): Promise<void>;
  updateDialog(update: {
    current: number;
    total: number;
    text?: string;
  }): void;
}) {
  return {

    async init() {
      let result: Result<any> = await storeService.get<string>("english.hash");
      if (result.hasError()) {
        logger.error("Could not initialize", result.getError());
        return;
      }

      const hash = result.getValue() as string;
      // NOTE: compare hash with the current hash value
      if (hash) {
        return;
      }
      await showDialog();

      logger.info("Populating Cards Table");
      result = await cardRepo.populateCards({
        onInit(updates) {
          updateDialog({
            current: 1,
            total: updates.total,
            text: `Populating Cards Database [${updates.locale}]`,
          });
        },

        onInsert(updates) {
          updateDialog({
            current: updates.current,
            total: updates.total,
          });
        },
      });

      if (result.hasError()) {
        logger.error("Could not populateCards", result.getError());
      } else {
        storeService.set("english.hash", result.getValue());
      }
      await hideDialog();
    },

  };
}

