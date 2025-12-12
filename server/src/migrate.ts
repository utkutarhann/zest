import { query } from './db';
import fs from 'fs';
import path from 'path';

const runMigration = async () => {
    try {
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await query(schema);
        console.log('Migration completed successfully');
    } catch (err) {
        console.error('Migration failed:', err);
    }
};

runMigration();
