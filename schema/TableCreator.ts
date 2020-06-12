import Column from "./Column.ts";

const creatorsDefinitions = {};

export class TableCreator {
  private _columns: any;
  private client: any;
  private table: string;

  constructor(table: string, client: any) {
    this.table = table;
    this._columns = [];
    this.client = client;
  }

  withNewColumn (column: Column) {
    this.addColumn(column);
    return column;
  }

  increments(name: string) {
    //sql.push(`PRIMARY KEY (${name})`);
    //this.addColumn(new Column(name, "int(11)").asPrimaryKey().incrementable())
    return this.withNewColumn(new Column(name, "int(11)").asPrimaryKey().incrementable());
  }

  string(name: string, length = 255) {
    return this.withNewColumn(new Column(name, `varchar(${length})`));
  }

  text(name: string) {
    return this.withNewColumn(new Column(name, `text`));
  }

  longText(name: string) {
    return this.withNewColumn(new Column(name, `LONGTEXT`));
  }

  dateTime(name: string) {
      return this.withNewColumn(new Column(name, 'DATETIME'));
  }

  time(name: string) {
      return this.withNewColumn(new Column(name, 'TIME'));
  }

  bigInt(name: string) {
    return this.withNewColumn(new Column("bigInt", 'BIGINT'));
  }

  boolean(name: string) {
    return this.withNewColumn(new Column(name, 'BOOLEAN'));
  }

  date(name: string) {
    return this.withNewColumn(new Column(name, 'DATE'));
  }

  enum(name: string, values: Array<string>) {
    return this.withNewColumn(new Column(name, `ENUM('${values.join("', '")}')`));
  }

  float(name: string) {
    return this.withNewColumn(new Column(name, `FLOAT`));
  }

  integer(name: string, length = 11) {
    return this.withNewColumn(new Column(name, `int(${length})`));
  }

  json(name: string, length = 11) {
    return this.withNewColumn(new Column(name, `JSON`));
  }

  timestamps(hasCreatedAt: boolean, hasUpdatedAt: boolean) {
    let sql: Array<string> = [];

    if (hasCreatedAt) {
      this.addColumn(new Column('created_at', 'TIMESTAMP').default('NOW()'));
    }
    if (hasUpdatedAt) {
      this.addColumn(new Column('updated_at', 'TIMESTAMP').withTrigger('UPDATE', 'NOW()'));
    }
  }

  getSqlColumns() {
    return this._columns.reduce((acc: any, col: any) => {
      return [...acc, ...col.toSqlString()];
    }, []);
  }

  async run() {
    let columnsSql = this.getSqlColumns();
    const sql = `
    CREATE TABLE ${this.table} (
      ${columnsSql.join(", \n")}
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`;
    console.log(sql);
    await this.client.execute(sql);
  }

  addColumn(col: any) {
    this._columns.push(col);
  }

  get columns(): any {
    return this._columns;
  }
}
