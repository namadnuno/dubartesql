import {MysqlTranslator} from "./translators/MysqlTranslator.ts";

export interface IWhere {
  field: string;
  operator: string;
  value: string | number;
}

export class QueryBuilder<T> {
  private _table: string;
  private _wheres: Array<IWhere>;
  private _isSingle: boolean;
  private _isCount: boolean;
  private _type: string; // insert | select | update | delete
  private _fieldsToUpdateOrInsert: any;
  private _selects: Array<string>;
  private db: any;

  constructor(tableName: string, db: any) {
    this._table = tableName;
    this.db = db;
    this._wheres = [];
    this._isSingle = false;
    this._type = "select";
    this._fieldsToUpdateOrInsert = [];
    this._selects = [];
    this._isCount = false;
  }

  single() {
    this._isSingle = true;
    return this;
  }

  count() {
    this._isCount = true;
    return this;
  }

  select(selects: Array<string>) {
    this._selects = selects;
    return this;
  }

  reset() {
    this._wheres = [];
    this._isSingle = false;
    this._type = "select";
    this._fieldsToUpdateOrInsert = [];
    this._isCount = false;
  }

  where(fieldOrFields: string, whereOperator: string, whereValue: string) {
    this._wheres.push({
      field: fieldOrFields,
      operator: whereOperator,
      value: whereValue,
    } as IWhere);

    return this;
  }

  delete() {
    this._type = "delete";
    return this;
  }

  update(fieldsToUpdate: T) {
    this._type = "update";
    this._fieldsToUpdateOrInsert = fieldsToUpdate;
    return this;
  }

  insert(fields: any) {
    this._type = "insert";
    this._fieldsToUpdateOrInsert = fields;
    return this;
  }

  sql(sql = "") {
    if (sql != "") {
      return sql;
    }

    return new MysqlTranslator<T>(this).translate();
  }

  query() {
    return this.sql();
  }

  isSingle(): boolean {
    return this._isSingle;
  }

  isCount(): boolean {
    return this._isCount;
  }

  get wheres(): Array<IWhere> {
    return this._wheres;
  }

  get type(): string {
    return this._type;
  }

  get selects(): Array<string> {
    return this._selects;
  }

  get fieldsToUpdateOrInsert(): any {
    return this._fieldsToUpdateOrInsert;
  }

  get table(): string {
    return this._table;
  }

  set wheres(value: Array<IWhere>) {
    this._wheres = value;
  }
}
