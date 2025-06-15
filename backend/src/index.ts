import App from "./app";

import "dotenv/config";

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 3001;

const app = new App(PORT);

app.listen();
