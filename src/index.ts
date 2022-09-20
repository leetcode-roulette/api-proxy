import { app } from "./app";
import { logger } from "./logger";
import { Database } from "./v1/db/db.config";

const serve = async () : Promise<void> => {
  const PORT = process.env.PORT || 3000;

  try {
    await Database.connect();
  } catch(e) {
    logger.error("Exception caught while trying to connect to database: " + e);
  }

  app.listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}`);
  });
}

serve();
