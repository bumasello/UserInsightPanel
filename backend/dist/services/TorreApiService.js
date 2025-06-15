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
exports.TorreApiService = void 0;
const Person_1 = require("../models/Person");
class TorreApiService {
    constructor() {
        this.baseUrl = "https://torre.ai/api";
    }
    searchPeople(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, limit = 5) {
            try {
                const searchRequest = {
                    query,
                    identityType: "person",
                    limit,
                    meta: true,
                    excludeContacts: true,
                };
                const response = yield fetch(`${this.baseUrl}/entities/_searchStream`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(searchRequest),
                });
                if (!response.ok) {
                    throw new Error(`Erro na API: ${response.status}`);
                }
                // stream
                const text = yield response.text();
                const lines = text.trim().split("\n");
                const people = [];
                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const data = JSON.parse(line);
                            const person = new Person_1.Person(data);
                            people.push(person);
                        }
                        catch (error) {
                            console.error("Erro ao processar linha:", error);
                        }
                    }
                }
                return people;
            }
            catch (error) {
                console.error("Erro ao buscar pessoas:", error);
                throw new Error("Falha ao buscar pessoas da API Torre");
            }
        });
    }
    getProfile(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}/genome/bios/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Usuário ${username} não encontrado`);
                    }
                    throw new Error(`Erro na API: ${response.status}`);
                }
                const data = (yield response.json());
                return data;
            }
            catch (error) {
                console.error(`Erro ao obter perfil de ${username}:`, error);
                throw error;
            }
        });
    }
    searchVerifiedPeople(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, limit = 5) {
            const allPeople = yield this.searchPeople(query, limit * 2);
            return allPeople.filter((person) => person.isVerified()).slice(0, limit);
        });
    }
    getMultipleProfiles(usernames) {
        return __awaiter(this, void 0, void 0, function* () {
            const profiles = [];
            for (const username of usernames) {
                try {
                    const profile = yield this.getProfile(username);
                    profiles.push(profile);
                    // pause
                    yield new Promise((resolve) => setTimeout(resolve, 1000));
                }
                catch (error) {
                    console.error(`Erro ao obter perfil de ${username}:`, error);
                }
            }
            return profiles;
        });
    }
}
exports.TorreApiService = TorreApiService;
