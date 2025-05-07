import { DatabaseService } from "@/types/repo";
import { FilesystemService, InitializerService } from "@/types/services";
import { JeepSqlite } from "jeep-sqlite/dist/components/jeep-sqlite";
import { Platform } from "@/types/index";
import { Result } from "@/types/result";
import { Directory } from "@capacitor/filesystem";

import { CARD_IMAGE_FOLDER } from "@/const";

export function createInitializerService({
  platform,
  databaseService,
  filesystemService,
}: {
  platform: Platform;
  databaseService: DatabaseService;
  filesystemService: FilesystemService;
}): InitializerService {
  let initialized = false;

  return {
    async init() {
      if (initialized) {
        return Result.Ok(true);
      }

      try {
        if (platform === "web") {
          customElements.define("jeep-sqlite", JeepSqlite);
          const jeepSqliteElement = document.createElement("jeep-sqlite");
          document.body.appendChild(jeepSqliteElement);
          await customElements.whenDefined("jeep-sqlite");
        }

        await databaseService.init();

        await filesystemService.makeDirectory(CARD_IMAGE_FOLDER, Directory.Cache);
        await filesystemService.makeDirectory(CARD_IMAGE_FOLDER, Directory.Data);

        initialized = true;
        return Result.Ok(true);
      } catch (error: any) {
        return Result.Error(error);
      }
    },
  };
}
