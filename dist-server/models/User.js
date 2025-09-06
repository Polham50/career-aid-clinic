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
const bcrypt = __importStar(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // Select false by default
    role: { type: String, required: true },
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    // School & Student specific fields
    school: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true },
    accessCode: { type: String, unique: true, sparse: true, select: false },
    status: { type: String, enum: ['Pending', 'Active'], default: 'Pending' },
    // Role-specific fields
    classLevel: { type: String },
    schoolName: { type: String },
    schoolAddress: { type: String },
    centreName: { type: String },
    centreAddress: { type: String },
    // Verification and reset fields
    isVerified: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    verificationTokenExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetTokenExpires: { type: Date, select: false },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.__v;
            ret.id = ret._id;
            // FIX: Do NOT delete ret._id, as the frontend relies on it.
        }
    }
});
// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (err) {
        // Handle potential error from bcrypt
        next(err);
    }
});
// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const user = await mongoose_1.default.model('User').findOne({ _id: this._id }).select('+password');
    if (!user || !user.password)
        return false;
    return bcrypt.compare(candidatePassword, user.password);
};
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
