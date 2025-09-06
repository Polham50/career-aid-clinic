"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const dotenv = require('dotenv');
dotenv.config();
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careeraid';
if (!MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in the .env file.');
    process.exit(1);
}
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(MONGODB_URI, { family: 4 });
        console.log('MongoDB connected successfully.');
    }
    catch (err) {
        console.error('--- MONGODB CONNECTION FAILED ---');
        console.error(`An error occurred while trying to connect to the database: ${err}`);
        console.error('\n>>> TROUBLESHOOTING CHECKLIST:');
        console.error('1. MONGODB_URI: Is the connection string in your .env file correct?');
        console.error('2. IP Whitelist: Have you whitelisted your current IP address in MongoDB Atlas? (Tip: Use "Allow Access From Anywhere" - 0.0.0.0/0 for development).');
        console.error('3. Network/Firewall: Is a firewall, VPN, or network policy blocking the connection to port 27017?');
        console.error('4. IPv6 Issues: This app now attempts to connect via IPv4 to avoid common network issues. If the problem persists, check your local network configuration.');
        console.error('---------------------------------');
        process.exit(1);
    }
};
exports.connectDB = connectDB;
(0, exports.connectDB)().catch(console.error); // Add this to run the connection on start
