import { Person } from "../models/Person";

import type {
  SearchPeopleRequest,
  SearchPeopleResponse,
  GenomeResponse,
} from "../types";

export class TorreApiService {
  private readonly baseUrl: string = "https://torre.ai/api";

  public async searchPeople(query: string, limit = 5): Promise<Person[]> {
    try {
      const searchRequest: SearchPeopleRequest = {
        query,
        identityType: "person",
        limit,
        meta: true,
        excludeContacts: true,
      };

      const response = await fetch(`${this.baseUrl}/entities/_searchStream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchRequest),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      // stream
      const text = await response.text();
      const lines = text.trim().split("\n");

      const people: Person[] = [];

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data: SearchPeopleResponse = JSON.parse(line);
            const person = new Person(data);
            people.push(person);
          } catch (error) {
            console.error("Error processing line:", error);
          }
        }
      }

      return people;
    } catch (error) {
      console.error("Error searching people:", error);
      throw new Error("Failed to search people from Torre API.");
    }
  }

  public async getProfile(username: string): Promise<GenomeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/genome/bios/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User ${username} not found.`);
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = (await response.json()) as GenomeResponse;
      return data;
    } catch (error) {
      console.error(`Error retrieving profile for ${username}:`, error);
      throw error;
    }
  }

  public async searchVerifiedPeople(
    query: string,
    limit = 5,
  ): Promise<Person[]> {
    const allPeople = await this.searchPeople(query, limit * 2);
    return allPeople.filter((person) => person.isVerified()).slice(0, limit);
  }

  public async getMultipleProfiles(
    usernames: string[],
  ): Promise<GenomeResponse[]> {
    const profiles: GenomeResponse[] = [];

    for (const username of usernames) {
      try {
        const profile = await this.getProfile(username);
        profiles.push(profile);

        // pause
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error retrieving profile for ${username}:`, error);
      }
    }

    return profiles;
  }
}
