import { query } from './db';

const setAdmin = async () => {
    const email = 'utkutarhann@gmail.com';
    try {
        const result = await query(`UPDATE users SET role = 'admin' WHERE email = $1 RETURNING *`, [email]);
        if (result.rows.length > 0) {
            console.log(`Successfully set ${email} as admin.`);
        } else {
            console.log(`User ${email} not found. Make sure they have logged in at least once.`);
        }
    } catch (error) {
        console.error('Error setting admin:', error);
    }
};

setAdmin();
