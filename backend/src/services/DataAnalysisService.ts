import { PersonModel } from "../models/mongoose/Person";
import { ProfileModel } from "../models/mongoose/Profile";

export class DataAnalysisService {
  public async getTopSkills(
    limit = 10,
  ): Promise<Array<{ skill: string; count: number }>> {
    try {
      const profiles = await ProfileModel.find({ processed: true });
      const skillCount: { [key: string]: number } = {};

      profiles.forEach((profile) => {
        profile.skills.forEach((skill) => {
          skillCount[skill] = (skillCount[skill] || 0) + 1;
        });
      });

      return Object.entries(skillCount)
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error(`Error at getTopSkills: ${error}`);
      return [];
    }
  }

  public async getLanguagedistribution(): Promise<
    Array<{ language: string; count: number }>
  > {
    try {
      const profiles = await ProfileModel.find({ processed: true });
      const languageCount: { [key: string]: number } = {};

      profiles.forEach((profile) => {
        profile.languages.forEach((language) => {
          languageCount[language] = (languageCount[language] || 0) + 1;
        });
      });

      return Object.entries(languageCount)
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error(`Error at getLanguagedistribution: ${error}`);
      return [];
    }
  }

  public async getSeniorityDistribution(): Promise<{
    junior: number;
    mid: number;
    senior: number;
    lead: number;
  }> {
    try {
      const profiles = await ProfileModel.find({ processed: true });

      const distribution = {
        junior: 0,
        mid: 0,
        senior: 0,
        lead: 0,
      };

      profiles.forEach((profile) => {
        const years = profile.experienceYears;
        if (years <= 2) distribution.junior++;
        else if (years <= 5) distribution.mid++;
        else if (years <= 10) distribution.senior++;
        else distribution.lead++;
      });

      return distribution;
    } catch (error) {
      console.error(`Error at getSeniorityDistribution: ${error}`);
      return { junior: 0, mid: 0, senior: 0, lead: 0 };
    }
  }

  public async getTopCompletionProfiles(limit: number = 10): Promise<
    Array<{
      name: string;
      username: string;
      completion: number;
      verified: boolean;
    }>
  > {
    try {
      const people = await PersonModel.find()
        .sort({ completion: -1 })
        .limit(limit);

      return people.map((person) => ({
        name: person.name,
        username: person.username,
        completion: person.completion,
        verified: person.verified,
      }));
    } catch (error) {
      console.error(`Error to get top profiles: ${error}`);
      return [];
    }
  }

  public async getDataQualityMetrics(): Promise<{
    totalPeople: number;
    totalProfiles: number;
    verifiedPeople: number;
    processedProfiles: number;
    averageCompletion: number;
    verificationRate: number;
    processingRate: number;
  }> {
    try {
      const [
        totalPeople,
        totalProfiles,
        verifiedPeople,
        processedProfiles,
        avgCompletionResult,
      ] = await Promise.all([
        PersonModel.countDocuments(),
        ProfileModel.countDocuments(),
        PersonModel.countDocuments({ verified: true }),
        ProfileModel.countDocuments({ processed: true }),
        PersonModel.aggregate([
          { $group: { _id: null, avgCompletion: { $avg: "$completion" } } },
        ]),
      ]);

      const averageCompletion = avgCompletionResult[0]?.avgCompletion || 0;
      const verificationRate =
        totalPeople > 0 ? (verifiedPeople / totalPeople) * 100 : 0;
      const processingRate =
        totalProfiles > 0 ? (processedProfiles / totalProfiles) * 100 : 0;

      return {
        totalPeople,
        totalProfiles,
        verifiedPeople,
        processedProfiles,
        averageCompletion: Math.round(averageCompletion * 100),
        verificationRate: Math.round(verificationRate),
        processingRate: Math.round(processingRate),
      };
    } catch (error) {
      console.error(`Error at getDataQualityMetrics: ${error}`);
      return {
        totalPeople: 0,
        totalProfiles: 0,
        verifiedPeople: 0,
        processedProfiles: 0,
        averageCompletion: 0,
        verificationRate: 0,
        processingRate: 0,
      };
    }
  }

  public async getSearchQueryStats(): Promise<
    Array<{
      query: string;
      count: number;
      avgCompletion: number;
      verifiedCount: number;
    }>
  > {
    try {
      const stats = await PersonModel.aggregate([
        { $match: { searchQuery: { $exists: true, $ne: null } } },
        {
          $group: {
            _id: "$searchQuery",
            count: { $sum: 1 },
            avgCompletion: { $avg: "$completion" },
            verifiedCount: { $sum: { $cond: ["$verified", 1, 0] } },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      return stats.map((stat) => ({
        query: stat._id,
        count: stat.count,
        avgCompletion: Math.round(stat.avgCompletion * 100),
        verifiedCount: stat.verifiedCount,
      }));
    } catch (error) {
      console.error(`Error at getSearchQueryStats: ${error}`);
      return [];
    }
  }
}
