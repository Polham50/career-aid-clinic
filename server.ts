// @ts-nocheck
// FIX: Replaced the express import to explicitly bring Request, Response, and NextFunction into the file's scope.
// This resolves type conflicts with global DOM types.
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import * as jwt from 'jsonwebtoken';
import mongoose, { Types } from 'mongoose';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { connectDB } from './db';
import User, { IUserDocument } from './models/User';
import CareerProfileModel, { ICareerProfileDocument } from './models/CareerProfile';
import { CareerProfile, ChatMessage, User as IUser } from './types';
import https from 'https';

dotenv.config();

const app = express();
const port = 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://careeraid.app';

app.use(cors());
app.use(express.json());

const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set. Please create a .env file and set it.");
}
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_PUBLIC_KEY || !PAYSTACK_SECRET_KEY) {
    console.error('\n--- 🚨 PAYMENT GATEWAY NOT CONFIGURED 🚨 ---');
    console.error('The Paystack API keys are missing from your .env file.');
    console.error('The payment button on the frontend will be disabled until you fix this.');
    console.error('\n>>> TROUBLESHOOTING CHECKLIST:');
    console.error('1. Make sure you have a file named ".env" in the root of your project.');
    console.error('2. Add the following lines to your .env file:');
    console.error('   PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxx');
    console.error('   PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxx');
    console.error('3. Replace with your actual keys from the Paystack dashboard.');
    console.error('4. IMPORTANT: You MUST restart the backend server after saving the .env file.');
    console.error('--------------------------------------------------\n');
}


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn("JWT_SECRET environment variable not set. Using a default, insecure secret for development.");
}
const jwtSecret = JWT_SECRET || 'your-default-insecure-secret-key-for-dev-only';


const ai = new GoogleGenAI({ apiKey });

// FIX: Updated AuthenticatedRequest to use the imported `Request` type from Express.
type AuthenticatedRequest = Request & {
    user?: {
        _id: string;
        role: string;
    };
};

interface LeanUserChild {
    _id: mongoose.Types.ObjectId;
    name: string;
}

// --- REAL EMAIL SERVICE with NODEMAILER (using Ethereal for dev) ---
let transporter: nodemailer.Transporter;

async function setupEthereal() {
    try {
        const testAccount = await nodemailer.createTestAccount();
        console.log('--- ETHEREAL TEST ACCOUNT (Fallback) ---');
        console.log('User:', testAccount.user);
        console.log('Pass:', testAccount.pass);
        console.log('-----------------------------');
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: { user: testAccount.user, pass: testAccount.pass },
        });
    } catch (error) {
        console.error("Failed to create Ethereal test account. Emails will not be sent.", error);
    }
}

async function setupEmailService() {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
    if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
        try {
            // FIX: Changed type of transportOptions to 'any' to resolve a TypeScript issue with complex union types in nodemailer.TransportOptions.
            let transportOptions: any;

            // Use Nodemailer's built-in robust configuration for Gmail
            if (EMAIL_HOST.toLowerCase() === 'smtp.gmail.com') {
                console.log('Detected Gmail SMTP host, using "service: gmail" configuration for better reliability.');
                transportOptions = {
                    service: 'gmail',
                    auth: {
                        user: EMAIL_USER,
                        pass: EMAIL_PASS,
                    },
                };
            } else {
                // Fallback to manual configuration for other email providers
                console.log('Using custom SMTP host configuration.');
                 if (!EMAIL_PORT) {
                    throw new Error("EMAIL_PORT is required for custom SMTP hosts.");
                }
                transportOptions = {
                    host: EMAIL_HOST,
                    port: parseInt(EMAIL_PORT, 10),
                    secure: parseInt(EMAIL_PORT, 10) === 465, // true for 465, false for other ports
                    auth: {
                        user: EMAIL_USER,
                        pass: EMAIL_PASS,
                    },
                };
            }
            
            transporter = nodemailer.createTransport(transportOptions);
            await transporter.verify();
            console.log('Production email service is configured and ready.');
        } catch (error) {
            console.error('--- ❌ FAILED TO CONFIGURE PRODUCTION EMAIL ❌ ---');
            console.error('The connection to the email server failed. This is common when deploying to hosting platforms that block standard email ports for security reasons.');
            console.error('See the full error details below:');
            console.error(error); // Log the full error object
            console.error('\n>>> TROUBLESHOOTING:');
            console.error('1. Check your .env variables (EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_PORT) are correct and loaded in your production environment.');
            console.error("2. If using Gmail, ensure you are using a 16-character 'App Password', not your regular password.");
            console.error("3. Check your email account for any 'Security Alert' emails from Google, and approve the sign-in attempt from your server's location.");
            console.error('4. Your hosting provider might be blocking the connection. Contact their support and ask if they allow outbound connections on port 465 or 587.');
            console.error('5. STRONGLY RECOMMENDED: For production, switch to a dedicated email service like SendGrid, Resend, or Mailgun. They are more reliable for application emails.');
            console.error('\nFalling back to Ethereal for now...');
            await setupEthereal();
        }
    } else {
        await setupEthereal();
    }
}


const sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
    if (!transporter) {
        console.error("Email transporter is not initialized. Cannot send email.");
        return;
    }
    try {
        const info = await transporter.sendMail({
            from: '"CareerAid Clinic" <noreply@careeraid.clinic>',
            to, subject, html,
        });
        console.log("Message sent: %s", info.messageId);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log('\n--- 📧 ETHEREAL EMAIL PREVIEW 📧 ---');
            console.log('Since production email is not configured, you can preview the sent email at the URL below:');
            console.log(previewUrl);
            console.log('-------------------------------------\n');
        }
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// --- CUSTOM EMAIL TEMPLATES ---

const generateStyledEmailHTML = (title: string, preheader: string, content: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin: 0; padding: 0; background-color: #f1f5f9; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
            .header { background-color: #0891b2; padding: 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
            .content { padding: 30px; color: #334155; line-height: 1.6; }
            .content h2 { color: #0f172a; margin-top: 0; }
            .button { display: inline-block; padding: 12px 24px; background-color: #06b6d4; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .link { word-break: break-all; color: #06b6d4; }
            .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
    </head>
    <body>
        <div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>
        <div class="container">
            <div class="header">
                <h1>CareerAid Clinic</h1>
            </div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} CareerAid Clinic. All rights reserved.</p>
                <p>Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const generateConfirmationEmailHTML = (name: string, url: string) => {
    const content = `
        <h2>Confirm Your Email Address</h2>
        <p>Hello ${name.split(' ')[0]},</p>
        <p>Thank you for registering with CareerAid Clinic. To complete your registration and start your career journey, please confirm your email address by clicking the button below.</p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="${url}" class="button">Confirm Email Address</a>
        </p>
        <p>If you're having trouble with the button, you can also copy and paste this link into your browser:</p>
        <p><a href="${url}" class="link">${url}</a></p>
        <p>This link will expire in one hour.</p>
        <p>Welcome aboard,<br>The CareerAid Clinic Team</p>
    `;
    return generateStyledEmailHTML('Confirm Your Email', 'Complete your registration with CareerAid Clinic.', content);
};

const generatePasswordResetEmailHTML = (name: string, url: string) => {
    const content = `
        <h2>Password Reset Request</h2>
        <p>Hello ${name.split(' ')[0]},</p>
        <p>We received a request to reset the password for your CareerAid Clinic account. If you did not make this request, you can safely ignore this email.</p>
        <p>To reset your password, please click the button below:</p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="${url}" class="button">Reset Your Password</a>
        </p>
        <p>If you're having trouble with the button, you can also copy and paste this link into your browser:</p>
        <p><a href="${url}" class="link">${url}</a></p>
        <p>This link is valid for one hour.</p>
        <p>Best regards,<br>The CareerAid Clinic Team</p>
    `;
    return generateStyledEmailHTML('Reset Your Password', 'Reset your CareerAid Clinic password.', content);
};


// Schemas
const profileSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A detailed but concise summary of the user's personality based on their answers, highlighting their key traits according to Holland Codes using markdown for bolding (e.g., `**Investigative**`)." },
        topHollandCodes: {
            type: Type.ARRAY,
            description: "An array of the top 3 Holland Code objects that best fit the user.",
            items: {
                type: Type.OBJECT,
                properties: {
                    code: { type: Type.STRING, description: "The Holland Code letter (R, I, A, S, E, or C)." },
                    name: { type: Type.STRING, description: "The full name of the Holland Code (e.g., Realistic, Investigative)." },
                    description: { type: Type.STRING, description: "A brief, one-sentence description of this personality type." }
                }
            }
        },
        recommendedCareers: {
            type: Type.ARRAY,
            description: "An array of 3 to 4 diverse career recommendations tailored to the Nigerian job market.",
            items: {
                type: Type.OBJECT,
                properties: {
                    careerName: { type: Type.STRING, description: "The name of the career." },
                    description: { type: Type.STRING, description: "A brief, single-sentence description of the career and why it fits the user's personality, using markdown for bolding key traits." },
                    salaryRange: { type: Type.STRING, description: "An estimated monthly salary range in Nigerian Naira (e.g., '₦150,000 - ₦350,000')." },
                    requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 5-7 key skills for this career." },
                    courseRecommendations: {
                        type: Type.ARRAY,
                        description: "A list of 1-2 relevant course recommendations for this career.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                courseName: { type: Type.STRING, description: "The name of the university course (e.g., 'B.Sc. Computer Science')." },
                                olevelRequirements: { type: Type.STRING, description: "A summary of required O'Level subjects (e.g., '5 credits including Maths, English, Physics')." },
                                jambScoreRange: { type: Type.STRING, description: "A typical JAMB score range for this course (e.g., '240-280')." },
                                utmeScoreRange: { type: Type.STRING, description: "A typical Post-UTME score range if applicable (e.g., '60-75')." },
                                institutions: {type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 recommended Nigerian institutions (Universities, Polytechnics, etc.)."},
                            }
                        }
                    }
                }
            }
        }
    }
};

const interviewQuestionsSchema = {
    type: Type.ARRAY,
    description: "A list of exactly 5 interview questions, mixing behavioral, technical, and situational types.",
    items: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING, description: "The type of question. Must be one of: 'Behavioral', 'Technical', or 'Situational'." },
            question: { type: Type.STRING, description: "The interview question text." }
        }
    }
};

