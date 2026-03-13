import fs from 'fs';
import path from 'path';
import { User } from './models/index.js';

const exportUsers = async () => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'password', 'createdAt']
        });
        
        let output = "=== BOOKHAVEN REGISTERED USERS ===\n\n";
        
        users.forEach(u => {
            output += `Name:   ${u.name}\n`;
            output += `Email:  ${u.email}\n`;
            output += `Role:   ${u.role.toUpperCase()}\n`;
            output += `Password Hash: ${u.password}\n`;
            output += `Joined: ${new Date(u.createdAt).toLocaleDateString()}\n`;
            output += `ID:     ${u.id}\n`;
            output += `----------------------------------------\n`;
        });
        
        const filepath = path.resolve('../users_list.txt');
        fs.writeFileSync(filepath, output);
        console.log(`Successfully exported ${users.length} users to users_list.txt`);
        process.exit(0);
    } catch (err) {
        console.error("Failed to export users:", err);
        process.exit(1);
    }
};

exportUsers();
