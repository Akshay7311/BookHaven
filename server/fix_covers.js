import { Book } from './models/index.js';
import fs from 'fs';
import path from 'path';

async function fixCovers() {
  try {
    const books = await Book.findAll();
    let fixedCount = 0;
    
    for (const book of books) {
      let isMissing = false;
      if (!book.coverImageUrl) {
        isMissing = true;
      } else {
        const relativePath = book.coverImageUrl.startsWith('/') ? book.coverImageUrl.slice(1) : book.coverImageUrl;
        const fullPath = path.join(process.cwd(), '..', 'client', 'public', relativePath);
        if (!fs.existsSync(fullPath)) {
          isMissing = true;
        }
      }
      
      if (isMissing) {
        book.coverImageUrl = '/covers/default.png';
        await book.save();
        fixedCount++;
      }
    }
    
    console.log(`Successfully fixed ${fixedCount} book covers.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixCovers();
