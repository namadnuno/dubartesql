import { TableCreator } from "./TableCreator.ts";
import _ from "https://deno.land/x/deno_lodash/mod.ts";
import {Connector} from "../Connector.ts";

export const Schema = (client: any) => {
  return {
    createTable: async (tableName: string, cb: CallableFunction) => {
      const tableCreator = new TableCreator(tableName);
      cb(tableCreator);
      await tableCreator.run();
    },
    removeTable: async (tableName: string) => {
      return await Connector.instance.client.execute("DROP TABLE IF EXISTS `" + tableName + "`");
    }
  };
};
