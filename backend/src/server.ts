import { createApp } from "./app.js";
import { env } from "./utils/env.js";

const app = createApp();

app.listen(env.port, () => {
  console.log(`KB Support Assistant API listening on port ${env.port}`);
});
