"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PersonSchema = new mongoose_1.Schema({
    ardaId: {
        type: Number,
        required: true,
        unique: true,
    },
    ggId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    professionalHeadline: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: null,
    },
    completion: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false,
    },
    pageRank: {
        type: Number,
        required: true,
        min: 0,
    },
    // Metadados
    collectedAt: {
        type: Date,
        default: Date.now,
    },
    searchQuery: {
        type: String,
    },
}, {
    timestamps: true,
    collection: "people",
});
// indices basicos
PersonSchema.index({ ardaId: 1 });
PersonSchema.index({ username: 1 });
PersonSchema.index({ name: 1 });
PersonSchema.index({ verified: 1 });
// metodos básicos
PersonSchema.methods.getCompletionPercentage = function () {
    return `${Math.round(this.completion * 100)}%`;
};
PersonSchema.methods.getProfileUrl = function () {
    return `https://torre.ai/${this.username}`;
};
// metodo estatico para buscar por nome
PersonSchema.statics.findByName = function (name) {
    return this.find({
        name: { $regex: name, $options: "i" },
    });
};
// metodo estatico para buscar verificados
PersonSchema.statics.findVerified = function () {
    return this.find({ verified: true });
};
exports.PersonModel = mongoose_1.default.model("Person", PersonSchema);
