import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import { sequelize, User, Book, Category } from './models/index.js';

dotenv.config();

const __dirname = path.resolve();
const COVERS_DIR = path.join(__dirname, '../client/public/covers');

const downloadImage = async (url, filepath) => {
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (!response.ok) return null;
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filepath, buffer);
        return filepath;
    } catch (err) {
        return null;
    }
};

const getFantasyBooks = async () => {
    try {
        const res = await fetch('https://openlibrary.org/subjects/fantasy.json?limit=100', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await res.json();
        const books = [];
        for (const work of data.works) {
            if (work.cover_id) {
                books.push({
                    title: work.title,
                    author: work.authors && work.authors.length > 0 ? work.authors[0].name : "Unknown Author",
                    cat: "Fiction",
                    img: `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
                });
            }
        }
        return books;
    } catch (e) {
        console.error("OpenLibrary fetch failed");
        return [];
    }
};

const seedDatabase = async () => {
    try {
        // Completely drop and recreate the raw database to avoid ANY legacy table collisions
        const rootConn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });
        await rootConn.query('DROP DATABASE IF EXISTS bookhaven_db;');
        await rootConn.query('CREATE DATABASE bookhaven_db;');
        await rootConn.end();

        await sequelize.authenticate();
        
        // Force sync for seeding new UUID schema
        await sequelize.sync({ force: true });
        
        console.log('Database completely reset and synced for seeding.');

        // 1. Seed Admins
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('bookhaven123', salt); // Default password

        await User.bulkCreate([
            { name: 'Store Admin', email: 'admin@bookhaven.com', password: hashedPassword, role: 'admin' },
            { name: 'Store Owner', email: 'owner@bookhaven.com', password: hashedPassword, role: 'admin' },
            { name: 'Test User', email: 'user@example.com', password: hashedPassword, role: 'user' }
        ]);
        console.log('Admin accounts generated.');

        if (!fs.existsSync(COVERS_DIR)) {
            fs.mkdirSync(COVERS_DIR, { recursive: true });
        }

        const baseBooks = [
            { title: "Reverend Insanity", author: "Gu Zhen Ren", cat: "Web Novel", img: "https://i.pinimg.com/736x/d6/18/d5/d618d598b96add4a5113bd8525b6510e.jpg" },
            { title: "Shadow Slave", author: "Guiltythree", cat: "Web Novel", img: "https://i.pinimg.com/736x/8f/c9/2c/8fc92cfacebb8498f3b06320092284c0.jpg" },
            { title: "Lord of the Mysteries", author: "Cuttlefish That Loves Diving", cat: "Web Novel", img: "https://m.media-amazon.com/images/I/515q7I3hD7L.jpg" },
            { title: "The Beginning After The End", author: "TurtleMe", cat: "Comic", img: "https://m.media-amazon.com/images/I/81P3NrdqR9L.jpg" },
            { title: "Solo Leveling", author: "Chugong", cat: "Manga", img: "https://m.media-amazon.com/images/I/71uHWg+fGML.jpg" },
            { title: "Omniscient Reader's Viewpoint", author: "Sing Shong", cat: "Web Novel", img: "https://m.media-amazon.com/images/I/71k4vP2E17L.jpg" },
            { title: "Mother of Learning", author: "Nobody103", cat: "Web Novel", img: "https://m.media-amazon.com/images/I/91nEqA+P2EL.jpg" },
            { title: "Fullmetal Alchemist, Vol. 1", author: "Hiromu Arakawa", cat: "Manga", img: "https://m.media-amazon.com/images/I/81xUeA9r6oL.jpg" },
            { title: "The Alchemist", author: "Paulo Coelho", cat: "Fiction", img: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg" }
        ];

        const openLibBooks = await getFantasyBooks();
        let booksData = [...baseBooks];
        for(const b of openLibBooks) {
            if(booksData.length < 100) booksData.push(b);
        }

        // 2. Generate Categories First
        console.log('Generating Category mappings...');
        const uniqueCategories = [...new Set(booksData.map(b => b.cat))];
        const categoryMap = new Map(); // string Name -> UUID
        
        for (const catName of uniqueCategories) {
            const cat = await Category.create({ name: catName, description: `${catName} collection` });
            categoryMap.set(catName, cat.id);
        }

        let addedCount = 0;
        const urlMap = new Map();

        console.log('Downloading covers and seeding DB with Sequelize UUIDs...');
        
        const booksToCreate = [];
        for (const book of booksData) {
            const price = (Math.random() * (1200 - 150) + 150).toFixed(2);
            const stock = Math.floor(Math.random() * 50) + 5;
            const desc = `An epic ${book.cat.toLowerCase()} story. Discover the profound depths and incredible journey of ${book.title}. Filled with adventure, mysteries, and unforgettable moments.`;
            
            let localUrl = `/covers/default.jpg`;

            if (!urlMap.has(book.img)) {
                const filename = `cover_${addedCount}.jpg`;
                const filepath = path.join(COVERS_DIR, filename);
                const dl = await downloadImage(book.img, filepath);
                if (dl) {
                    localUrl = `/covers/${filename}`;
                    urlMap.set(book.img, localUrl);
                }
            } else {
                localUrl = urlMap.get(book.img);
            }

            booksToCreate.push({
                title: book.title,
                author: book.author,
                description: desc,
                price: price,
                coverImageUrl: localUrl,
                categoryId: categoryMap.get(book.cat) || null,
                stock: stock
            });
            addedCount++;
        }

        // Use array chunking for insert efficiency
        await Book.bulkCreate(booksToCreate, { validate: true, individualHooks: true });
        
        console.log(`Successfully seeded ${addedCount} distinct books!`);
        process.exit(0);

    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
};

seedDatabase();