// --- AUTH MIDDLEWARE ---
// FIX: Updated to use imported Express types.
const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, jwtSecret) as { _id: string; role: string; iat: number; exp: number };
        req.user = { _id: decoded._id, role: decoded.role };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};


// --- API ENDPOINTS ---
// FIX: Updated to use imported Express types.
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Server is running and healthy.' });
});

// FIX: Updated to use imported Express types.
app.get('/api/payment-config', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    console.log("✅ [API] GET /api/payment-config triggered.");
    const keyExists = !!PAYSTACK_PUBLIC_KEY;
    console.log(`[API] Server check: PAYSTACK_PUBLIC_KEY is ${keyExists ? `present (pk_...${PAYSTACK_PUBLIC_KEY.slice(-4)})` : 'MISSING'}.`);
    
    if (!keyExists) {
        console.error("❌ [CRITICAL] Paystack public key not found in the environment when requested by the frontend. The payment form will not work. Ensure .env is loaded correctly and the server was restarted after changes.");
        return res.status(500).json({ message: 'Payment gateway is not configured on the server. Administrator has been notified.' });
    }
    res.json({ publicKey: PAYSTACK_PUBLIC_KEY });
});

// --- AUTH & USER ENDPOINTS ---
// FIX: Updated to use imported Express types.
app.post('/api/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, classLevel, schoolName, schoolAddress, centreName, centreAddress } = req.body;
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }
        
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = new User({ 
            name, 
            email: email.toLowerCase(), 
            password, 
            role,
            classLevel,
            schoolName,
            schoolAddress,
            centreName,
            centreAddress,
            verificationToken,
            verificationTokenExpires: new Date(Date.now() + 3600000) // 1 hour
        });
        await user.save();

        const verificationUrl = `${FRONTEND_URL}/#/confirm?token=${verificationToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Confirm Your Email Address',
            html: generateConfirmationEmailHTML(user.name, verificationUrl)
        });

        const userResponse = user.toObject();
        // @ts-ignore
        delete userResponse.password;

        res.status(201).json({ user: userResponse, token: verificationToken });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// FIX: Updated to use imported Express types.
app.post('/api/confirm-email', async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.json({ message: 'Email confirmed successfully!' });
    } catch (error) {
        console.error("Confirmation error:", error);
        res.status(500).json({ message: 'Server error during email confirmation.' });
    }
});

// FIX: Updated to use imported Express types.
app.post('/api/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email address before logging in.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: '7d' }
        );

        const userResponse = user.toObject();
        delete userResponse.password;
        if (user.school) {
            (userResponse as any).isSchoolSponsored = true;
        }

        res.json({ user: userResponse, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// FIX: Updated to use imported Express types.
app.post('/api/student-login', async (req: Request, res: Response) => {
    try {
        const { name, accessCode } = req.body;
        const user = await User.findOne({ name, accessCode: accessCode.toUpperCase() });

        if (!user) {
            return res.status(401).json({ message: 'Invalid name or access code.' });
        }
        
        if (user.status === 'Pending') {
            user.status = 'Active';
            await user.save();
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: '7d' }
        );

        const userResponse = user.toObject();
        delete userResponse.password;
        (userResponse as any).isSchoolSponsored = true;


        res.json({ user: userResponse, token });
    } catch (error) {
        console.error("Student login error:", error);
        res.status(500).json({ message: 'Server error during student login.' });
    }
});

// FIX: Updated to use imported Express types.
app.get('/api/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(400).json({ message: "User ID not found in token" });
        }
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const userResponse = user.toObject();
        if (user.school) {
            (userResponse as any).isSchoolSponsored = true;
        }
        res.json(userResponse);
    } catch (error) {
        console.error("Error fetching user profile (/api/me):", error);
        res.status(500).json({ message: "Server error fetching user profile." });
    }
});

// FIX: Updated to use imported Express types.
app.post('/api/forgot-password', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Note: Not revealing if user exists for security reasons
            return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();
        
        const resetUrl = `${FRONTEND_URL}/#/reset?token=${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: generatePasswordResetEmailHTML(user.name, resetUrl)
        });

        res.json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: 'Server error during forgot password process.' });
    }
});

