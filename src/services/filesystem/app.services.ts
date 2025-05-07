import { Result } from "@/types/result";
import { FilesystemService } from "@/types/services";

import { Filesystem } from "@capacitor/filesystem";

export default function createFilesystemAppService(): FilesystemService {
  return {
    async read(path, directory) {
      try {
        const file = await Filesystem.readFile({ path, directory });
        return Result.Ok(file.data);
      } catch (error: any) {
        return Result.Error(error);
      }
    },

    async makeDirectory(path, directory) {
      try {
        await Filesystem.mkdir({
          path, directory,
          recursive: true,
        });
        return Result.Ok();
      } catch (error: any) {
        return Result.Error(error);
      }
    },

    async downloadFromUrl(url, path, directory) {
      try {
        await Filesystem.downloadFile({
          url, path, directory,
          method: "GET",
          recursive: true,
        });
        return Result.Ok();
      } catch (error: any) {
        return Result.Error(error);
      }
    },

    async delete(path, directory) {
      try {
        await Filesystem.deleteFile({
          path, directory,
        });
        return Result.Ok();
      } catch (error: any) {
        return Result.Error(error);
      }
    },
  };
}
