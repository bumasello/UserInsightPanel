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
exports.DataAnalysisService = void 0;
const Person_1 = require("../models/mongoose/Person");
const Profile_1 = require("../models/mongoose/Profile");
class DataAnalysisService {
    getTopSkills() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            try {
                const profiles = yield Profile_1.ProfileModel.find({ processed: true });
                const skillCount = {};
                profiles.forEach((profile) => {
                    profile.skills.forEach((skill) => {
                        skillCount[skill] = (skillCount[skill] || 0) + 1;
                    });
                });
                return Object.entries(skillCount)
                    .map(([skill, count]) => ({ skill, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, limit);
            }
            catch (error) {
                console.error(`Error at getTopSkills: ${error}`);
                return [];
            }
        });
    }
    getLanguagedistribution() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profiles = yield Profile_1.ProfileModel.find({ processed: true });
                const languageCount = {};
                profiles.forEach((profile) => {
                    profile.languages.forEach((language) => {
                        languageCount[language] = (languageCount[language] || 0) + 1;
                    });
                });
                return Object.entries(languageCount)
                    .map(([language, count]) => ({ language, count }))
                    .sort((a, b) => b.count - a.count);
            }
            catch (error) {
                console.error(`Error at getLanguagedistribution: ${error}`);
                return [];
            }
        });
    }
    getSeniorityDistribution() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profiles = yield Profile_1.ProfileModel.find({ processed: true });
                const distribution = {
                    junior: 0,
                    mid: 0,
                    senior: 0,
                    lead: 0,
                };
                profiles.forEach((profile) => {
                    const years = profile.experienceYears;
                    if (years <= 2)
                        distribution.junior++;
                    else if (years <= 5)
                        distribution.mid++;
                    else if (years <= 10)
                        distribution.senior++;
                    else
                        distribution.lead++;
                });
                return distribution;
            }
            catch (error) {
                console.error(`Error at getSeniorityDistribution: ${error}`);
                return { junior: 0, mid: 0, senior: 0, lead: 0 };
            }
        });
    }
    getTopCompletionProfiles() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            try {
                const people = yield Person_1.PersonModel.find()
                    .sort({ completion: -1 })
                    .limit(limit);
                return people.map((person) => ({
                    name: person.name,
                    username: person.username,
                    completion: person.completion,
                    verified: person.verified,
                }));
            }
            catch (error) {
                console.error(`Erro ao obter top profiles: ${error}`);
                return [];
            }
        });
    }
    getDataQualityMetrics() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const [totalPeople, totalProfiles, verifiedPeople, processedProfiles, avgCompletionResult,] = yield Promise.all([
                    Person_1.PersonModel.countDocuments(),
                    Profile_1.ProfileModel.countDocuments(),
                    Person_1.PersonModel.countDocuments({ verified: true }),
                    Profile_1.ProfileModel.countDocuments({ processed: true }),
                    Person_1.PersonModel.aggregate([
                        { $group: { _id: null, avgCompletion: { $avg: "$completion" } } },
                    ]),
                ]);
                const averageCompletion = ((_a = avgCompletionResult[0]) === null || _a === void 0 ? void 0 : _a.avgCompletion) || 0;
                const verificationRate = totalPeople > 0 ? (verifiedPeople / totalPeople) * 100 : 0;
                const processingRate = totalProfiles > 0 ? (processedProfiles / totalProfiles) * 100 : 0;
                return {
                    totalPeople,
                    totalProfiles,
                    verifiedPeople,
                    processedProfiles,
                    averageCompletion: Math.round(averageCompletion * 100),
                    verificationRate: Math.round(verificationRate),
                    processingRate: Math.round(processingRate),
                };
            }
            catch (error) {
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
        });
    }
    getSearchQueryStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield Person_1.PersonModel.aggregate([
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
            }
            catch (error) {
                console.error(`Error at getSearchQueryStats: ${error}`);
                return [];
            }
        });
    }
}
exports.DataAnalysisService = DataAnalysisService;
