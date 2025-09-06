import mongoose, { Schema, Document, Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User as IUser } from '../types';

// FIX: Omit 'id' from IUser to prevent conflict with Mongoose Document's 'id' virtual property.
export interface IUserDocument extends Omit<IUser, '_id' | 'id' | 'password'>, Document {
    password?: string;
    isVerified: boolean;
    isSubscribed: boolean;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    passwordResetToken?: string;
    passwordResetTokenExpires?: Date;
    accessCode?: string;
    school?: mongoose.Types.ObjectId;
    status: 'Pending' | 'Active';
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // Select false by default
    role: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'User', index: true },

    // School & Student specific fields
    school: { type: Schema.Types.ObjectId, ref: 'User', index: true },
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
        transform: function(doc, ret: any) {
            delete ret.__v;
            ret.id = ret._id;
            // FIX: Do NOT delete ret._id, as the frontend relies on it.
        }
    }
});

// Hash password before saving
UserSchema.pre<IUserDocument>('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        // Handle potential error from bcrypt
        next(err as Error);
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const user = await mongoose.model('User').findOne({ _id: this._id }).select('+password');
    if (!user || !user.password) return false;
    return bcrypt.compare(candidatePassword, user.password);
};

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);

export default User;