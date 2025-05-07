import { DatabaseClient } from "@/types/repo";
import { Result } from "@/types/result";

import logger from "@/modules/logger";
import { Capacitor } from "@capacitor/core";
import { BlitzLegality, CardLocale, ClassicConstructedLegality, CommonerLegality, LivingLegendLegality, UltimatePitFightLegality } from "@/models/card.model";

interface Printing {
  unique_id: string;
  id: string;
  set_id: string;
  image_url: string | null;
}

interface CardImport {
  unique_id: string;
  name: string;
  pitch: string;
  cost: string;
  power: string;
  defense: string;
  health: string;
  intelligence: string;
  arcane?: string;
  functional_text: string;
  functional_text_plain: string;
  played_horizontally: boolean;
  // classic constructed
  cc_legal: boolean;
  cc_living_legend: boolean;
  cc_suspended: boolean;
  cc_banned: boolean;
  // blitz
  blitz_legal: boolean;
  blitz_living_legend: boolean;
  blitz_suspended: boolean;
  blitz_banned: boolean;
  // ultimate pit fight
  upf_banned: boolean;
  // commoner
  commoner_legal: boolean;
  commoner_suspended: boolean;
  commoner_banned: boolean;
  // living_legends
  ll_legal: boolean;
  ll_restricted: boolean;
  ll_banned: boolean;
  // types: string[];
  type_text: string;
  card_keywords: string[];
  printings: Printing[];
}

interface Mapping {
  from: (keyof CardImport)[];
  to: string;
  transformer: (params: any) => any;
}

const getFirstElement = (params: any[]) => params[0];

function toNullableString([ value ]: [ string, ]) {
  return value === "" ? null : value;
}

function toNullableNumber([ value ]: [ string, ]) {
  return value === "" ? null : +value;
}

function getImageUrl([ printings ]: [ Printing[], ]) {
  return printings.find(p => p.image_url)?.image_url;
}

function getClassicConstructedLegality([
  legal,
  livingLegend,
  suspended,
  banned,
]: boolean[]): ClassicConstructedLegality {
  if (livingLegend) {
    return ClassicConstructedLegality.LIVING_LEGENDS;
  }

  if (suspended) {
    return ClassicConstructedLegality.SUSPENDED;
  }

  if (banned) {
    return ClassicConstructedLegality.BANNED;
  }

  if (legal) {
    return ClassicConstructedLegality.LEGAL;
  }

  return ClassicConstructedLegality.UNKNOWN;
}

function getBlitzLegality([
  legal,
  livingLegend,
  suspended,
  banned,
]: boolean[]): BlitzLegality {
  if (livingLegend) {
    return BlitzLegality.LIVING_LEGENDS;
  }

  if (suspended) {
    return BlitzLegality.SUSPENDED;
  }

  if (banned) {
    return BlitzLegality.BANNED;
  }

  if (legal) {
    return BlitzLegality.LEGAL;
  }

  return BlitzLegality.UNKNOWN;
}

function getUltimatePitFightLegality([
  banned,
]: boolean[]): UltimatePitFightLegality {
  if (banned) {
    return UltimatePitFightLegality.BANNED;
  }

  return UltimatePitFightLegality.LEGAL;
}

function getCommonerLegality([
  legal,
  suspended,
  banned,
]: boolean[]): CommonerLegality {
  if (suspended) {
    return CommonerLegality.SUSPENDED;
  }

  if (banned) {
    return CommonerLegality.BANNED;
  }

  if (legal) {
    return CommonerLegality.LEGAL;
  }


  return CommonerLegality.UNKNOWN;
}

function getLivingLegendsLegality([
  legal,
  restricted,
  banned,
]: boolean[]): LivingLegendLegality {
  if (restricted) {
    return LivingLegendLegality.RESTRICTED;
  }

  if (banned) {
    return LivingLegendLegality.BANNED;
  }

  if (legal) {
    return LivingLegendLegality.LEGAL;
  }


  return LivingLegendLegality.UNKNOWN;
}

function getKeywords(values: string[]) {
  return values.join("|");
}

