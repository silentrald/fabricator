import logger from "@/modules/logger";

import { Result } from "@/types/result";
import { FilesystemService } from "@/types/services";
import { CARD_IMAGE_FOLDER } from "@/const";
import { Directory } from "@capacitor/filesystem";

export default function useImage({
  filesystemService,
}: {
  filesystemService: FilesystemService;
}) {
  async function getUrl(url: string, directory: Directory): Promise<Result<string>> {
      const imageName = url.split("/").at(-1);
      const filetype = imageName?.split(".").at(-1);
      if (!imageName || !filetype) {
        return Result.Error(`Invalid image url: ${url}`);
      }

      // Try to load on data folder first
      const filepath = `${CARD_IMAGE_FOLDER}/${imageName}`;
      let data = await filesystemService.read(filepath, directory);
      if (data.hasValue()) {
        return Result.Ok(`data:image/${filetype};base64,${data.getValue()}`);
      }

      await filesystemService.downloadFromUrl(url, filepath, directory);
      data = await filesystemService.read(filepath, directory);
      if (data.hasError()) {
        logger.error("Could not save image", data.getError());
        return Result.Error(data.getError());
      }

      logger.info("Saved", directory, url);
      return Result.Ok(`data:image/${filetype};base64,${data.getValue()}`);
  }

  return {

    async getDataUrl(url: string): Promise<Result<string>> {
      return getUrl(url, Directory.Data);
    },

    async getCacheUrl(url: string): Promise<Result<string>> {
      return getUrl(url, Directory.Cache);
    },

    async exists(url: string) {
      const imageName = url.split("/").at(-1);
      const filepath = `${CARD_IMAGE_FOLDER}/${imageName}`;
      const data = await filesystemService.read(filepath, Directory.Data);
      return data.hasValue();
    },

    async saveImageUrl(url: string) {
      const imageName = url.split("/").at(-1);
      const filepath = `${CARD_IMAGE_FOLDER}/${imageName}`;
      // Delete the cache before downloading the file
      await filesystemService.delete(filepath, Directory.Cache);
      return await filesystemService.downloadFromUrl(url, filepath, Directory.Data);
    },

    async deleteImageUrl(url: string) {
      const imageName = url.split("/").at(-1);
      const filepath = `${CARD_IMAGE_FOLDER}/${imageName}`;
      return await filesystemService.delete(filepath, Directory.Data);
    },

  };
}
