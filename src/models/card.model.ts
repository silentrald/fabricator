export enum ClassicConstructedLegality {
  LEGAL = "L",
  LIVING_LEGENDS = "V",
  SUSPENDED = "S",
  BANNED = "B",
  UNKNOWN = "U",
}

export enum BlitzLegality {
  LEGAL = "L",
  LIVING_LEGENDS = "V",
  SUSPENDED = "S",
  BANNED = "B",
  UNKNOWN = "U",
}

export enum UltimatePitFightLegality {
  LEGAL = "L",
  BANNED = "B",
  UNKNOWN = "U",
}

export enum CommonerLegality {
  LEGAL = "L",
  SUSPENDED = "S",
  BANNED = "B",
  UNKNOWN = "U",
}

export enum LivingLegendLegality {
  LEGAL = "L",
  RESTRICTED = "R",
  BANNED = "B",
  UNKNOWN = "U",
}

export enum CardLocale {
  ENGLISH = "en",
  FRENCH = "fr",
  GERMAN = "de",
  ITALIAN = "it",
  SPANISH = "es",
}

export interface CardModel {
  id: string;
  name: string;
  pitch?: number | null;
  cost?: number | null;
  power?: number | null;
  defense?: number | null;
  health?: number | null;
  intellect?: number | null;
  arcane?: number | null;
  // NOTE: Check for print text
  text?: string | null;
  textPlain?: string | null;
  imageUrl: string;
  horizontal: boolean;

  classicConstructedLegality: ClassicConstructedLegality;
  blitzLegality: BlitzLegality;
  ultimatePitFightLegality: UltimatePitFightLegality;
  commonerLegality: CommonerLegality;
  livingLegendLegality: LivingLegendLegality;

  types: string;
  keywords?: string | null;

  locale: CardLocale;

  // Custom
  favorite: boolean;
}

