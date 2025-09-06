import { CareerProfile, ChatMessage, InterviewQuestion, User } from '../types';

// For standard web development, the backend runs on localhost.
// Only change this to your computer's local network IP address when testing
// the native mobile app on your phone or an emulator.
// To find your IP:
// - Windows: `ipconfig` in Command Prompt
// - Mac/Linux: `ifconfig` or `ip addr` in Terminal
const API_BASE_URL = 'http://localhost:3001/api';

export interface ChildData {
  _id: string;
  name: string;
  profiles: CareerProfile[];
}

export interface SchoolStudent {
    _id: string;
    name: string;
    classLevel: string;
    accessCode: string;
    status: 'Pending' | 'Active';
}

const getAuthHeaders = (): { [key: string]: string } => {
    const token = localStorage.getItem('authToken');
    const headers: { [key: string]: string } = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || JSON.stringify(errorBody);
        } catch (e) {
            if (response.statusText) {
                errorMessage = response.statusText;
            }
        }
        throw new Error(errorMessage);
    }
    return response;
};

// --- Config and Status ---
export const getEmailServiceStatus = async (): Promise<{ status: 'production' | 'development' }> => {
    const response = await fetch(`${API_BASE_URL}/email-status`);
    const handled = await handleResponse(response);
    return await handled.json();
};

export const getPaymentConfig = async (): Promise<{ publicKey: string }> => {
    const response = await fetch(`${API_BASE_URL}/payment-config`, { headers: getAuthHeaders() });
    const handled = await handleResponse(response);
    return await handled.json();
};

// --- User & Auth Management ---

export const registerUser = async (userData: User): Promise<{ user: User, token: string }> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};

export const confirmEmail = async (token: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/confirm-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};

export const loginUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
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

export const loginWithAccessCode = async (name: string, accessCode: string): Promise<{ user: User, token: string }> => {
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

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};

export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};

export const getMe = async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/me`, {
        headers: getAuthHeaders(),
    });
    const handled = await handleResponse(response);
    return await handled.json() as User;
};


export const getProfilesForUser = async (userId: string): Promise<CareerProfile[]> => {
    const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
        headers: getAuthHeaders(),
    });
    const handled = await handleResponse(response);
    return await handled.json() as CareerProfile[];
}

// --- Parent/Child Management ---

export const getChildren = async (): Promise<ChildData[]> => {
    const response = await fetch(`${API_BASE_URL}/children`, {
        headers: getAuthHeaders(),
    });
    const handled = await handleResponse(response);
    return await handled.json() as ChildData[];
};

export const addChild = async (name: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/children`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
    });
    const handled = await handleResponse(response);
    return await handled.json() as User;
};

// --- School Admin Management ---

export const getSchoolStudents = async (): Promise<SchoolStudent[]> => {
    const response = await fetch(`${API_BASE_URL}/school/students`, {
        headers: getAuthHeaders(),
    });
    const handled = await handleResponse(response);
    return await handled.json() as SchoolStudent[];
};

export const addSchoolStudent = async (name: string, classLevel: string): Promise<SchoolStudent> => {
    const response = await fetch(`${API_BASE_URL}/school/students`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, classLevel }),
    });
    const handled = await handleResponse(response);
    return await handled.json() as SchoolStudent;
};

// --- Gemini-powered services ---

export const getCareerProfile = async (answers: string[], childId?: string): Promise<CareerProfile> => {
    const body = childId ? { answers, childId } : { answers };
    const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });
    const handled = await handleResponse(response);
    return await handled.json() as CareerProfile;
};

// --- Payment ---
export const verifyPaystackPayment = async (reference: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/verify-payment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reference }),
    });
    const handled = await handleResponse(response);
    return await handled.json();
};

export const getChatResponseStream = async (profile: CareerProfile, messages: ChatMessage[]): Promise<AsyncGenerator<string>> => {
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
                if (done) break;

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
        } catch (error) {
            console.error('Error reading chat stream:', error);
        } finally {
            reader.releaseLock();
        }
    }

    return textStream();
};


export const getMockInterviewQuestions = async (careerName: string): Promise<InterviewQuestion[]> => {
     try {
        const response = await fetch(`${API_BASE_URL}/interview-questions`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ careerName }),
        });
        const handled = await handleResponse(response);
        return await handled.json() as InterviewQuestion[];
    } catch (error) {
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

export const getInterviewFeedback = async (question: string, answer: string): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/interview-feedback`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ question, answer }),
        });
        const handled = await handleResponse(response);
        return await handled.text();
    } catch (error) {
        console.error(`Error fetching interview feedback:`, error);
        return `<p><strong>Sorry, an error occurred.</strong> I couldn't generate feedback at this time. Please try again later.</p>`;
    }
};