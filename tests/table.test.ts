import {mock} from "https://raw.githubusercontent.com/allain/expect/master/mod.ts";
import {expect} from "https://raw.githubusercontent.com/allain/expect/master/expect.ts";
import {database} from '../index.ts';
import {TableCreator} from "../schema/TableCreator.ts";
import {Connector} from "../Connector.ts";

const db = await database({
    db: 'test',
    hostname: '127.0.0.1',
    username: 'user',
    password: 'user',
});

Deno.test("table is called with the right sql", () => {
    Connector.instance.client.execute = mock.fn();
    db.schema.createTable('test_table', (table: TableCreator) => {
        table.increments('id');
        table.string('title');
    });
    expect(Connector.instance.client.execute).toHaveBeenLastCalledWith(
        'CREATE TABLE test_table ( \n' +
        'id int(11) NOT NULL AUTO_INCREMENT, \n' +
        'title varchar(255) NOT NULL, \n' +
        'PRIMARY KEY (id) \n' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8;'
    );
    db.schema.removeTable('test_table');
});

