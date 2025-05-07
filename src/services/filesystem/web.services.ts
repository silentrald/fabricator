import { Result } from "@/types/result";
import { FilesystemService } from "@/types/services";

import { Filesystem } from "@capacitor/filesystem";

export default function createFilesystemWebService({
  proxyUrl,
}: {
  proxyUrl: string;
}): FilesystemService {
  if (!proxyUrl.endsWith("/")) {
    proxyUrl += "/";
  }

  // helper function
  const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

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

    // https://forum.ionicframework.com/t/how-to-download-an-image-then-store-it-on-the-device/199841/2
    async downloadFromUrl(url, path, directory) {
      try {
        const response = await fetch(`${proxyUrl}${url}`);
        const blob = await response.blob();
        const base64Data = (await convertBlobToBase64(blob)) as string;

        await Filesystem.writeFile({
          path, directory,
          data: base64Data,
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
