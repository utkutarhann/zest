
import { query } from './db';

const resetUsage = async () => {
    try {
        const email = 'utkutarhann@gmail.com';
        console.log(`Resetting daily usage limit for ${email}...`);

        const result = await query(
            'UPDATE users SET daily_usage_count = 0 WHERE email = $1 RETURNING *',
            [email]
        );

        if (result.rowCount === 0) {
            console.log('No user found with that email.');
        } else {
            console.log('Success! User updated:', result.rows[0]);
        }
    } catch (error) {
        console.error('Error resetting usage:', error);
    } finally {
        process.exit();
    }
};

resetUsage();
