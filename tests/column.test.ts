import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import {database} from '../index.ts';
import Column from "../schema/Column.ts";
import {TableCreator} from "../schema/TableCreator.ts";

const db = await database({
    db: 'test',
    hostname: '127.0.0.1',
    username: 'user',
    password: 'user',
});

Deno.test("table supports increments", () => {
    const table = new TableCreator("test", db);
    table.increments('id');
    assertEquals(table.columns[0], new Column("id", 'int(11)').incrementable().asPrimaryKey());
});

Deno.test("table supports string", () => {
    const table = new TableCreator("test", db);
    table.string('string', 255);
    table.string('nullable_string', 255).nullable();
    assertEquals(table.columns[0], new Column("string", 'varchar(255)'));
    assertEquals(table.columns[1], new Column("nullable_string", 'varchar(255)').nullable());
});

Deno.test("table supports text", () => {
    const table = new TableCreator("test", db);
    table.text('text');
    assertEquals(table.columns[0], new Column("text", 'text'));
});

Deno.test("table supports dateTime", () => {
    const table = new TableCreator("test", db);
    table.dateTime('dateTime').default('NOW()');
    assertEquals(table.columns[0], new Column("dateTime", 'DATETIME').default('NOW()'));
});

Deno.test("table supports time", () => {
    const table = new TableCreator("test", db);
    table.time('time').default('11:00');
    assertEquals(table.columns[0], new Column("time", 'TIME').default('11:00'));
});

Deno.test("table supports timestamps", () => {
    const table = new TableCreator("test", db);
    table.timestamps(true, true);
    assertEquals(table.columns[0], new Column("created_at", 'TIMESTAMP').default('NOW()'));
    assertEquals(table.columns[1], new Column("updated_at", 'TIMESTAMP').withTrigger('UPDATE', 'NOW()'));
});

Deno.test("table supports timestamps with only created_at", () => {
    const table = new TableCreator("test", db);
    table.timestamps(true, false);
    assertEquals(table.columns[0], new Column("created_at", 'TIMESTAMP').default('NOW()'));
    assertEquals(table.columns[1], undefined);
});


Deno.test("column supports date", () => {
    const table = new TableCreator("test", db);
    table.date('date');
    assertEquals(table.columns[0], new Column("date", 'DATE'));
});

Deno.test("column supports bigInt", () => {
    const table = new TableCreator("test", db);
    table.bigInt('bigNumber');
    assertEquals(table.columns[0], new Column("bigInt", 'BIGINT'));
});

Deno.test("column supports boolean", () => {
    const table = new TableCreator("test", db);
    table.boolean('check');
    assertEquals(table.columns[0], new Column("check", 'BOOLEAN'));
});

Deno.test("column supports enum", () => {
    const table = new TableCreator("test", db);
    table.enum('types', ['number', 'string', 'float']);
    assertEquals(table.columns[0], new Column("types", `ENUM('number', 'string', 'float')`));
});

Deno.test("column supports float", () => {
    const table = new TableCreator("test", db);
    table.float('price').default('0.00');
    assertEquals(table.columns[0], new Column("price", `FLOAT`).default('0.00'));
});

Deno.test("column supports integer", () => {
    const table = new TableCreator("test", db);
    table.integer('x');
    assertEquals(table.columns[0], new Column("x", `int(11)`));
});

Deno.test("column supports json", () => {
    const table = new TableCreator("test", db);
    table.json('options');
    assertEquals(table.columns[0], new Column("options", `JSON`));
});

Deno.test("column accepts default value", () => {
    const table = new TableCreator("test", db);
    table.dateTime('created_at').default('NOW()');
    table.dateTime('start_time').default('2020-02-22 22:00');
    assertEquals(table.columns[0].toSqlString(), `created_at DATETIME NOT NULL DEFAULT NOW()`);
    assertEquals(table.columns[1].toSqlString(), `start_time DATETIME NOT NULL DEFAULT '2020-02-22 22:00'`);
});