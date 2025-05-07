import { CardTable } from "./card.table";
import { capSQLiteVersionUpgrade } from "@capacitor-community/sqlite";

export default function createDatabaseTableStatements(
  databaseVersion: number
): capSQLiteVersionUpgrade[] {
  return [
    {
      toVersion: databaseVersion,
      statements: [ CardTable ],
    },
  ];
}
