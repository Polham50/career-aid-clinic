"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterviewFeedback = exports.getMockInterviewQuestions = exports.getChatResponseStream = exports.verifyPaystackPayment = exports.getCareerProfile = exports.addSchoolStudent = exports.getSchoolStudents = exports.addChild = exports.getChildren = exports.getProfilesForUser = exports.getMe = exports.resetPassword = exports.forgotPassword = exports.loginWithAccessCode = exports.loginUser = exports.confirmEmail = exports.registerUser = exports.getPaymentConfig = exports.getEmailServiceStatus = void 0;
// For standard web development, the backend runs on localhost.
// Only change this to your computer's local network IP address when testing
// the native mobile app on your phone or an emulator.
// To find your IP:
// - Windows: `ipconfig` in Command Prompt
// - Mac/Linux: `ifconfig` or `ip addr` in Terminal
const API_BASE_URL = 'http://localhost:3001/api';
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || JSON.stringify(errorBody);
        }
        catch (e) {
            if (response.statusText) {
                errorMessage = response.statusText;
            }
        }
        throw new Error(errorMessage);
    }
    return response;
};
// --- Config and Status ---
const getEmailServiceStatus = async () => {
    const response = await fetch(`${API_BASE_URL}/email-status`);
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.getEmailServiceStatus = getEmailServiceStatus;
const getPaymentConfig = async () => {
    const response = await fetch(`${API_BASE_URL}/payment-config`, { headers: getAuthHeaders() });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.getPaymentConfig = getPaymentConfig;
// --- User & Auth Management ---
const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.registerUser = registerUser;
const confirmEmail = async (token) => {
    const response = await fetch(`${API_BASE_URL}/confirm-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.confirmEmail = confirmEmail;
const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const handled = await handleResponse(response);
    const data = await handled.json();
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }
    return data;
};
exports.loginUser = loginUser;
const loginWithAccessCode = async (name, accessCode) => {
    const response = await fetch(`${API_BASE_URL}/student-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, accessCode }),
    });
    const handled = await handleResponse(response);
    const data = await handled.json();
    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }
    return data;
};
exports.loginWithAccessCode = loginWithAccessCode;
const forgotPassword = async (email) => {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (token, password) => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.resetPassword = resetPassword;
const getMe = async () => {
    const response = await fetch(`${API_BASE_URL}/me`, {
        headers: getAuthHeaders(),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.getMe = getMe;
const getProfilesForUser = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
        headers: getAuthHeaders(),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.getProfilesForUser = getProfilesForUser;
// --- Parent/Child Management ---
const getChildren = async () => {
    const response = await fetch(`${API_BASE_URL}/children`, {
        headers: getAuthHeaders(),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.getChildren = getChildren;
const addChild = async (name) => {
    const response = await fetch(`${API_BASE_URL}/children`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.addChild = addChild;
// --- School Admin Management ---
const getSchoolStudents = async () => {
    const response = await fetch(`${API_BASE_URL}/school/students`, {
        headers: getAuthHeaders(),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.getSchoolStudents = getSchoolStudents;
const addSchoolStudent = async (name, classLevel) => {
    const response = await fetch(`${API_BASE_URL}/school/students`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, classLevel }),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.addSchoolStudent = addSchoolStudent;
// --- Gemini-powered services ---
const getCareerProfile = async (answers, childId) => {
    const body = childId ? { answers, childId } : { answers };
    const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.getCareerProfile = getCareerProfile;
// --- Payment ---
const verifyPaystackPayment = async (reference) => {
    const response = await fetch(`${API_BASE_URL}/verify-payment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reference }),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};
exports.verifyPaystackPayment = verifyPaystackPayment;
const getChatResponseStream = async (profile, messages) => {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
            ...authHeaders,
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify({ profile, messages }),
    });
    if (!response.body) {
        throw new Error("The response body is null.");
    }
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    async function* textStream() {
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done)
                    break;
                const lines = value.split('\n\n').filter(line => line.trim());
                for (const line of lines) {
                    if (line.startsWith('event: end')) {
                        return; // End of stream signal
                    }
                    if (line.startsWith('data:')) {
                        const data = line.substring(5).trim();
                        if (data) {
                            yield JSON.parse(data);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error('Error reading chat stream:', error);
        }
        finally {
            reader.releaseLock();
        }
    }
    return textStream();
};
exports.getChatResponseStream = getChatResponseStream;
const getMockInterviewQuestions = async (careerName) => {
    try {
        const response = await fetch(`${API_BASE_URL}/interview-questions`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ careerName }),
        });
        const handled = await handleResponse(response);
        return await handled.json();
    }
    catch (error) {
        console.error(`Error fetching interview questions for ${careerName}:`, error);
        // Fallback to mock data on error to prevent UI crash
        return [
            { type: 'Behavioral', question: `Tell me about a time you had to solve a complex problem. How did you approach it?` },
            { type: 'Technical', question: `What are the core principles of this field? (For ${careerName})` },
            { type: 'Situational', question: `Imagine a key project stakeholder is unhappy with your progress. What steps would you take?` },
            { type: 'Behavioral', question: `Describe a situation where you had to work with a difficult team member.` },
        ];
    }
};
exports.getMockInterviewQuestions = getMockInterviewQuestions;
const getInterviewFeedback = async (question, answer) => {
    try {
        const response = await fetch(`${API_BASE_URL}/interview-feedback`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ question, answer }),
        });
        const handled = await handleResponse(response);
        return await handled.text();
    }
    catch (error) {
        console.error(`Error fetching interview feedback:`, error);
        return `<p><strong>Sorry, an error occurred.</strong> I couldn't generate feedback at this time. Please try again later.</p>`;
    }
};
exports.getInterviewFeedback = getInterviewFeedback;
