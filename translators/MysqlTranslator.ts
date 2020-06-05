import { QueryBuilder } from "../QueryBuilder.ts";

export class MysqlTranslator<T> {
  private queryBuilder: QueryBuilder<T>;
  constructor(queryBuilder: QueryBuilder<T>) {
    this.queryBuilder = queryBuilder;
  }

  getSelectsSql() {
    if (this.queryBuilder.isCount()) {
      return "count(*) as count";
    }

    if (this.queryBuilder.selects.length == 0) {
      return "*";
    }

    return this.queryBuilder.selects.join(",");
  }

  sqlBegin() {
    let begin;
    switch (this.queryBuilder.type) {
      case "insert":
        begin = "insert";
        break;
      case "delete":
        begin = "delete";
        break;
      case "update":
        begin = "update";
        break;
      default:
        begin = `select ${this.getSelectsSql()}`;
    }

    return begin;
  }

  sqlFrom() {
    if (this.queryBuilder.type == "insert") {
      return `into ${this.queryBuilder.table}`;
    }

    if (this.queryBuilder.type == "update") {
      return ` ${this.queryBuilder.table}`;
    }

    return `from ${this.queryBuilder.table}`;
  }

  sqlMidle() {
    if (this.queryBuilder.type == "insert") {
      return `(${
        Object.keys(this.queryBuilder.fieldsToUpdateOrInsert).join(",")
      }) values ('${
        Object.values(this.queryBuilder.fieldsToUpdateOrInsert).join("','")
      }')`;
    }

    if (this.queryBuilder.wheres.length > 0) {
      return "where " +
        this.queryBuilder.wheres.reduce((acc: any, where: any) => {
          return [...acc, `${where.field}${where.operator}"${where.value}" `];
        }, []).join(" AND ");
    }

    return "";
  }

  sqlSet() {
    if (this.queryBuilder.type == "update") {
      return "SET " +
        Object.keys(this.queryBuilder.fieldsToUpdateOrInsert).reduce(
          (acc: any, key) => {
            return [
              ...acc,
              `${key}="${this.queryBuilder.fieldsToUpdateOrInsert[key]}"`,
            ];
          },
          [],
        ).join(",");
    }

    return "";
  }

  sqlTail() {
    if (this.queryBuilder.isSingle()) {
      return "limit 1";
    }

    return "";
  }

  translate() {
    let begin = this.sqlBegin();
    let from = this.sqlFrom();
    let set = this.sqlSet();
    let middle = this.sqlMidle();
    let tail = this.sqlTail();

    return `${begin} ${from} ${set} ${middle} ${tail}`;
  }
}
