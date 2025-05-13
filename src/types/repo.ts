import { CardLocale, CardModel } from "@/models/card.model";
import { Result } from "./result";

export interface DatabaseClient {
  query<T>(statement: string, values?: any[]): Promise<Result<T[]>>;
  run(statement: string, values?: any[]): Promise<Result<any>>; // TODO
  beginTransaction(): Promise<Result<void>>;
  commitTransaction(): Promise<Result<void>>;
  rollbackTransaction(): Promise<Result<void>>;
}

export interface DatabaseService {
  // Setup / Destructors
  init(): Promise<Result<void>>;
  open(): Promise<Result<DatabaseClient>>;
  close(): Promise<Result<void>>;

  // Getters
  getDatabaseName(): string;

  // Mutations
  saveToStore(dbName: string): Promise<Result<void>>;
}

// === //

export interface Pagination {
  page: number;
  limit: number;
}

export interface CardRepo {
  // TODO: make this an interface
  populateCards(events: {
    onInit(updates: {
      locale: CardLocale;
      total: number;
    }): void;

    onInsert(updates: {
      current: number;
      total: number;
    }): void
  }): Promise<Result<string>>;

  getCards(filters: {
    fields?: Partial<Record<keyof CardModel, string>>;
    name?: string;
    keyword?: string;
    type?: string;
    favorite?: boolean | null;
    pagination: Pagination;
  }): Promise<Result<CardModel[]>>;

  getCard(id: string): Promise<Result<CardModel>>;

  setFavorite(
    id: string,
    favorite: boolean
  ): Promise<Result<void>>;
}

