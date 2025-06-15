"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
class Person {
    constructor(data) {
        this.ardaId = data.ardaId;
        this.ggId = data.ggId;
        this.name = data.name;
        this.username = data.username;
        this.professionalHeadline = data.professionalHeadline;
        this.imageUrl = data.imageUrl;
        this.completion = data.completion;
        this.verified = data.verified;
        this.pageRank = data.pageRank;
    }
    // getter
    getDisplayName() {
        return this.name;
    }
    getProfileUrl() {
        return `https://torre.ai/${this.username}`;
    }
    hasImage() {
        return this.imageUrl !== null;
    }
    getCompletionPercentage() {
        return Math.round(this.completion * 100);
    }
    isVerified() {
        return this.verified;
    }
    toJSON() {
        return {
            ardaId: this.ardaId,
            ggId: this.ggId,
            name: this.name,
            comparableName: this.name.toLowerCase(),
            username: this.username,
            professionalHeadline: this.professionalHeadline,
            imageUrl: this.imageUrl,
            completion: this.completion,
            grammar: 0,
            weight: 0,
            verified: this.verified,
            connections: [],
            totalStrength: 0,
            pageRank: this.pageRank,
            organizationId: null,
            organizationNumericId: null,
            publicId: null,
            status: null,
            creators: [],
            relationDegree: 1,
            isSearchable: true,
            contact: false,
        };
    }
}
exports.Person = Person;
