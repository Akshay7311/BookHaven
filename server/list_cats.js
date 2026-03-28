import { Category } from './models/index.js';

async function listCategories() {
  try {
    const cats = await Category.findAll();
    console.log(JSON.stringify(cats.map(c => ({ id: c.id, name: c.name })), null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listCategories();
