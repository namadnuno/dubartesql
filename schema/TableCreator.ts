const creatorsDefinitions = {};

export class TableCreator {
  public columns: any;
  private client: any;
  private table: string;

  constructor(table: string, client: any) {
    this.table = table;
    this.columns = [];
    this.client = client;
  }

  increments(name: string, primary = true) {
    let sql = [`${name} int(11) NOT NULL AUTO_INCREMENT`];

    if (primary) {
      sql.push(`PRIMARY KEY (${name})`);
    }

    this.addColumn({
      name,
      sql,
    });
  }

  string(name: string, length = 255, nullable = false) {
    this.addColumn({
      name,
      type: "varchar",
      length,
      sql: [`${name} varchar(${length}) ${nullable ? "NOT NULL" : ""}`],
    });
  }

  timestamps(hasCreatedAt: boolean, hasUpdatedAt: boolean) {
    let sql: Array<string> = [];

    if (hasCreatedAt) {
      sql.push(`created_at timestamp NOT NULL DEFAULT now()`);
    }
    if (hasUpdatedAt) {
      sql.push(`updated_at timestamp NOT NULL DEFAULT now() ON UPDATE now()`);
    }

    this.addColumn({
      type: "timestamps",
      hasCreatedAt,
      hasUpdatedAt,
      sql: sql,
    });
  }

  getSqlColumns() {
    return this.columns.reduce((acc: any, col: any) => {
      return [...acc, ...col.sql];
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
    this.columns.push(col);
  }
}
