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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("./database/connection"));
const personRoutes_1 = __importDefault(require("./Routes/personRoutes"));
const dataRoutes_1 = __importDefault(require("./Routes/dataRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
class App {
    constructor(port = 3001) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.initDatabase();
        this.initMiddleware();
        this.initRoutes();
        this.initErrorHandler();
    }
    initDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, connection_1.default)();
            }
            catch (error) {
                console.error("Failed to connect to database: ", error);
            }
        });
    }
    initMiddleware() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)());
    }
    initRoutes() {
        this.app.get("/", (_req, res) => {
            res.json({
                message: "Torre Data Engineering API",
                version: "1.0.0",
                description: "Pipeline de coleta, validação e análise de dados profissionais",
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
                    "Coleta de dados da API Torre",
                    "Validação com Zod",
                    "Armazenamento MongoDB",
                    "Processamento e análise de dados",
                    "Pipeline de engenharia de dados",
                ],
            });
        });
        this.app.use("/api/people", personRoutes_1.default);
        this.app.use("/api/data", dataRoutes_1.default);
    }
    initErrorHandler() {
        this.app.use(errorHandler_1.errorHandler);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("API on Air!");
        });
    }
    getPort() {
        return this.port;
    }
}
exports.default = App;
