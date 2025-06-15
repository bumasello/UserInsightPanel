import type { Request, Response, NextFunction } from "express";

import { TorreApiService } from "../services/TorreApiService";

export class PersonController {
  private torreApiService: TorreApiService;

  constructor() {
    this.torreApiService = new TorreApiService();
  }

  public searchPeople = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { query, limit = 5 } = req.body;

      if (!query || typeof query !== "string") {
        throw new Error(
          "searchPeople: Query is mandatory and must be a string.",
        );
      }

      const people = await this.torreApiService.searchPeople(query, limit);

      res.json({
        success: true,
        data: people.map((person) => ({
          ardaId: person.ardaId,
          name: person.name,
          username: person.username,
          professionalHeadline: person.professionalHeadline,
          imageUrl: person.imageUrl,
          completion: person.getCompletionPercentage(),
          verified: person.isVerified(),
          profileUrl: person.getProfileUrl(),
        })),
        count: people.length,
        query,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { username } = req.params;

      if (!username) {
        throw new Error("Username is mandatory.");
      }

      const profile = await this.torreApiService.getProfile(username);

      res.json({
        success: true,
        data: profile,
        username,
      });
    } catch (error) {
      next(error);
    }
  };

  public searchVerifiedPeople = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { query, limit = 5 } = req.body;

      if (!query || typeof query !== "string") {
        throw new Error(
          "searchVerifiedPeople: Query is mandatory and must be a string.",
        );
      }

      const people = await this.torreApiService.searchVerifiedPeople(
        query,
        limit,
      );

      res.json({
        success: true,
        data: people.map((person) => ({
          ardaId: person.ardaId,
          name: person.name,
          username: person.username,
          professionalHeadline: person.professionalHeadline,
          imageUrl: person.imageUrl,
          completion: person.getCompletionPercentage(),
          verified: person.isVerified(),
          profileUrl: person.getProfileUrl(),
        })),
        count: people.length,
        filter: "Verified Only",
      });
    } catch (error) {
      next(error);
    }
  };
}
