import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";

const app = express();
const port = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({});

export type Context = Awaited<ReturnType<typeof createContext>>;

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

  //routes
  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
    })
  );

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
