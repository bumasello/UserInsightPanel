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
exports.PersonController = void 0;
const TorreApiService_1 = require("../services/TorreApiService");
class PersonController {
    constructor() {
        this.searchPeople = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, limit = 5 } = req.body;
                if (!query || typeof query !== "string") {
                    throw new Error("searchPeople: Query is mandatory and must be a string.");
                }
                const people = yield this.torreApiService.searchPeople(query, limit);
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
            }
            catch (error) {
                next(error);
            }
        });
        this.getProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                if (!username) {
                    throw new Error("Username is mandatory.");
                }
                const profile = yield this.torreApiService.getProfile(username);
                res.json({
                    success: true,
                    data: profile,
                    username,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.searchVerifiedPeople = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { query, limit = 5 } = req.body;
                if (!query || typeof query !== "string") {
                    throw new Error("searchVerifiedPeople: Query is mandatory and must be a string.");
                }
                const people = yield this.torreApiService.searchVerifiedPeople(query, limit);
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
            }
            catch (error) {
                next(error);
            }
        });
        this.torreApiService = new TorreApiService_1.TorreApiService();
    }
}
exports.PersonController = PersonController;
