import config from "../config";
import { Request, Response, Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const playlist = path.resolve(__dirname, "../../src/routes/playlist.ts");
const music = path.resolve(__dirname, "../../src/routes/music.ts");
const user = path.resolve(__dirname, "../../src/routes/users.ts");
// const apiRoute = path.resolve(__dirname, "../../src/routes*.ts");
const apiSchema = path.resolve(__dirname, "../../src/model/*.ts");

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger API Documentation for Smooze App",
      version: "1.0.0",
      description: "Documenting various apis for Smooze App",
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerformat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    host: "localhost:7000",
    basePath: "/",
  },
  // apis: [apiRoute, apiSchema],
  apis: [apiSchema, playlist, music, user],
};

const swaggerSpec = swaggerJSDoc(options);

//
export const swaggerDocs = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at ${config.port}/${config.port}/api-docs`);
};
