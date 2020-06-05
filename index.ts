import {DBConfig} from "./types.d.ts";
import {Schema} from "./schema";
import {Client} from "https://deno.land/x/mysql/mod.ts";
import {QueryBuilder} from "./QueryBuilder.ts";

export const database = (config: DBConfig) => {
  const client: Client = new Client();
  const schema = Schema(client);

  return {
    connect: async () => {
      await client.connect(config);
    },
    schema,
    async execute(sql: string) {
      return await client.execute(sql);
    },
  };
};

export class Model<T> {
  public table = "";
  public timestamps = false;
  private database: any;
  private queryBuilder: QueryBuilder<T>;

  constructor(tableName: string, database: any) {
    this.table = tableName;
    this.database = database;
    this.queryBuilder = new QueryBuilder<T>(tableName, database);
  }

  where(
      fieldOrFields: any,
      operatorOrFieldValue?: any,
      fieldValue?: any,
  ) {
    const whereOperator = typeof fieldValue !== "undefined"
        ? operatorOrFieldValue
        : "=";

    const whereValue = typeof fieldValue !== "undefined"
        ? fieldValue
        : operatorOrFieldValue;

    if (typeof fieldOrFields === "string") {
      this.queryBuilder.where(fieldOrFields, whereOperator, whereValue);
    } else {
      Object.entries(fieldOrFields).forEach(([field, value]) => {
        // @ts-ignore
        this.queryBuilder.where(field, "=", value);
      });
    }

    return this;
  }

  async update(
      fieldOrFields: any,
      fieldValue?: any,
  ) {
    let fieldsToUpdate = {};

    if (this.timestamps) {
      // @ts-ignore
      fieldsToUpdate.updated_at = new Date();
    }

    if (typeof fieldOrFields === "string") {
      // @ts-ignore
      fieldsToUpdate[fieldOrFields] = fieldValue!;
    } else {
      fieldsToUpdate = {
        ...fieldsToUpdate,
        ...fieldOrFields,
      };
    }
    const wheres = this.queryBuilder.wheres;
    await this.runQuery(
        this.queryBuilder.update(fieldsToUpdate as T),
    );

    this.queryBuilder.wheres = wheres;

    const result = await this.runQuery(
        this.queryBuilder,
    );

    if (result.rows.length > 1) {
      return result.rows;
    }

    return result.rows[0];
  }

  async count() {
    const result = await this.database.execute(
        this.queryBuilder.count().query(),
    );

    return result.rows[0].count;
  }

  async updateById(id: string | number, fields: any) {
    this.where("id", id);
    return await this.update(fields);
  }

  async find(id: string | number) {
    const result = await this.runQuery(
        this.queryBuilder.where("id", "=", id as string).single(),
    );

    return result.rows[0];
  }

  async create(
      fields: T,
  ) {
    const created = await this.runQuery(
        this.queryBuilder.insert(fields),
    );

    created.item = await this.find(created.lastInsertId);

    return created.item;
  }

  async delete() {
    const result = await this.runQuery(
        this.queryBuilder.delete(),
    );

    return result.affectedRows > 0;
  }

  async first() {
    this.queryBuilder.single();

    const result = await this.runQuery(
        this.queryBuilder,
    );

    return result.rows[0];
  }

  select(selects: Array<string> | string) {
    if (typeof selects == "string") {
      this.queryBuilder.select([selects]);
    }
    if (typeof selects == "object") {
      this.queryBuilder.select(selects);
    }

    return this;
  }

  async get() {
    const result = await this.runQuery(
        this.queryBuilder,
    );

    return result.rows;
  }

  async sql(sql: string) {
    return await this.database.execute(this.queryBuilder.sql(sql));
  }

  private async runQuery(query: QueryBuilder<T>) {
    const result = await this.database.execute(query.query());
    result.rows = result.rows as Array<T>;
    this.queryBuilder.reset();

    return result;
  }
}
