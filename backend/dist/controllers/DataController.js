"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataController = void 0;
const TorreApiService_1 = require("../services/TorreApiService");
const DataAnalysisService_1 = require("../services/DataAnalysisService");
const Person_1 = require("../models/mongoose/Person");
const Profile_1 = require("../models/mongoose/Profile");
class DataController {
    constructor() {
        this.collectPeople = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, limit = 20 } = req.body;
                if (!query || typeof query !== "string") {
                    throw new Error("collectPeople: Query is mandatory and must be a string.");
                }
                const people = yield this.torreApiService.searchPeople(query, limit);
                let saved = 0;
                let duplicates = 0;
                let errors = 0;
                for (const person of people) {
                    try {
                        const existingPerson = yield Person_1.PersonModel.findOne({
                            ardaId: person.ardaId,
                        });
                        if (existingPerson) {
                            duplicates++;
                        }
                        else {
                            yield Person_1.PersonModel.create({
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
                    }
                    catch (error) {
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
            }
            catch (error) {
                console.error(`Error at collectPeople: ${error}`);
                next(error);
            }
        });
        this.collectProfiles = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { usernames } = req.body;
                if (!usernames || !Array.isArray(usernames)) {
                    throw new Error("collectPeople: Query is mandatory and must be a string.");
                }
                let saved = 0;
                let duplicates = 0;
                let errors = 0;
                for (const username of usernames) {
                    try {
                        const existingProfile = yield Profile_1.ProfileModel.findOne({ username });
                        if (existingProfile) {
                            duplicates++;
                        }
                        const profileData = yield this.torreApiService.getProfile(username);
                        yield Profile_1.ProfileModel.create({
                            username,
                            profileData,
                            collectedAt: new Date(),
                            processed: false,
                        });
                        saved++;
                        yield new Promise((resolve) => setTimeout(resolve, 3000));
                    }
                    catch (error) {
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
            }
            catch (error) {
                console.error(`Error at collectProfiles: ${error}`);
                next(error);
            }
        });
        this.collectPendingProfiles = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const peopleWithoutProfiles = yield Person_1.PersonModel.aggregate([
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
                        const profileData = yield this.torreApiService.getProfile(person.username);
                        yield Profile_1.ProfileModel.create({
                            username: person.username,
                            profileData,
                            collectedAt: new Date(),
                            processed: false,
                        });
                        saved++;
                        yield new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                    catch (error) {
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
            }
            catch (error) {
                console.error("Error at collectPendingProfiles:", error);
                next(error);
            }
        });
        this.getPendingProfilesStatus = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [totalPeople, totalProfiles] = yield Promise.all([
                    Person_1.PersonModel.countDocuments(),
                    Profile_1.ProfileModel.countDocuments(),
                ]);
                const pendingProfiles = totalProfiles - totalPeople;
                res.json({
                    success: true,
                    data: {
                        totalPeople,
                        totalProfiles,
                        pendingProfiles,
                        completionRate: totalPeople > 0
                            ? Math.round((totalProfiles / totalPeople) * 100)
                            : 0,
                    },
                });
            }
            catch (error) {
                console.error("Error at getPendingProfilesStatus:", error);
                next(error);
            }
        });
        this.processProfiles = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const unprocessedProfiles = yield Profile_1.ProfileModel.find({ processed: false });
                let processed = 0;
                let errors = 0;
                for (const profile of unprocessedProfiles) {
                    try {
                        const strengths = profile.profileData.strengths || [];
                        const skills = strengths.slice(0, 10).map((s) => s.name);
                        const languages = profile.profileData.languages || [];
                        const languagesNames = languages.map((l) => l.language);
                        const experiences = profile.profileData.experiences || [];
                        let experienceYears = 0;
                        const currentyear = new Date().getFullYear();
                        experiences.forEach((exp) => {
                            if (exp.fromYear) {
                                const fromYear = Number.parseInt(exp.fromYear);
                                const toYear = exp.toYear === "Present"
                                    ? currentyear
                                    : Number.parseInt(exp.toYear || currentyear);
                                if (!Number.isNaN(fromYear) && !Number.isNaN(toYear)) {
                                    experienceYears += Math.max(0, toYear - fromYear);
                                }
                            }
                        });
                        yield Profile_1.ProfileModel.updateOne({ _id: profile._id }, {
                            skills,
                            languages: languagesNames,
                            experienceYears,
                            processed: true,
                        });
                        processed++;
                    }
                    catch (error) {
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
            }
            catch (error) {
                console.error(`Error at processProfiles: ${error}`);
                next(error);
            }
        });
        this.getInsights = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [topSkills, languageDistribution, seniorityDistribution, topProfiles, dataQuality, queryStats,] = yield Promise.all([
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
            }
            catch (error) {
                console.error(`Error at getInsights: ${error}`);
                next(error);
            }
        });
        this.getStats = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dataQuality = yield this.dataAnalysisService.getDataQualityMetrics();
                res.json({
                    success: true,
                    data: dataQuality,
                });
            }
            catch (error) {
                console.error(`Error at getStats: ${error}`);
                next(error);
            }
        });
        this.torreApiService = new TorreApiService_1.TorreApiService();
        this.dataAnalysisService = new DataAnalysisService_1.DataAnalysisService();
    }
}
exports.DataController = DataController;
