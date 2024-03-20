import path from "path";
// import dotenv from "dotenv";
import payload, { Payload } from "payload";
import type { InitOptions } from "payload/config";

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
// dotenv.config({ path: path.resolve(__dirname, "./env") });

/** Initialize a ceched on the global scope to store the client and a promise
 * If cached already exists, it will reuse it.
 * Otherwise, it initializes it with an empty "client" and "promise"
 */
let cached = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  };
}

interface Args {
  // Make all properties in <InitOptions> optional includes email,secret, express,...
  initOptions?: Partial<InitOptions>;
}

export const getPayloadClient = async ({
  initOptions,
}: Args = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is missing");
  }
  if (cached.client) {
    return cached.client;
  }
  if (!cached.promise) {
    cached.promise = payload.init({
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.express ? false : true,
      ...(initOptions || {}),
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e: unknown) {
    cached.promise = null;
    throw e;
  }
  return cached.client;
};
