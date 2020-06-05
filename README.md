# Dubartesql

> Deno + Mysql

## Objective
The object I have for this module is to provide a simple way to communicate with an MYSQL database, using an interface similar to [Knexjs](https://knexjs.org/).

## Examples:

### Database connection:

(database.ts)
```ts
import { database } from "https://deno.land/x/dubartesql/mod.ts";

const db = database({
  hostname: "127.0.0.1",
  db: "<db>",
  username: "root",
  password: "root",
});
await db.connect();

export default db;
``` 

### Creating a migration file:

(migate.ts)
```ts
import db from './database.js';

await db.schema.createTable("books", (table: any) => {
  table.increments("id", true);
  table.string("cover");
  table.string("title");
  table.string("ASIN");
  table.string("publisher");
  table.string("creator");
  table.string("language");
  table.string("path");
  table.timestamps(true, true);
});
```

### Creating a model:

(models.ts)
```ts
import { Model } from "https://deno.land/x/dubartesql/mod.ts";
import db from './database.js';
import { IBook } from './types.d.ts';

export const Books = new Model<IBook>('books', db);
```

### Database Communication:
```ts
import { Books } from './models.ts';
import {IBook} from "./types.d.ts";

const book : IBook = {
    title: 'test',
    path: 'test',
}

const createdBook = await Books.create(book);
console.log(createdBook); // { id: 1, title: 'test', path: 'test', ...}
console.log(await Books.get()); // [{ ... }, {...}, ...]
console.log(await Books.where('id', createdBook.id).get());
console.log(await Books.find(createdBook.id)); // {...} : IBook
console.log(await Books.where('id', createdBook.id).delete()); // boolean
console.log(await Books.updateById(createdBook.id, {
    ASIN: 'asin-xpto'
})); // { ... ASIN: 'asin-xpto', ...}
```

## Future
I would want to add the following features in the future:
- Unit Tests
- Improving migrations
- Relationships between tables
- More engines
- Interface enhancements
- Code refactoring 

## Conclusion

This module is still in development so expect some features missing and bugs. Hopefully, in the next releases, it will have much more to offer. Right now it just works with some limitations.

