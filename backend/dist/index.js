"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("dotenv/config");
const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 3001;
const app = new app_1.default(PORT);
console.log(app.getPort());
app.listen();
