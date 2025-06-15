import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";

export interface IPersonDocument extends Document {
  ardaId: number;
  ggId: string;
  name: string;
  username: string;
  professionalHeadline: string;
  imageUrl?: string;
  completion: number;
  verified: boolean;
  pageRank: number;

  collectedAt: Date;
  searchQuery?: string;
}

const PersonSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
    collection: "people",
  },
);

// indices basicos
PersonSchema.index({ ardaId: 1 });
PersonSchema.index({ username: 1 });
PersonSchema.index({ name: 1 });
PersonSchema.index({ verified: 1 });

// metodos básicos
PersonSchema.methods.getCompletionPercentage = function (): string {
  return `${Math.round(this.completion * 100)}%`;
};

PersonSchema.methods.getProfileUrl = function (): string {
  return `https://torre.ai/${this.username}`;
};

// metodo estatico para buscar por nome
PersonSchema.statics.findByName = function (name: string) {
  return this.find({
    name: { $regex: name, $options: "i" },
  });
};

// metodo estatico para buscar verificados
PersonSchema.statics.findVerified = function () {
  return this.find({ verified: true });
};

export const PersonModel = mongoose.model<IPersonDocument>(
  "Person",
  PersonSchema,
);
