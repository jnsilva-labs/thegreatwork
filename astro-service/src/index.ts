import { app } from "./app";

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  // Keep startup log explicit for ops visibility.
  console.log(`astro-service listening on port ${port}`);
});
