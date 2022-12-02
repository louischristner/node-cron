import mongoose from "mongoose";

const Event = mongoose.model('Event', new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: false,
  },
  dateFrom: {
    type: String,
    required: true,
  },
  dateTo: {
    type: String,
    required: true,
  },
  competitionId: {
    type: Number,
    required: false,
  },
  competition: {
    type: String,
    required: true,
  },
  sportId: {
    type: Number,
    required: false,
  },
  sport: {
    type: String,
    required: true,
  },
  continentId: {
    type: Number,
    required: false,
  },
  continent: {
    type: String,
    required: false,
  },
  dateModified: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  location: {
    type: [Object],
    required: true,
  },
}, { timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt' } }));

export default Event;