// FIX: Updated to use imported Express types.
app.post('/api/reset-password', async (req: Request, res: Response) => {
     try {
        const { token, password } = req.body;
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token.' });
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
});

// FIX: Updated to use imported Express types.
app.get('/api/profiles/:userId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { userId } = req.params;
        if (req.user?._id !== userId && req.user?.role !== 'Parent/Guardian') {
             return res.status(403).json({ message: "You are not authorized to view these profiles." });
        }
        const profiles = await CareerProfileModel.find({ user: userId }).sort({ assessmentDate: -1 });
        res.json(profiles);
    } catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ message: 'Server error fetching profiles.' });
    }
});

// --- PARENT/CHILD ENDPOINTS ---
// FIX: Updated to use imported Express types.
app.get('/api/children', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const parentId = req.user?._id;
        const children = await User.find({ parent: parentId }).lean() as unknown as (LeanUserChild & { _id: Types.ObjectId })[];

        const childrenIds = children.map(c => c._id);
        const profiles = await CareerProfileModel.find({ user: { $in: childrenIds } }).sort({ assessmentDate: -1 }).lean() as unknown as (ICareerProfileDocument & { user: Types.ObjectId, _id: Types.ObjectId })[];

        const childrenWithProfiles = children.map(child => {
            const childProfiles = profiles
                .filter(p => p.user.toString() === child._id.toString())
                .map(p => ({ ...p, _id: p._id.toString(), user: p.user.toString() }));
            return {
                _id: child._id.toString(),
                name: child.name,
                profiles: childProfiles.slice(0, 1),
            };
        });
        
        res.json(childrenWithProfiles);
    } catch (error) {
        console.error("Error fetching children:", error);
        res.status(500).json({ message: 'Server error while fetching children data.' });
    }
});

