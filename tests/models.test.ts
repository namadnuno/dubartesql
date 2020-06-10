import { assertNotEquals, assertEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts";
import { Model, database } from '../index.ts';
import {Connector} from "../Connector.ts";

interface IBook {
    title?: String
}

Deno.test("is required to connect before creating a model", () => {
    assertThrows(() => new Model<IBook>('test-table'));
});

Deno.test("the model class has access to the database connection after it connects", async () => {
    const db = await database({
        db: 'test',
        hostname: '127.0.0.1',
        username: 'user',
        password: 'user',
    });
    const Book = new Model('test-table');
    assertEquals(Book.database, Connector.instance);
    Connector.drop();
});