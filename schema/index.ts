import { TableCreator } from "./TableCreator.ts";
import _ from "https://deno.land/x/deno_lodash/mod.ts";

export const Schema = (client: any) => {
  return {
    createTable: async (tableName: string, cb: CallableFunction) => {
      const tableCreator = new TableCreator(tableName, client);
      cb(tableCreator);
      await tableCreator.run();
    },
  };
};
