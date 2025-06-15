import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";

export interface IProfileDocument extends Document {
  username: string;
  profileData: any;

  skills: string[];
  languages: string[];
  experienceYears: number;

  collectedAt: Date;
  processed: boolean;
}

const ProfileSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    profileData: {
      type: Schema.Types.Mixed,
      required: true,
    },

    skills: [String],
    languages: [String],
    experienceYears: {
      type: Number,
      default: 0,
    },

    collectedAt: {
      type: Date,
      default: Date.now,
    },
    processed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "profiles",
  },
);

// Índices básicos
ProfileSchema.index({ username: 1 });
ProfileSchema.index({ processed: 1 });

// Método para extrair skills básicos
ProfileSchema.methods.extractSkills = function () {
  const strengths = this.profileData.strengths || [];
  this.skills = strengths.slice(0, 10).map((s: any) => s.name);
  return this.skills;
};

// Método para extrair idiomas
ProfileSchema.methods.extractLanguages = function () {
  const languages = this.profileData.languages || [];
  this.languages = languages.map((l: any) => l.language);
  return this.languages;
};

export const ProfileModel = mongoose.model<IProfileDocument>(
  "Profile",
  ProfileSchema,
);
