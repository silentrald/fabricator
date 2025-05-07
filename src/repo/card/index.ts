import logger from "@/modules/logger";
import { CardRepo, DatabaseClient } from "@/types/repo";
import { CardLocale, CardModel } from "@/models/card.model";
import { Result } from "@/types/result";
import createPopulateCards from "./populate";
import { StoreService } from "@/types/services";

const FIELDS = {
  id: "id",
  name: "name",
  pitch: "pitch",
  cost: "cost",
  power: "power",
  defense: "defense",
  health: "health",
  intellect: "intellect",
  arcane: "arcane",
  text: "text",
  textPlain: "text_plain",
  imageUrl: "image_url",
  horizontal: "horizontal",
  classicConstructedLegality: "cc_legality",
  blitzLegality: "blitz_legality",
  ultimatePitFightLegality: "upf_legality",
  commonerLegality: "commoner_legality",
  livingLegendLegality: "ll_legality",
  types: "types",
  keywords: "keywords",
  locale: "locale",
  favorite: "favorite",
};

export function createCardRepo({
  storeService,
  databaseClient,
}: {
  storeService: StoreService;
  databaseClient: DatabaseClient;
}): CardRepo {
  const createSelectStatement = (fields: object) => {
    return Object.entries(fields)
      .map((entry) => `${entry[1]} as "${entry[0]}"`)
      .join(",");
  };

  return {
    populateCards: createPopulateCards({ databaseClient }),

    async getCard(id) {
      const localeResult = await storeService.get<CardLocale>("locale", CardLocale.ENGLISH);
      const locale: CardLocale = localeResult.getValueOr(CardLocale.ENGLISH);

      const query = `
SELECT ${createSelectStatement(FIELDS)}
FROM cards
WHERE id = ?
  AND locale = ?
LIMIT 1;`.trim();
      let queryResult = await databaseClient.query<CardModel>(query, [ id, locale ]);
      if (queryResult.hasError()) {
        return Result.Error(queryResult.getError());
      }

      if (queryResult.getValue().length > 0) {
        // Good path
        return Result.Ok(queryResult.getValue()[0]);
      }

      if (locale === CardLocale.ENGLISH) {
        return Result.Error(`No card found with id "${id}"`);
      }

      // Fallback to english
      logger.warn(`No card found with id ${id}; locale ${locale}, falling back to "en"`);
      queryResult = await databaseClient.query<CardModel>(query, [ id, CardLocale.ENGLISH ]);
      if (queryResult.hasError()) {
        return Result.Error(queryResult.getError());
      }

      if (queryResult.getValue().length === 0) {
        return Result.Error(`No card found with id "${id}"`);
      }

      return Result.Ok(queryResult.getValue()[0]);
    },

    async getCards(filters) {
      // TODO: Get or create a query builder
      if (!filters.fields) {
        filters.fields = FIELDS;
      }

      let query = `
SELECT ${createSelectStatement(filters.fields)}
FROM cards
`;
      const values: any[] = [];

      const wheres: string[] = [];
      if (filters.name) {
        wheres.push("name LIKE ?");
        values.push(`%${filters.name}%`);
      }

      if (filters.keyword) {
        wheres.push("keywords LIKE ?");
        values.push(`%${filters.keyword}%`);
      }

      if (filters.type) {
        wheres.push("types LIKE ?");
        values.push(`%${filters.type}%`);
      }

      if (typeof filters.favorite === "boolean") {
        wheres.push("favorite = ?");
        values.push(filters.favorite);
      }

      if (wheres.length > 0) {
        query += `\nWHERE ${wheres.join("\nOR ")}`;
      }

      query += "\nORDER BY favorite DESC";
      query += "\nLIMIT ?,?";
      values.push((filters.pagination.page - 1) * filters.pagination.limit),
        values.push(filters.pagination.limit);
      return await databaseClient.query<CardModel>(query.trim(), values);
    },

    async setFavorite(id, favorite) {
        return databaseClient.run(`
UPDATE cards
SET favorite = ?
WHERE id = ?;
`.trim(), [ favorite, id ]);
    },
  };
}
