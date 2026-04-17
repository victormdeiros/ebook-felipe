import { pool } from "./src/db";
(async () => {
    try {
        await pool.query(`UPDATE ebookfelipelopes.manual_content SET whatsapp_number='558198590139' WHERE whatsapp_number='5581985900139'`);
        console.log('Updated db phone!');
    } catch(e) {
        console.error(e);
    } finally {
        await pool.end();
    }
})();