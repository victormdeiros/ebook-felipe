import { createRequire } from "node:module";

// Root package is ESM, while the server build is CommonJS.
// Load the compiled entrypoint with an explicit extension, as Node does in
// production. Importing the extensionless TS source fails on Vercel.
const require = createRequire(import.meta.url);
const { default: app } = require("../server/dist/index.js");

export default app;