async function populateCardsLocale(
  databaseClient: DatabaseClient,
  statement: string,
  mappings: Mapping[],
  locale: CardLocale,
  events: any
) {
  const cards: CardImport[] = (await import(`@/db/data/${locale}/card.json`)) as any;
  const N = Capacitor.getPlatform() === "web"
    ? Math.min(cards.length, 250)
    : cards.length;

  events?.onInit?.({ locale, total: N });

  let values: any[];
  let params: any[];

  for (let i = 0; i < N; ++i) {
    values = [];
    const card = cards[i];

    for (const map of mappings) {
      params = [];
      for (const from of map.from) {
        params.push(card[from]);
      }
      values.push(map.transformer(params));
    }

    logger.info("Inserting", card.name);
    const result = await databaseClient.query(statement, values);
    if (result.hasError()) {
      logger.error(
        "[Skipping] Could not insert",
        card.name, result.getError()
      );
      continue;
    }

    events?.onInsert?.({
      current: i + 0,
      total: N,
    });
  } 
}

const createPopulateCards = ({
  databaseClient,
}: {
  databaseClient: DatabaseClient;
}) => async (events?: {
  onInit?(updates: {
    locale: CardLocale;
    total: number;
  }): void;
  onInsert?(updates: {
    current: number;
    total: number;
  }): void;
}): Promise<Result<string>> => {
  await databaseClient.beginTransaction();

  await databaseClient.run("delete from cards;");

  let locale = CardLocale.ENGLISH;

  const mappings: Mapping[] = [
    { from: [ "unique_id" ], to: "id", transformer: getFirstElement },
    { from: [ "name" ], to: "name", transformer: getFirstElement },
    { from: [ "pitch" ], to: "pitch", transformer: toNullableNumber },
    { from: [ "cost" ], to: "cost", transformer: toNullableNumber },
    { from: [ "power" ], to: "power", transformer: toNullableNumber },
    { from: [ "defense" ], to: "defense", transformer: toNullableNumber },
    { from: [ "health" ], to: "health", transformer: toNullableNumber },
    { from: [ "functional_text" ], to: "text", transformer: toNullableString },
    { from: [ "functional_text_plain" ], to: "text_plain", transformer: toNullableString },
    { from: [ "printings" ], to: "image_url", transformer: getImageUrl },
    { from: [ "played_horizontally" ], to: "horizontal", transformer: getFirstElement },
    {
      from: [ "cc_legal", "cc_living_legend", "cc_suspended", "cc_banned" ],
      to: "cc_legality",
      transformer: getClassicConstructedLegality,
    },
    {
      from: [ "blitz_legal", "blitz_living_legend", "blitz_suspended", "blitz_banned" ],
      to: "blitz_legality",
      transformer: getBlitzLegality,
    },
    { from: [ "upf_banned" ], to: "upf_legality", transformer: getUltimatePitFightLegality },
    {
      from: [ "commoner_legal", "commoner_suspended", "commoner_banned" ],
      to: "commoner_legality",
      transformer: getCommonerLegality,
    },
    {
      from: [ "ll_legal", "ll_restricted", "ll_banned" ],
      to: "ll_legality",
      transformer: getLivingLegendsLegality,
    },
    { from: [ "type_text" ], to: "types", transformer: getFirstElement },
    { from: [ "card_keywords" ], to: "keywords", transformer: getKeywords },
    { from: [], to: "locale", transformer: () => locale },
    { from: [], to: "favorite", transformer: () => false },
  ];

  const insertStatement = `
INSERT INTO cards (${mappings.map(m => m.to).join(",")})
VALUES (${mappings.map(() => "?").join(",")});
`.trim();

  for (const l of Object.values(CardLocale)) {
    // Set this for the mapper value change
    locale = l;
    await populateCardsLocale(
      databaseClient, insertStatement, mappings,
      l, events
    );
  }

  // TODO: Download with either git or just normal http

  await databaseClient.commitTransaction();
  // TODO: get the last hash commit of the github repo database
  return Result.Ok("some-hash-value");
};

export default createPopulateCards;

