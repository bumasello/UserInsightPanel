import { TorreApiService } from "../services/TorreApiService";
import { DataAnalysisService } from "../services/DataAnalysisService";
import { PersonModel } from "../models/mongoose/Person";
import { ProfileModel } from "../models/mongoose/Profile";

import type { Request, Response, NextFunction } from "express";

export class DataController {
  private torreApiService: TorreApiService;
  private dataAnalysisService: DataAnalysisService;

  constructor() {
    this.torreApiService = new TorreApiService();
    this.dataAnalysisService = new DataAnalysisService();
  }

  public collectPeople = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { query, limit = 20 } = req.body;

      if (!query || typeof query !== "string") {
        throw new Error(
          "collectPeople: Query is mandatory and must be a string.",
        );
      }

      const people = await this.torreApiService.searchPeople(query, limit);

      let saved = 0;
      let duplicates = 0;
      let errors = 0;

      for (const person of people) {
        try {
          const existingPerson = await PersonModel.findOne({
            ardaId: person.ardaId,
          });

          if (existingPerson) {
            duplicates++;
          } else {
            await PersonModel.create({
              ardaId: person.ardaId,
              ggId: person.ggId,
              name: person.name,
              username: person.username,
              professionalHeadline: person.professionalHeadline,
              imageUrl: person.imageUrl,
              completion: person.completion,
              verified: person.verified,
              pageRank: person.pageRank,
              searchQuery: query,
              collectedAt: new Date(),
            });
            saved++;
          }
        } catch (error) {
          console.error(`Error creating person: ${error}`);
          errors++;
        }
      }

      res.json({
        success: true,
        message: "Collecting people finished.",
        result: {
          found: people.length,
          saved,
          duplicates,
          errors,
        },
        query,
      });
    } catch (error) {
      console.error(`Error at collectPeople: ${error}`);
      next(error);
    }
  };

  public collectProfiles = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { usernames } = req.body;

      if (!usernames || !Array.isArray(usernames)) {
        throw new Error(
          "collectPeople: Query is mandatory and must be a string.",
        );
      }

      let saved = 0;
      let duplicates = 0;
      let errors = 0;

      for (const username of usernames) {
        try {
          const existingProfile = await ProfileModel.findOne({ username });

          if (existingProfile) {
            duplicates++;
          }

          const profileData = await this.torreApiService.getProfile(username);

          await ProfileModel.create({
            username,
            profileData,
            collectedAt: new Date(),
            processed: false,
          });

          saved++;

          await new Promise((resolve) => setTimeout(resolve, 3000));
        } catch (error) {
          console.error(`Error collecting profile of ${username}: ${error}`);
          errors++;
        }
      }
      res.json({
        success: true,
        message: "Collecting profiles finished.",
        result: {
          requested: usernames.length,
          saved,
          duplicates,
          errors,
        },
      });
    } catch (error) {
      console.error(`Error at collectProfiles: ${error}`);
      next(error);
    }
  };

  public collectPendingProfiles = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const peopleWithoutProfiles = await PersonModel.aggregate([
        {
          $lookup: {
            from: "profiles",
            localField: "username",
            foreignField: "username",
            as: "profile",
          },
        },
        {
          $match: {
            profile: { $size: 0 },
          },
        },
        {
          $project: {
            username: 1,
            name: 1,
          },
        },
      ]);

      if (peopleWithoutProfiles.length === 0) {
        res.json({
          success: true,
          message: "All profiles have already been collected.",
          result: {
            pending: 0,
            saved: 0,
            errors: 0,
          },
        });
        return;
      }

      let saved = 0;
      let errors = 0;

      for (const person of peopleWithoutProfiles) {
        try {
          const profileData = await this.torreApiService.getProfile(
            person.username,
          );

          await ProfileModel.create({
            username: person.username,
            profileData,
            collectedAt: new Date(),
            processed: false,
          });

          saved++;

          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(error);
          errors++;
        }
      }

      res.json({
        success: true,
        message: "Pending profiles collection finished.",
        result: {
          pending: peopleWithoutProfiles.length,
          saved,
          errors,
        },
      });
    } catch (error) {
      console.error("Error at collectPendingProfiles:", error);
      next(error);
    }
  };

  public getPendingProfilesStatus = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const [totalPeople, totalProfiles] = await Promise.all([
        PersonModel.countDocuments(),
        ProfileModel.countDocuments(),
      ]);

      const pendingProfiles = totalProfiles - totalPeople;

      res.json({
        success: true,
        data: {
          totalPeople,
          totalProfiles,
          pendingProfiles,
          completionRate:
            totalPeople > 0
              ? Math.round((totalProfiles / totalPeople) * 100)
              : 0,
        },
      });
    } catch (error) {
      console.error("Error at getPendingProfilesStatus:", error);
      next(error);
    }
  };

  public processProfiles = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const unprocessedProfiles = await ProfileModel.find({ processed: false });

      let processed = 0;
      let errors = 0;

      for (const profile of unprocessedProfiles) {
        try {
          const strengths = profile.profileData.strengths || [];
          const skills = strengths.slice(0, 10).map((s: any) => s.name);

          const languages = profile.profileData.languages || [];
          const languagesNames = languages.map((l: any) => l.language);

          const experiences = profile.profileData.experiences || [];
          let experienceYears = 0;
          const currentyear = new Date().getFullYear();

          experiences.forEach((exp: any) => {
            if (exp.fromYear) {
              const fromYear = Number.parseInt(exp.fromYear);
              const toYear =
                exp.toYear === "Present"
                  ? currentyear
                  : Number.parseInt(exp.toYear || currentyear);
              if (!Number.isNaN(fromYear) && !Number.isNaN(toYear)) {
                experienceYears += Math.max(0, toYear - fromYear);
              }
            }
          });

          await ProfileModel.updateOne(
            { _id: profile._id },
            {
              skills,
              languages: languagesNames,
              experienceYears,
              processed: true,
            },
          );
          processed++;
        } catch (error) {
          console.error(`Error processing profiles: ${error}`);
          errors++;
        }
      }

      res.json({
        success: true,
        meessage: "Finished profile processing.",
        result: {
          found: unprocessedProfiles.length,
          processed,
          errors,
        },
      });
    } catch (error) {
      console.error(`Error at processProfiles: ${error}`);
      next(error);
    }
  };

  public getInsights = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const [
        topSkills,
        languageDistribution,
        seniorityDistribution,
        topProfiles,
        dataQuality,
        queryStats,
      ] = await Promise.all([
        this.dataAnalysisService.getTopSkills(10),
        this.dataAnalysisService.getLanguagedistribution(),
        this.dataAnalysisService.getSeniorityDistribution(),
        this.dataAnalysisService.getTopCompletionProfiles(5),
        this.dataAnalysisService.getDataQualityMetrics(),
        this.dataAnalysisService.getSearchQueryStats(),
      ]);

      res.json({
        success: true,
        data: {
          topSkills,
          languageDistribution,
          seniorityDistribution,
          topProfiles,
          dataQuality,
          queryStats,
        },
      });
    } catch (error) {
      console.error(`Error at getInsights: ${error}`);
      next(error);
    }
  };

  public getStats = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dataQuality =
        await this.dataAnalysisService.getDataQualityMetrics();

      res.json({
        success: true,
        data: dataQuality,
      });
    } catch (error) {
      console.error(`Error at getStats: ${error}`);
      next(error);
    }
  };
}
