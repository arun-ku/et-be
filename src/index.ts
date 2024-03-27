import express, { Express } from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import connectMongo from "./helpers/dbConnection";
import bootstrap from "./helpers/bootstrap";

declare global {
  namespace Express {
    interface Response {
      sendResponse: (code: string, data: any) => void;
    }
  }
}

const app: Express = express();
connectMongo();
app.use(bodyParser.json());
app.use(bootstrap);
routes(app);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
