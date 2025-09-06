"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
// FIX: Replaced the express import to explicitly bring Request, Response, and NextFunction into the file's scope.
// This resolves type conflicts with global DOM types.
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
var crypto_1 = require("crypto");
var nodemailer_1 = require("nodemailer");
var jwt = require("jsonwebtoken");
var genai_1 = require("@google/genai");
var db_1 = require("./db");
var User_1 = require("./models/User");
var CareerProfile_1 = require("./models/CareerProfile");
var https_1 = require("https");
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = 3001;
var FRONTEND_URL = process.env.FRONTEND_URL || 'http://careeraid.app';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set. Please create a .env file and set it.");
}
var PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
var PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
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
var JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn("JWT_SECRET environment variable not set. Using a default, insecure secret for development.");
}
var jwtSecret = JWT_SECRET || 'your-default-insecure-secret-key-for-dev-only';
var ai = new genai_1.GoogleGenAI({ apiKey: apiKey });
// --- REAL EMAIL SERVICE with NODEMAILER (using Ethereal for dev) ---
var transporter;
function setupEthereal() {
    return __awaiter(this, void 0, void 0, function () {
        var testAccount, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, nodemailer_1.default.createTestAccount()];
                case 1:
                    testAccount = _a.sent();
                    console.log('--- ETHEREAL TEST ACCOUNT (Fallback) ---');
                    console.log('User:', testAccount.user);
                    console.log('Pass:', testAccount.pass);
                    console.log('-----------------------------');
                    transporter = nodemailer_1.default.createTransport({
                        host: "smtp.ethereal.email",
                        port: 587,
                        secure: false,
                        auth: { user: testAccount.user, pass: testAccount.pass },
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to create Ethereal test account. Emails will not be sent.", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function setupEmailService() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, transportOptions, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = process.env, EMAIL_HOST = _a.EMAIL_HOST, EMAIL_PORT = _a.EMAIL_PORT, EMAIL_USER = _a.EMAIL_USER, EMAIL_PASS = _a.EMAIL_PASS;
                    if (!(EMAIL_HOST && EMAIL_USER && EMAIL_PASS)) return [3 /*break*/, 6];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 5]);
                    transportOptions = void 0;
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
                    }
                    else {
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
                    transporter = nodemailer_1.default.createTransport(transportOptions);
                    return [4 /*yield*/, transporter.verify()];
                case 2:
                    _b.sent();
                    console.log('Production email service is configured and ready.');
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _b.sent();
                    console.error('--- ❌ FAILED TO CONFIGURE PRODUCTION EMAIL ❌ ---');
                    console.error('The connection to the email server failed. This is common when deploying to hosting platforms that block standard email ports for security reasons.');
                    console.error('See the full error details below:');
                    console.error(error_2); // Log the full error object
                    console.error('\n>>> TROUBLESHOOTING:');
                    console.error('1. Check your .env variables (EMAIL_HOST, EMAIL_USER, EMAIL_PASS, EMAIL_PORT) are correct and loaded in your production environment.');
                    console.error("2. If using Gmail, ensure you are using a 16-character 'App Password', not your regular password.");
                    console.error("3. Check your email account for any 'Security Alert' emails from Google, and approve the sign-in attempt from your server's location.");
                    console.error('4. Your hosting provider might be blocking the connection. Contact their support and ask if they allow outbound connections on port 465 or 587.');
                    console.error('5. STRONGLY RECOMMENDED: For production, switch to a dedicated email service like SendGrid, Resend, or Mailgun. They are more reliable for application emails.');
                    console.error('\nFalling back to Ethereal for now...');
                    return [4 /*yield*/, setupEthereal()];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, setupEthereal()];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
var sendEmail = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var info, previewUrl, error_3;
    var to = _b.to, subject = _b.subject, html = _b.html;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!transporter) {
                    console.error("Email transporter is not initialized. Cannot send email.");
                    return [2 /*return*/];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail({
                        from: '"CareerAid Clinic" <noreply@careeraid.clinic>',
                        to: to,
                        subject: subject,
                        html: html,
                    })];
            case 2:
                info = _c.sent();
                console.log("Message sent: %s", info.messageId);
                previewUrl = nodemailer_1.default.getTestMessageUrl(info);
                if (previewUrl) {
                    console.log('\n--- 📧 ETHEREAL EMAIL PREVIEW 📧 ---');
                    console.log('Since production email is not configured, you can preview the sent email at the URL below:');
                    console.log(previewUrl);
                    console.log('-------------------------------------\n');
                }
                return [3 /*break*/, 4];
            case 3:
                error_3 = _c.sent();
                console.error("Error sending email:", error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// --- CUSTOM EMAIL TEMPLATES ---
var generateStyledEmailHTML = function (title, preheader, content) {
    return "\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>".concat(title, "</title>\n        <style>\n            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin: 0; padding: 0; background-color: #f1f5f9; }\n            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }\n            .header { background-color: #0891b2; padding: 20px; text-align: center; }\n            .header h1 { color: #ffffff; margin: 0; font-size: 24px; }\n            .content { padding: 30px; color: #334155; line-height: 1.6; }\n            .content h2 { color: #0f172a; margin-top: 0; }\n            .button { display: inline-block; padding: 12px 24px; background-color: #06b6d4; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }\n            .link { word-break: break-all; color: #06b6d4; }\n            .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }\n        </style>\n    </head>\n    <body>\n        <div style=\"display: none; max-height: 0; overflow: hidden;\">").concat(preheader, "</div>\n        <div class=\"container\">\n            <div class=\"header\">\n                <h1>CareerAid Clinic</h1>\n            </div>\n            <div class=\"content\">\n                ").concat(content, "\n            </div>\n            <div class=\"footer\">\n                <p>&copy; ").concat(new Date().getFullYear(), " CareerAid Clinic. All rights reserved.</p>\n                <p>Please do not reply to this email.</p>\n            </div>\n        </div>\n    </body>\n    </html>\n    ");
};
var generateConfirmationEmailHTML = function (name, url) {
    var content = "\n        <h2>Confirm Your Email Address</h2>\n        <p>Hello ".concat(name.split(' ')[0], ",</p>\n        <p>Thank you for registering with CareerAid Clinic. To complete your registration and start your career journey, please confirm your email address by clicking the button below.</p>\n        <p style=\"text-align: center; margin: 30px 0;\">\n            <a href=\"").concat(url, "\" class=\"button\">Confirm Email Address</a>\n        </p>\n        <p>If you're having trouble with the button, you can also copy and paste this link into your browser:</p>\n        <p><a href=\"").concat(url, "\" class=\"link\">").concat(url, "</a></p>\n        <p>This link will expire in one hour.</p>\n        <p>Welcome aboard,<br>The CareerAid Clinic Team</p>\n    ");
    return generateStyledEmailHTML('Confirm Your Email', 'Complete your registration with CareerAid Clinic.', content);
};
var generatePasswordResetEmailHTML = function (name, url) {
    var content = "\n        <h2>Password Reset Request</h2>\n        <p>Hello ".concat(name.split(' ')[0], ",</p>\n        <p>We received a request to reset the password for your CareerAid Clinic account. If you did not make this request, you can safely ignore this email.</p>\n        <p>To reset your password, please click the button below:</p>\n        <p style=\"text-align: center; margin: 30px 0;\">\n            <a href=\"").concat(url, "\" class=\"button\">Reset Your Password</a>\n        </p>\n        <p>If you're having trouble with the button, you can also copy and paste this link into your browser:</p>\n        <p><a href=\"").concat(url, "\" class=\"link\">").concat(url, "</a></p>\n        <p>This link is valid for one hour.</p>\n        <p>Best regards,<br>The CareerAid Clinic Team</p>\n    ");
    return generateStyledEmailHTML('Reset Your Password', 'Reset your CareerAid Clinic password.', content);
};
// Schemas
var profileSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        summary: { type: genai_1.Type.STRING, description: "A detailed but concise summary of the user's personality based on their answers, highlighting their key traits according to Holland Codes using markdown for bolding (e.g., `**Investigative**`)." },
        topHollandCodes: {
            type: genai_1.Type.ARRAY,
            description: "An array of the top 3 Holland Code objects that best fit the user.",
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    code: { type: genai_1.Type.STRING, description: "The Holland Code letter (R, I, A, S, E, or C)." },
                    name: { type: genai_1.Type.STRING, description: "The full name of the Holland Code (e.g., Realistic, Investigative)." },
                    description: { type: genai_1.Type.STRING, description: "A brief, one-sentence description of this personality type." }
                }
            }
        },
        recommendedCareers: {
            type: genai_1.Type.ARRAY,
            description: "An array of 3 to 4 diverse career recommendations tailored to the Nigerian job market.",
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    careerName: { type: genai_1.Type.STRING, description: "The name of the career." },
                    description: { type: genai_1.Type.STRING, description: "A brief, single-sentence description of the career and why it fits the user's personality, using markdown for bolding key traits." },
                    salaryRange: { type: genai_1.Type.STRING, description: "An estimated monthly salary range in Nigerian Naira (e.g., '₦150,000 - ₦350,000')." },
                    requiredSkills: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING }, description: "A list of 5-7 key skills for this career." },
                    courseRecommendations: {
                        type: genai_1.Type.ARRAY,
                        description: "A list of 1-2 relevant course recommendations for this career.",
                        items: {
                            type: genai_1.Type.OBJECT,
                            properties: {
                                courseName: { type: genai_1.Type.STRING, description: "The name of the university course (e.g., 'B.Sc. Computer Science')." },
                                olevelRequirements: { type: genai_1.Type.STRING, description: "A summary of required O'Level subjects (e.g., '5 credits including Maths, English, Physics')." },
                                jambScoreRange: { type: genai_1.Type.STRING, description: "A typical JAMB score range for this course (e.g., '240-280')." },
                                utmeScoreRange: { type: genai_1.Type.STRING, description: "A typical Post-UTME score range if applicable (e.g., '60-75')." },
                                institutions: { type: genai_1.Type.ARRAY, items: { type: genai_1.Type.STRING }, description: "A list of 3-5 recommended Nigerian institutions (Universities, Polytechnics, etc.)." },
                            }
                        }
                    }
                }
            }
        }
    }
};
var interviewQuestionsSchema = {
    type: genai_1.Type.ARRAY,
    description: "A list of exactly 5 interview questions, mixing behavioral, technical, and situational types.",
    items: {
        type: genai_1.Type.OBJECT,
        properties: {
            type: { type: genai_1.Type.STRING, description: "The type of question. Must be one of: 'Behavioral', 'Technical', or 'Situational'." },
            question: { type: genai_1.Type.STRING, description: "The interview question text." }
        }
    }
};
// --- AUTH MIDDLEWARE ---
// FIX: Updated to use imported Express types.
var authMiddleware = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }
    var token = authHeader.split(' ')[1];
    try {
        var decoded = jwt.verify(token, jwtSecret);
        req.user = { _id: decoded._id, role: decoded.role };
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};
// --- API ENDPOINTS ---
// FIX: Updated to use imported Express types.
app.get('/api/health', function (req, res) {
    res.json({ status: 'ok', message: 'Server is running and healthy.' });
});
// FIX: Updated to use imported Express types.
app.get('/api/payment-config', authMiddleware, function (req, res) {
    console.log("✅ [API] GET /api/payment-config triggered.");
    var keyExists = !!PAYSTACK_PUBLIC_KEY;
    console.log("[API] Server check: PAYSTACK_PUBLIC_KEY is ".concat(keyExists ? "present (pk_...".concat(PAYSTACK_PUBLIC_KEY.slice(-4), ")") : 'MISSING', "."));
    if (!keyExists) {
        console.error("❌ [CRITICAL] Paystack public key not found in the environment when requested by the frontend. The payment form will not work. Ensure .env is loaded correctly and the server was restarted after changes.");
        return res.status(500).json({ message: 'Payment gateway is not configured on the server. Administrator has been notified.' });
    }
    res.json({ publicKey: PAYSTACK_PUBLIC_KEY });
});
// --- AUTH & USER ENDPOINTS ---
// FIX: Updated to use imported Express types.
app.post('/api/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, password, role, classLevel, schoolName, schoolAddress, centreName, centreAddress, existingUser, verificationToken, user, verificationUrl, userResponse, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password, role = _a.role, classLevel = _a.classLevel, schoolName = _a.schoolName, schoolAddress = _a.schoolAddress, centreName = _a.centreName, centreAddress = _a.centreAddress;
                return [4 /*yield*/, User_1.default.findOne({ email: email.toLowerCase() })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(400).json({ message: 'An account with this email already exists.' })];
                }
                verificationToken = crypto_1.default.randomBytes(32).toString('hex');
                user = new User_1.default({
                    name: name_1,
                    email: email.toLowerCase(),
                    password: password,
                    role: role,
                    classLevel: classLevel,
                    schoolName: schoolName,
                    schoolAddress: schoolAddress,
                    centreName: centreName,
                    centreAddress: centreAddress,
                    verificationToken: verificationToken,
                    verificationTokenExpires: new Date(Date.now() + 3600000) // 1 hour
                });
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                verificationUrl = "".concat(FRONTEND_URL, "/#/confirm?token=").concat(verificationToken);
                return [4 /*yield*/, sendEmail({
                        to: user.email,
                        subject: 'Confirm Your Email Address',
                        html: generateConfirmationEmailHTML(user.name, verificationUrl)
                    })];
            case 3:
                _b.sent();
                userResponse = user.toObject();
                // @ts-ignore
                delete userResponse.password;
                res.status(201).json({ user: userResponse, token: verificationToken });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                console.error("Registration error:", error_4);
                res.status(500).json({ message: 'Server error during registration.' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.post('/api/confirm-email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                token = req.body.token;
                return [4 /*yield*/, User_1.default.findOne({
                        verificationToken: token,
                        verificationTokenExpires: { $gt: new Date() }
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid or expired verification token.' })];
                }
                user.isVerified = true;
                user.verificationToken = undefined;
                user.verificationTokenExpires = undefined;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                res.json({ message: 'Email confirmed successfully!' });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error("Confirmation error:", error_5);
                res.status(500).json({ message: 'Server error during email confirmation.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.post('/api/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, token, userResponse, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, User_1.default.findOne({ email: email.toLowerCase() }).select('+password')];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid email or password.' })];
                }
                if (!user.isVerified) {
                    return [2 /*return*/, res.status(403).json({ message: 'Please verify your email address before logging in.' })];
                }
                return [4 /*yield*/, user.comparePassword(password)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid email or password.' })];
                }
                token = jwt.sign({ _id: user._id, role: user.role }, jwtSecret, { expiresIn: '7d' });
                userResponse = user.toObject();
                delete userResponse.password;
                if (user.school) {
                    userResponse.isSchoolSponsored = true;
                }
                res.json({ user: userResponse, token: token });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                console.error("Login error:", error_6);
                res.status(500).json({ message: 'Server error during login.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.post('/api/student-login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_2, accessCode, user, token, userResponse, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name_2 = _a.name, accessCode = _a.accessCode;
                return [4 /*yield*/, User_1.default.findOne({ name: name_2, accessCode: accessCode.toUpperCase() })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid name or access code.' })];
                }
                if (!(user.status === 'Pending')) return [3 /*break*/, 3];
                user.status = 'Active';
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                token = jwt.sign({ _id: user._id, role: user.role }, jwtSecret, { expiresIn: '7d' });
                userResponse = user.toObject();
                delete userResponse.password;
                userResponse.isSchoolSponsored = true;
                res.json({ user: userResponse, token: token });
                return [3 /*break*/, 5];
            case 4:
                error_7 = _b.sent();
                console.error("Student login error:", error_7);
                res.status(500).json({ message: 'Server error during student login.' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.get('/api/me', authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userResponse, error_8;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
                    return [2 /*return*/, res.status(400).json({ message: "User ID not found in token" })];
                }
                return [4 /*yield*/, User_1.default.findById(req.user._id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found." })];
                }
                userResponse = user.toObject();
                if (user.school) {
                    userResponse.isSchoolSponsored = true;
                }
                res.json(userResponse);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _b.sent();
                console.error("Error fetching user profile (/api/me):", error_8);
                res.status(500).json({ message: "Server error fetching user profile." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.post('/api/forgot-password', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, resetToken, resetUrl, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                email = req.body.email;
                return [4 /*yield*/, User_1.default.findOne({ email: email.toLowerCase() })];
            case 1:
                user = _a.sent();
                if (!user) {
                    // Note: Not revealing if user exists for security reasons
                    return [2 /*return*/, res.json({ message: 'If an account with that email exists, a password reset link has been sent.' })];
                }
                resetToken = crypto_1.default.randomBytes(32).toString('hex');
                user.passwordResetToken = resetToken;
                user.passwordResetTokenExpires = new Date(Date.now() + 3600000); // 1 hour
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                resetUrl = "".concat(FRONTEND_URL, "/#/reset?token=").concat(resetToken);
                return [4 /*yield*/, sendEmail({
                        to: user.email,
                        subject: 'Password Reset Request',
                        html: generatePasswordResetEmailHTML(user.name, resetUrl)
                    })];
            case 3:
                _a.sent();
                res.json({ message: 'Password reset email sent.' });
                return [3 /*break*/, 5];
            case 4:
                error_9 = _a.sent();
                console.error("Forgot password error:", error_9);
                res.status(500).json({ message: 'Server error during forgot password process.' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.post('/api/reset-password', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, token, password, user, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, token = _a.token, password = _a.password;
                return [4 /*yield*/, User_1.default.findOne({
                        passwordResetToken: token,
                        passwordResetTokenExpires: { $gt: new Date() }
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid or expired password reset token.' })];
                }
                user.password = password;
                user.passwordResetToken = undefined;
                user.passwordResetTokenExpires = undefined;
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                res.json({ message: 'Password has been reset successfully.' });
                return [3 /*break*/, 4];
            case 3:
                error_10 = _b.sent();
                console.error("Reset password error:", error_10);
                res.status(500).json({ message: 'Server error during password reset.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.get('/api/profiles/:userId', authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, profiles, error_11;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) !== userId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'Parent/Guardian') {
                    return [2 /*return*/, res.status(403).json({ message: "You are not authorized to view these profiles." })];
                }
                return [4 /*yield*/, CareerProfile_1.default.find({ user: userId }).sort({ assessmentDate: -1 })];
            case 1:
                profiles = _c.sent();
                res.json(profiles);
                return [3 /*break*/, 3];
            case 2:
                error_11 = _c.sent();
                console.error("Error fetching profiles:", error_11);
                res.status(500).json({ message: 'Server error fetching profiles.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// --- PARENT/CHILD ENDPOINTS ---
// FIX: Updated to use imported Express types.
app.get('/api/children', authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parentId, children, childrenIds, profiles_1, childrenWithProfiles, error_12;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                parentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                return [4 /*yield*/, User_1.default.find({ parent: parentId }).lean()];
            case 1:
                children = _b.sent();
                childrenIds = children.map(function (c) { return c._id; });
                return [4 /*yield*/, CareerProfile_1.default.find({ user: { $in: childrenIds } }).sort({ assessmentDate: -1 }).lean()];
            case 2:
                profiles_1 = _b.sent();
                childrenWithProfiles = children.map(function (child) {
                    var childProfiles = profiles_1
                        .filter(function (p) { return p.user.toString() === child._id.toString(); })
                        .map(function (p) { return (__assign(__assign({}, p), { _id: p._id.toString(), user: p.user.toString() })); });
                    return {
                        _id: child._id.toString(),
                        name: child.name,
                        profiles: childProfiles.slice(0, 1),
                    };
                });
                res.json(childrenWithProfiles);
                return [3 /*break*/, 4];
            case 3:
                error_12 = _b.sent();
                console.error("Error fetching children:", error_12);
                res.status(500).json({ message: 'Server error while fetching children data.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.post('/api/children', authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var parentId, parent_1, name_3, childrenCount, pseudoEmail, child, childResponse, error_13;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                parentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                return [4 /*yield*/, User_1.default.findById(parentId)];
            case 1:
                parent_1 = _b.sent();
                if (!parent_1 || parent_1.role !== 'Parent/Guardian') {
                    return [2 /*return*/, res.status(403).json({ message: 'User is not authorized to add children.' })];
                }
                name_3 = req.body.name;
                if (!name_3) {
                    return [2 /*return*/, res.status(400).json({ message: 'Child name is required.' })];
                }
                return [4 /*yield*/, User_1.default.countDocuments({ parent: parentId })];
            case 2:
                childrenCount = _b.sent();
                if (!parent_1.isSubscribed && childrenCount >= 1) {
                    return [2 /*return*/, res.status(403).json({ message: 'Upgrade to a premium plan to add more than one child.' })];
                }
                if (parent_1.isSubscribed && childrenCount >= 5) {
                    return [2 /*return*/, res.status(403).json({ message: 'You have reached the maximum of 5 children for your premium plan.' })];
                }
                pseudoEmail = "".concat(parentId, "-").concat(Date.now(), "@child.careeraid.local");
                child = new User_1.default({
                    name: name_3,
                    email: pseudoEmail,
                    password: crypto_1.default.randomBytes(16).toString('hex'),
                    role: 'Student',
                    parent: parentId,
                    isVerified: true
                });
                return [4 /*yield*/, child.save()];
            case 3:
                _b.sent();
                childResponse = child.toObject();
                delete childResponse.password;
                res.status(201).json(childResponse);
                return [3 /*break*/, 5];
            case 4:
                error_13 = _b.sent();
                console.error("Error adding child:", error_13);
                res.status(500).json({ message: 'Server error while adding child.' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// --- SCHOOL ADMIN ENDPOINTS ---
// FIX: Updated to use imported Express types.
app.get('/api/school/students', authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schoolId, students, error_14;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                schoolId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                return [4 /*yield*/, User_1.default.find({ school: schoolId }).select('name classLevel accessCode status').sort({ createdAt: -1 })];
            case 1:
                students = _b.sent();
                res.json(students);
                return [3 /*break*/, 3];
            case 2:
                error_14 = _b.sent();
                console.error("Error fetching school students:", error_14);
                res.status(500).json({ message: 'Server error while fetching students.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.post('/api/school/students', authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var schoolId, school, _a, name_4, classLevel, accessCode, student, error_15;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                schoolId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
                return [4 /*yield*/, User_1.default.findById(schoolId)];
            case 1:
                school = _c.sent();
                if (!school || (school.role !== 'School Administrator' && school.role !== 'JAMB CBT Centre')) {
                    return [2 /*return*/, res.status(403).json({ message: 'User is not authorized to add students.' })];
                }
                _a = req.body, name_4 = _a.name, classLevel = _a.classLevel;
                if (!name_4 || !classLevel) {
                    return [2 /*return*/, res.status(400).json({ message: 'Student name and class level are required.' })];
                }
                accessCode = crypto_1.default.randomBytes(3).toString('hex').toUpperCase();
                student = new User_1.default({
                    name: name_4,
                    classLevel: classLevel,
                    email: "".concat(schoolId, "-").concat(Date.now(), "@student.careeraid.local"),
                    password: crypto_1.default.randomBytes(16).toString('hex'),
                    role: 'Student',
                    school: schoolId,
                    accessCode: accessCode,
                    isVerified: true,
                    status: 'Pending',
                });
                return [4 /*yield*/, student.save()];
            case 2:
                _c.sent();
                res.status(201).json({
                    _id: student._id,
                    name: student.name,
                    classLevel: student.classLevel,
                    accessCode: student.accessCode,
                    status: student.status
                });
                return [3 /*break*/, 4];
            case 3:
                error_15 = _c.sent();
                console.error("Error adding student:", error_15);
                res.status(500).json({ message: 'Server error while adding student.' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// --- PAYMENT ENDPOINT ---
// FIX: Updated to use imported Express types.
app.post('/api/verify-payment', authMiddleware, function (req, res) {
    var _a;
    if (!PAYSTACK_SECRET_KEY) {
        return res.status(500).json({ success: false, message: 'Payment processor is not configured on the server.' });
    }
    var userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    var reference = req.body.reference;
    if (!userId || !reference) {
        return res.status(400).json({ success: false, message: 'User ID and transaction reference are required.' });
    }
    var options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: "/transaction/verify/".concat(encodeURIComponent(reference)),
        method: 'GET',
        headers: {
            Authorization: "Bearer ".concat(PAYSTACK_SECRET_KEY),
        },
    };
    var apiReq = https_1.default.request(options, function (apiRes) {
        var data = '';
        apiRes.on('data', function (chunk) {
            data += chunk;
        });
        apiRes.on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
            var responseData, user, parseError_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        responseData = JSON.parse(data);
                        if (!(responseData.status && responseData.data.status === 'success')) return [3 /*break*/, 5];
                        return [4 /*yield*/, User_1.default.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 3];
                        user.isSubscribed = true;
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.json({ success: true, message: 'Payment verified and subscription activated.' })];
                    case 3: return [2 /*return*/, res.status(404).json({ success: false, message: 'User not found after payment verification.' })];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, res.status(400).json({ success: false, message: responseData.message || 'Payment verification failed.' })];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        parseError_1 = _a.sent();
                        console.error('Paystack verification - JSON parse error:', parseError_1);
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Error parsing response from payment gateway.' })];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
    });
    apiReq.on('error', function (error) {
        console.error('Paystack verification - HTTPS request error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred during payment verification.' });
    });
    apiReq.end();
});
// --- GEMINI ENDPOINTS ---
// FIX: Updated to use imported Express types.
app.post('/api/profile', authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, answers, childId, loggedInUser, userIdForProfile, user, child, prompt, response, profileData, summary, recommendedCareers, newProfile, error_16, errorMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, answers = _a.answers, childId = _a.childId;
                loggedInUser = req.user;
                if (!loggedInUser) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized: No logged-in user found." })];
                }
                if (!answers || !Array.isArray(answers)) {
                    return [2 /*return*/, res.status(400).json({ message: 'Assessment answers are required.' })];
                }
                return [4 /*yield*/, User_1.default.findById(loggedInUser._id)];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: 'Logged in user not found' })];
                if (!(user.role === "Parent/Guardian")) return [3 /*break*/, 3];
                if (!childId) {
                    return [2 /*return*/, res.status(400).json({ message: "childId is required for parents taking assessments." })];
                }
                return [4 /*yield*/, User_1.default.findOne({ _id: childId, parent: user._id })];
            case 2:
                child = _b.sent();
                if (!child) {
                    return [2 /*return*/, res.status(403).json({ message: "You are not authorized to perform this action for this child." })];
                }
                userIdForProfile = child.id;
                return [3 /*break*/, 4];
            case 3:
                userIdForProfile = user.id;
                _b.label = 4;
            case 4:
                prompt = "As an expert career counselor for Nigerian students, analyze these answers: ".concat(answers.join(', '), ". Generate a profile adhering to the schema.");
                _b.label = 5;
            case 5:
                _b.trys.push([5, 8, , 9]);
                return [4 /*yield*/, ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json", responseSchema: profileSchema, temperature: 0.5 } })];
            case 6:
                response = _b.sent();
                profileData = JSON.parse(response.text || '{}');
                summary = profileData.summary, recommendedCareers = profileData.recommendedCareers;
                if (!summary || typeof summary !== 'string' || summary.length < 10) {
                    throw new Error("The AI model returned an invalid personality summary. Please try again.");
                }
                if (!recommendedCareers || !Array.isArray(recommendedCareers) || recommendedCareers.length === 0) {
                    throw new Error("The AI model was unable to generate career recommendations from your answers. This can happen during periods of high demand. We encourage you to try the assessment again in a moment.");
                }
                newProfile = new CareerProfile_1.default(__assign(__assign({}, profileData), { user: userIdForProfile, assessmentDate: new Date().toISOString() }));
                return [4 /*yield*/, newProfile.save()];
            case 7:
                _b.sent();
                res.status(201).json(newProfile);
                return [3 /*break*/, 9];
            case 8:
                error_16 = _b.sent();
                console.error("Error generating career profile:", error_16);
                errorMessage = error_16 instanceof Error ? error_16.message : "Failed to communicate with the AI model.";
                res.status(500).json({ message: errorMessage });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.post('/api/interview-questions', authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var careerName, prompt, response, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                careerName = req.body.careerName;
                if (!careerName) {
                    return [2 /*return*/, res.status(400).json({ message: 'Career name is required.' })];
                }
                prompt = "Generate a list of mock interview questions for a '".concat(careerName, "' role in Nigeria. Adhere to the JSON schema.");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ai.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: prompt,
                        config: { responseMimeType: "application/json", responseSchema: interviewQuestionsSchema }
                    })];
            case 2:
                response = _a.sent();
                res.json(JSON.parse(response.text || '[]'));
                return [3 /*break*/, 4];
            case 3:
                error_17 = _a.sent();
                console.error("Error fetching interview questions for ".concat(careerName, ":"), error_17);
                res.status(500).json({ message: "Failed to generate interview questions." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.post('/api/interview-feedback', authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, question, answer, prompt, response, error_18;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, question = _a.question, answer = _a.answer;
                if (!question || !answer) {
                    return [2 /*return*/, res.status(400).json({ message: 'Question and answer are required.' })];
                }
                prompt = "Act as an interview coach. Question: \"".concat(question, "\". Answer: \"").concat(answer, "\". Provide concise, constructive feedback as a simple HTML string with a positive comment, a <ul> list for improvements, and an encouraging closing sentence.");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt })];
            case 2:
                response = _b.sent();
                res.send(response.text || '');
                return [3 /*break*/, 4];
            case 3:
                error_18 = _b.sent();
                console.error("Error fetching interview feedback:", error_18);
                res.status(500).json({ message: "Failed to generate feedback." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// FIX: Updated to use imported Express types.
app.post('/api/chat', authMiddleware, function (req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    var runChat = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, profile, messages, history_1, chat, lastMessage, stream, _b, stream_1, stream_1_1, chunk, e_1_1, err_1;
        var _c, e_1, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 14, 15, 16]);
                    _a = req.body, profile = _a.profile, messages = _a.messages;
                    history_1 = [
                        { role: "user", parts: [{ text: "My career profile: ".concat(JSON.stringify(profile)) }] },
                        { role: "model", parts: [{ text: "Got it! I'm ready to answer questions about your profile." }] }
                    ];
                    chat = ai.chats.create({
                        model: 'gemini-2.5-flash',
                        config: { systemInstruction: "You are 'CareerAid Bot', a friendly career counselor for Nigerian students. Use the provided profile to answer questions concisely." },
                        history: history_1,
                    });
                    lastMessage = messages[messages.length - 1];
                    if (!lastMessage || lastMessage.role !== 'user')
                        throw new Error("Last message must be from the user.");
                    return [4 /*yield*/, chat.sendMessageStream({ message: lastMessage.text })];
                case 1:
                    stream = _f.sent();
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 7, 8, 13]);
                    _b = true, stream_1 = __asyncValues(stream);
                    _f.label = 3;
                case 3: return [4 /*yield*/, stream_1.next()];
                case 4:
                    if (!(stream_1_1 = _f.sent(), _c = stream_1_1.done, !_c)) return [3 /*break*/, 6];
                    _e = stream_1_1.value;
                    _b = false;
                    chunk = _e;
                    if (chunk.text) {
                        res.write("data: ".concat(JSON.stringify(chunk.text), "\n\n"));
                    }
                    _f.label = 5;
                case 5:
                    _b = true;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _f.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _f.trys.push([8, , 11, 12]);
                    if (!(!_b && !_c && (_d = stream_1.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _d.call(stream_1)];
                case 9:
                    _f.sent();
                    _f.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13: return [3 /*break*/, 16];
                case 14:
                    err_1 = _f.sent();
                    console.error("Chat stream error:", err_1);
                    return [3 /*break*/, 16];
                case 15:
                    res.write('event: end\ndata: {}\n\n');
                    res.end();
                    return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    }); };
    runChat();
});
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setupEmailService()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, db_1.connectDB)()];
            case 2:
                _a.sent();
                app.listen(port, function () {
                    console.log("Backend server listening at http://localhost:".concat(port));
                });
                return [2 /*return*/];
        }
    });
}); };
startServer();
