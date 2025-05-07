import { capSQLiteVersionUpgrade } from "@capacitor-community/sqlite";

const V1_Init_Upgrade: capSQLiteVersionUpgrade = {
  toVersion: 1,
  statements: [ `
CREATE TABLE IF NOT EXISTS cards (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  pitch               INTEGER,
  cost                INTEGER,
  power               INTEGER,
  defense             INTEGER,
  health              INTEGER,
  intellect           INTEGER,
  arcane              INTEGER,
  text                TEXT,
  text_plain          TEXT,
  image_url           TEXT NOT NULL,
  horizontal          BOOLEAN NOT NULL,
  cc_legality         CHAR(1) NOT NULL,
  blitz_legality      CHAR(1) NOT NULL,
  upf_legality        CHAR(1) NOT NULL,
  commoner_legality   CHAR(1) NOT NULL,
  ll_legality         CHAR(1) NOT NULL,
  types               TEXT NOT NULL,
  keywords            TEXT,
  locale              CHAR(2) NOT NULL,

  favorite            BOOLEAN NOT NULL,

  PRIMARY KEY (id, locale)
);`.trim(),
  ],
};

export default V1_Init_Upgrade;
