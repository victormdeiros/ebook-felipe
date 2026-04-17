const { sendEbookPurchaseEmail } = require("./email.js");

(async () => {
  try {
    await sendEbookPurchaseEmail(
      "contato@manualdoempregador.com.br",
      "Teste",
      "https://manualdoempregador.com.br/ebook.pdf"
    );
    console.log("ok");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
