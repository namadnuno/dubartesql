import {assertEquals, assertThrows, assertNotEquals} from "https://deno.land/std/testing/asserts.ts";
import {database, Model} from '../index.ts';
import {Connector} from "../Connector.ts";
import {TableCreator} from "../schema/TableCreator.ts";

interface IBook {
    title?: String
}

class Book extends Model<IBook> {
    constructor() {
        super('books');
    }
}

Deno.test("is required to connect before creating a model", () => {
    assertThrows(() => new Model<IBook>('test-table'));
});

Deno.test("the model class has access to the database connection after it connects", async () => {
    await database({
        db: 'test',
        hostname: '127.0.0.1',
        username: 'user',
        password: 'user',
    });


    const Books = new Model('test-table');
    assertEquals(Books.database, Connector.instance);
    Connector.drop();
});

Deno.test("a model can extend from a Model Class", async () => {
    const db = await database({
        db: 'test',
        hostname: '127.0.0.1',
        username: 'user',
        password: 'user',
    });

    const Books = new Book();
    assertEquals('books', Books.table);
    assertEquals('books', Books.tableName);
});
