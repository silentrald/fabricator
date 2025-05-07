import { DatabaseService } from "@/types/repo";
import { Result } from "@/types/result";

import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";

import createDatabaseTableStatements from "@/db/tables";
import createDatabaseVersions from "@/db/versions";
import DatabaseClientImpl from "./database.client";
import createPopulateCards from "@/repo/card/populate";

const READONLY = false;

export default function createDatabaseService({
  platform,
  databaseName,
  databaseVersion,
}: {
  platform: string;
  databaseName: string;
  databaseVersion: number;
}): DatabaseService {
  const sqliteConnection = new SQLiteConnection(CapacitorSQLite);

  const shouldRetrieveConnection = async () => {
    const consistent = (await sqliteConnection.checkConnectionsConsistency())
      .result;
    const connection = (
      await sqliteConnection.isConnection(databaseName, READONLY)
    ).result;
    return consistent && connection;
  };

  return {
    async init() {
      try {
        const isWeb = platform === "web";
        if (isWeb) {
          await sqliteConnection.initWebStore();
        }

        const { result: existing } = await sqliteConnection.isDatabase(databaseName);
        await sqliteConnection.addUpgradeStatement(
          databaseName,
          existing
            ? createDatabaseVersions()
            : createDatabaseTableStatements(databaseVersion)
        );

        // Prepare the upgrade scripts
        const db = await this.open();
        if (db.hasError()) {
          return Result.Error(db.getError());
        }

        if (!existing && isWeb) {
          await createPopulateCards({ databaseClient: db.getValue() })();
        }

        if (isWeb) {
          await sqliteConnection.saveToStore(databaseName);
        }

        return Result.Ok();
      } catch (error: any) {
        return Result.Error(error);
      }
    },

    async open() {
      try {
        const db: SQLiteDBConnection = await shouldRetrieveConnection()
          ? await sqliteConnection.retrieveConnection(databaseName, READONLY)
          : await sqliteConnection.createConnection(
              databaseName,
              false, "no-encryption",
              databaseVersion, READONLY
            );

        await db.open();
        const { result: open } = await db.isDBOpen();

        return open
          ? Result.Ok(new DatabaseClientImpl(db))
          : Result.Error("Could not open sqlite database");
      } catch (error: any) {
        return Result.Error(error);
      }
    },

    async close() {
      try {
        const connection = (
          await sqliteConnection.isConnection(databaseName, READONLY)
        ).result;
        if (connection) {
          await sqliteConnection.closeConnection(databaseName, READONLY);
        }
        return Result.Ok();
      } catch (error: any) {
        return Result.Error(error);
      }
    },

    getDatabaseName() {
      return databaseName;
    },

    async saveToStore(dbName) {
      try {
        await sqliteConnection.saveToStore(dbName);
        return Result.Ok();
      } catch (error: any) {
        return Result.Error(error);
      }
    },
  };
}
