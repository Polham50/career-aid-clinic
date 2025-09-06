import mongoose, { Schema, Document, Model } from 'mongoose';
import { CareerProfile as ICareerProfile } from '../types';

export interface ICareerProfileDocument extends Omit<ICareerProfile, '_id'>, Document {}

const HollandCodeSchema = new Schema({
    code: { type: String, required: true, enum: ['R', 'I', 'A', 'S', 'E', 'C'] },
    name: { type: String, required: true },
    description: { type: String, required: true },
}, { _id: false });

const CourseRecommendationSchema = new Schema({
    courseName: { type: String, required: true },
    olevelRequirements: { type: String, required: true },
    jambScoreRange: { type: String, required: true },
    utmeScoreRange: { type: String },
    institutions: [{ type: String }],
}, { _id: false });

const CareerSchema = new Schema({
    careerName: { type: String, required: true },
    description: { type: String, required: true },
    salaryRange: { type: String, required: true },
    requiredSkills: [{ type: String }],
    courseRecommendations: [CourseRecommendationSchema],
}, { _id: false });

const CareerProfileSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentDate: { type: Date, required: true, default: Date.now },
    topHollandCodes: [HollandCodeSchema],
    summary: { type: String, required: true },
    recommendedCareers: [CareerSchema],
}, {
    timestamps: true,
});

const CareerProfile: Model<ICareerProfileDocument> = mongoose.model<ICareerProfileDocument>('CareerProfile', CareerProfileSchema);

export default CareerProfile;