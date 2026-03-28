import { Book } from './models/index.js';
import fs from 'fs';
import path from 'path';

async function auditCovers() {
  try {
    const books = await Book.findAll();
    const results = [];
    const missing = [];
    
    for (const book of books) {
      if (!book.coverImageUrl) {
        missing.push({ id: book.id, title: book.title, error: 'No coverImageUrl defined' });
        continue;
      }
      
      const relativePath = book.coverImageUrl.startsWith('/') ? book.coverImageUrl.slice(1) : book.coverImageUrl;
      // Assuming Vite public folder is in the root's client/public
      const fullPath = path.join(process.cwd(), '..', 'client', 'public', relativePath);
      
      if (!fs.existsSync(fullPath)) {
        missing.push({ id: book.id, title: book.title, path: book.coverImageUrl, fullPath });
      } else {
        results.push({ id: book.id, title: book.title, path: book.coverImageUrl });
      }
    }
    
    console.log(`Found ${results.length} valid covers and ${missing.length} missing/invalid covers.`);
    if (missing.length > 0) {
      console.log('Missing/Invalid Covers Sample:');
      console.log(JSON.stringify(missing.slice(0, 20), null, 2));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

auditCovers();
