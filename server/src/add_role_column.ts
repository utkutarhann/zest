import { query } from './db';

const migrate = async () => {
    try {
        await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';`);
        console.log('Successfully added role column to users table');
    } catch (error) {
        console.error('Error running migration:', error);
    }
};

migrate();
