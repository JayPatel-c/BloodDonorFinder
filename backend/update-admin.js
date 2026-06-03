const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

const updateAdmin = async () => {
    try {
        const hashedP = await bcrypt.hash('admin@123', 10);
        await pool.query('UPDATE admins SET password = ? WHERE email = ?', [hashedP, 'admin@bloodlink.in']);
        console.log('Successfully updated admin password to admin@123');
        process.exit(0);
    } catch(err) {
        console.error('Error updating admin: ', err);
        process.exit(1);
    }
}
updateAdmin();
