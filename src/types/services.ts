import { Directory } from "@capacitor/filesystem";
import { Result } from "./result";

export interface FilesystemService {
  read(
    path: string,
    directory: Directory
  ): Promise<Result<string | Blob>>;

  makeDirectory(
    path: string,
    directory: Directory
  ): Promise<Result<void>>;

  downloadFromUrl(
    url: string,
    path: string,
    directory: Directory
  ): Promise<Result<void>>;

  delete(
    path: string,
    directory: Directory
  ): Promise<Result<void>>;
}

export interface InitializerService {
  init(): Promise<Result<boolean>>;
}

export interface StoreService {
  get<T>(key: string, def?: T): Promise<Result<T>>;
  set<T>(key: string, value: T): Promise<Result<void>>;
}

