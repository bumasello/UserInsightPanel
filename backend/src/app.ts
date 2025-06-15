import express from "express";
import cors from "cors";

import connectDb from "./database/connection";
import personRoutes from "./Routes/personRoutes";
import dataRoutes from "./Routes/dataRoutes";
import { errorHandler } from "./middleware/errorHandler";

class App {
  public app: express.Application;
  private port: number;

  constructor(port = 3001) {
    this.app = express();
    this.port = port;
    this.initDatabase();
    this.initMiddleware();
    this.initRoutes();
    this.initErrorHandler();
  }

  private async initDatabase(): Promise<void> {
    try {
      await connectDb();
    } catch (error) {
      console.error("Failed to connect to database: ", error);
    }
  }

  private initMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  private initRoutes(): void {
    this.app.get("/", (_req, res) => {
      res.json({
        message: "Torre Data Engineering API",
        version: "1.0.0",
        description:
          "Pipeline for collection, validation, and analysis of professional data",
        endpoints: {
          people: {
            search: "/api/people/search",
            profile: "/api/people/profile/:username",
          },
          data: {
            collectPeople: "/api/data/collect/people",
            collectProfiles: "/api/data/collect/profiles",
            collectPendingProfiles: "/api/data/collect/profiles/pending",
            pendingProfilesStatus: "/api/data/profiles/pending/status",
            processProfiles: "/api/data/process/profiles",
            insights: "/api/data/insights",
            stats: "/api/data/stats",
          },
        },
        features: [
          "Data collection from Torre API",
          "Validation with Zod",
          "Storage in MongoDB",
          "Data processing and analysis",
          "Data engineering pipeline",
        ],
      });
    });

    this.app.use("/api/people", personRoutes);
    this.app.use("/api/data", dataRoutes);
  }

  private initErrorHandler(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log("API on Air!");
    });
  }

  public getPort(): number {
    return this.port;
  }
}

export default App;
