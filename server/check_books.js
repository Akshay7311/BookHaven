import { Book } from './models/index.js';

async function checkBooks() {
  try {
    const books = await Book.findAll({ limit: 10 });
    console.log(JSON.stringify(books.map(b => ({ id: b.id, title: b.title, coverImageUrl: b.coverImageUrl })), null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkBooks();
