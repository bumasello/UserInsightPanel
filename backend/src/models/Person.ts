import type { SearchPeopleResponse } from "../types";

export class Person {
  public readonly ardaId: number;
  public readonly ggId: string;
  public readonly name: string;
  public readonly username: string;
  public readonly professionalHeadline: string;
  public readonly imageUrl: string | null;
  public readonly completion: number;
  public readonly verified: boolean;
  public readonly pageRank: number;

  constructor(data: SearchPeopleResponse) {
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
  public getDisplayName(): string {
    return this.name;
  }

  public getProfileUrl(): string {
    return `https://torre.ai/${this.username}`;
  }

  public hasImage(): boolean {
    return this.imageUrl !== null;
  }

  public getCompletionPercentage(): number {
    return Math.round(this.completion * 100);
  }

  public isVerified(): boolean {
    return this.verified;
  }

  public toJSON(): SearchPeopleResponse {
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