// FIX: Updated to use imported Express types.
app.post('/api/children', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const parentId = req.user?._id;
        const parent = await User.findById(parentId);
        if (!parent || parent.role !== 'Parent/Guardian') {
            return res.status(403).json({ message: 'User is not authorized to add children.' });
        }
        
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Child name is required.' });
        }

        const childrenCount = await User.countDocuments({ parent: parentId });
        
        if (!parent.isSubscribed && childrenCount >= 1) {
            return res.status(403).json({ message: 'Upgrade to a premium plan to add more than one child.' });
        }
        if (parent.isSubscribed && childrenCount >= 5) {
            return res.status(403).json({ message: 'You have reached the maximum of 5 children for your premium plan.' });
        }
        
        const pseudoEmail = `${parentId}-${Date.now()}@child.careeraid.local`;
        
        const child = new User({
            name,
            email: pseudoEmail,
            password: crypto.randomBytes(16).toString('hex'),
            role: 'Student',
            parent: parentId,
            isVerified: true
        });
        
        await child.save();
        
        const childResponse = child.toObject();
        delete childResponse.password;
        
        res.status(201).json(childResponse);

    } catch (error) {
        console.error("Error adding child:", error);
        res.status(500).json({ message: 'Server error while adding child.' });
    }
});

// --- SCHOOL ADMIN ENDPOINTS ---
// FIX: Updated to use imported Express types.
app.get('/api/school/students', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const schoolId = req.user?._id;
        const students = await User.find({ school: schoolId }).select('name classLevel accessCode status').sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        console.error("Error fetching school students:", error);
        res.status(500).json({ message: 'Server error while fetching students.' });
    }
});

// FIX: Updated to use imported Express types.
app.post('/api/school/students', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const schoolId = req.user?._id;
        const school = await User.findById(schoolId);
        if (!school || (school.role !== 'School Administrator' && school.role !== 'JAMB CBT Centre')) {
            return res.status(403).json({ message: 'User is not authorized to add students.' });
        }
        
        const { name, classLevel } = req.body;
        if (!name || !classLevel) {
            return res.status(400).json({ message: 'Student name and class level are required.' });
        }
        
        const accessCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        
        const student = new User({
            name,
            classLevel,
            email: `${schoolId}-${Date.now()}@student.careeraid.local`,
            password: crypto.randomBytes(16).toString('hex'),
            role: 'Student',
            school: schoolId,
            accessCode,
            isVerified: true,
            status: 'Pending',
        });
        
        await student.save();
        
        res.status(201).json({
            _id: student._id,
            name: student.name,
            classLevel: student.classLevel,
            accessCode: student.accessCode,
            status: student.status
        });

    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ message: 'Server error while adding student.' });
    }
});

// --- PAYMENT ENDPOINT ---
// FIX: Updated to use imported Express types.
app.post('/api/verify-payment', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    if (!PAYSTACK_SECRET_KEY) {
        return res.status(500).json({ success: false, message: 'Payment processor is not configured on the server.' });
    }
    const userId = req.user?._id;
    const { reference } = req.body;

    if (!userId || !reference) {
        return res.status(400).json({ success: false, message: 'User ID and transaction reference are required.' });
    }

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${encodeURIComponent(reference)}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
    };

    const apiReq = https.request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', (chunk) => {
            data += chunk;
        });
        apiRes.on('end', async () => {
            try {
                const responseData = JSON.parse(data);
                if (responseData.status && responseData.data.status === 'success') {
                    const user = await User.findById(userId);
                    if (user) {
                        user.isSubscribed = true;
                        await user.save();
                        return res.json({ success: true, message: 'Payment verified and subscription activated.' });
                    } else {
                        return res.status(404).json({ success: false, message: 'User not found after payment verification.' });
                    }
                } else {
                    return res.status(400).json({ success: false, message: responseData.message || 'Payment verification failed.' });
                }
            } catch (parseError) {
                console.error('Paystack verification - JSON parse error:', parseError);
                return res.status(500).json({ success: false, message: 'Error parsing response from payment gateway.' });
            }
        });
    });

    apiReq.on('error', (error) => {
        console.error('Paystack verification - HTTPS request error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred during payment verification.' });
    });

    apiReq.end();
});

