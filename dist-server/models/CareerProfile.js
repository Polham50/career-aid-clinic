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
const mongoose_1 = __importStar(require("mongoose"));
const HollandCodeSchema = new mongoose_1.Schema({
    code: { type: String, required: true, enum: ['R', 'I', 'A', 'S', 'E', 'C'] },
    name: { type: String, required: true },
    description: { type: String, required: true },
}, { _id: false });
const CourseRecommendationSchema = new mongoose_1.Schema({
    courseName: { type: String, required: true },
    olevelRequirements: { type: String, required: true },
    jambScoreRange: { type: String, required: true },
    utmeScoreRange: { type: String },
    institutions: [{ type: String }],
}, { _id: false });
const CareerSchema = new mongoose_1.Schema({
    careerName: { type: String, required: true },
    description: { type: String, required: true },
    salaryRange: { type: String, required: true },
    requiredSkills: [{ type: String }],
    courseRecommendations: [CourseRecommendationSchema],
}, { _id: false });
const CareerProfileSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentDate: { type: Date, required: true, default: Date.now },
    topHollandCodes: [HollandCodeSchema],
    summary: { type: String, required: true },
    recommendedCareers: [CareerSchema],
}, {
    timestamps: true,
});
const CareerProfile = mongoose_1.default.model('CareerProfile', CareerProfileSchema);
exports.default = CareerProfile;
