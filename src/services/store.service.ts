import { Result } from "@/types/result";
import { StoreService } from "@/types/services";
import { Storage } from "@ionic/storage";

export default async function createStoreService():
  Promise<StoreService>
{
  const storage = new Storage();
  const store = await storage.create();

  return {
    async get<T>(key: string, def?: T): Promise<Result<T>> {
      try {
        const value = await store.get(key) as T;
        if (!value) {
          return Result.Ok(def);
        }
        return Result.Ok(value);
      } catch (error: any) {
        return Result.Error(error);
      }
    },

    async set<T>(key: string, value: T) {
      try {
        await store.set(key, value);
        return Result.Ok();
      } catch (error: any) {
        return Result.Error(error);
      }
    },
  };
}