// --- GEMINI ENDPOINTS ---
// FIX: Updated to use imported Express types.
app.post('/api/profile', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { answers, childId } = req.body;
    const loggedInUser = req.user;

    if (!loggedInUser) {
        return res.status(401).json({ message: "Unauthorized: No logged-in user found." });
    }
    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Assessment answers are required.' });
    }

    let userIdForProfile: string;
    const user = await User.findById(loggedInUser._id);
    if (!user) return res.status(404).json({ message: 'Logged in user not found' });
    
    if (user.role === "Parent/Guardian") {
        if (!childId) {
            return res.status(400).json({ message: "childId is required for parents taking assessments." });
        }
        const child: IUserDocument | null = await User.findOne({ _id: childId, parent: user._id });
        if (!child) {
            return res.status(403).json({ message: "You are not authorized to perform this action for this child." });
        }
        userIdForProfile = child.id;
    } else {
        userIdForProfile = user.id;
    }
    
    const prompt = `As an expert career counselor for Nigerian students, analyze these answers: ${answers.join(', ')}. Generate a profile adhering to the schema.`;
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: profileSchema, temperature: 0.5 } });
        const profileData = JSON.parse(response.text || '{}');
        const { summary, recommendedCareers } = profileData;
        if (!summary || typeof summary !== 'string' || summary.length < 10) { throw new Error("The AI model returned an invalid personality summary. Please try again."); }
        if (!recommendedCareers || !Array.isArray(recommendedCareers) || recommendedCareers.length === 0) { throw new Error("The AI model was unable to generate career recommendations from your answers. This can happen during periods of high demand. We encourage you to try the assessment again in a moment."); }

        const newProfile = new CareerProfileModel({ ...profileData, user: userIdForProfile, assessmentDate: new Date().toISOString() });
        await newProfile.save();
        res.status(201).json(newProfile);

    } catch (error) {
        console.error("Error generating career profile:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to communicate with the AI model.";
        res.status(500).json({ message: errorMessage });
    }
});

// FIX: Updated to use imported Express types.
app.post('/api/interview-questions', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { careerName } = req.body;
    if (!careerName) {
        return res.status(400).json({ message: 'Career name is required.' });
    }
    const prompt = `Generate a list of mock interview questions for a '${careerName}' role in Nigeria. Adhere to the JSON schema.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: interviewQuestionsSchema }
        });
        res.json(JSON.parse(response.text || '[]'));
    } catch (error) {
        console.error(`Error fetching interview questions for ${careerName}:`, error);
        res.status(500).json({ message: "Failed to generate interview questions." });
    }
});

// FIX: Updated to use imported Express types.
app.post('/api/interview-feedback', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { question, answer } = req.body;
    if (!question || !answer) {
        return res.status(400).json({ message: 'Question and answer are required.' });
    }
    const prompt = `Act as an interview coach. Question: "${question}". Answer: "${answer}". Provide concise, constructive feedback as a simple HTML string with a positive comment, a <ul> list for improvements, and an encouraging closing sentence.`;
    try {
        const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
        res.send(response.text || '');
    } catch (error) {
        console.error(`Error fetching interview feedback:`, error);
        res.status(500).json({ message: "Failed to generate feedback." });
    }
});

// FIX: Updated to use imported Express types.
app.post('/api/chat', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const runChat = async () => {
        try {
            const { profile, messages } = req.body as { profile: CareerProfile; messages: ChatMessage[] };
            const history = [
                { role: "user", parts: [{text: `My career profile: ${JSON.stringify(profile)}`}] },
                { role: "model", parts: [{text: `Got it! I'm ready to answer questions about your profile.`}] }
            ];

            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction: "You are 'CareerAid Bot', a friendly career counselor for Nigerian students. Use the provided profile to answer questions concisely." },
                history,
            });

            const lastMessage = messages[messages.length - 1];
            if (!lastMessage || lastMessage.role !== 'user') throw new Error("Last message must be from the user.");
            
            const stream = await chat.sendMessageStream({ message: lastMessage.text });
            for await (const chunk of stream) {
                if (chunk.text) {
                    res.write(`data: ${JSON.stringify(chunk.text)}\n\n`);
                }
            }
        } catch (err) {
            console.error("Chat stream error:", err);
        } finally {
            res.write('event: end\ndata: {}\n\n');
            res.end();
        }
    };
    runChat();
});

const startServer = async () => {
  await setupEmailService();
  await connectDB();
  app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
  });
};

startServer();