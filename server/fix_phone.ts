import { pool } from "./src/db";

async function fixWhatsAppNumber() {
  try {
    await pool.query(
      "UPDATE ebookfelipelopes.manual_content SET whatsapp_number = $1 WHERE whatsapp_number = $2",
      ["558198590139", "5581985900139"],
    );
    console.log("Updated DB");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

void fixWhatsAppNumber();
