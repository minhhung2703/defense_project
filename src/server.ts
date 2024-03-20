import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";

const app = express();
const port = Number(process.env.PORT) || 3000;

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL: ${cms.getAdminURL()}`);
      },
    },
  });

  app.use((req, res) => nextHandler(req, res));
  nextApp.prepare().then(() => {
    payload.logger.info(`Nextjs started`);
    app.listen(port, async () => {
      payload.logger.info(
        `NextJs App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
      console.log(`Server started at http://localhost:${port}`);
    });
  });
};

start();
