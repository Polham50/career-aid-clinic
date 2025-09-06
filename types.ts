import React from 'react';

export enum AppPhase {
  INIT = 'init',
  HOME = 'home',
  SIGNUP = 'signup',
  LOGIN = 'login',
  AWAITING_CONFIRMATION = 'awaiting_confirmation',
  FORGOT_PASSWORD = 'forgot_password',
  RESET_PASSWORD = 'reset_password',
  DASHBOARD = 'dashboard',
  SUBSCRIPTION = 'subscription',
  MOCK_INTERVIEW = 'mock_interview',
}

export interface User {
  _id?: string;
  id?: string; // Mongoose virtual
  name: string;
  email: string;
  phone?: string;
  password?: string; 
  role: string;
  parent?: string; 
  isSchoolSponsored?: boolean;
  isSubscribed?: boolean;
  classLevel?: string;
  schoolName?: string;
  schoolAddress?: string;
  centreName?: string;
  centreAddress?: string;
}

export interface HollandCode {
  code: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  name: string;
  description: string;
}

export interface CourseRecommendation {
  courseName: string;
  olevelRequirements: string;
  jambScoreRange: string;
  utmeScoreRange?: string;
  institutions: string[];
}

export interface Career {
  careerName:string;
  description: string;
  salaryRange: string;
  requiredSkills: string[];
  courseRecommendations: CourseRecommendation[];
}

export interface CareerProfile {
  _id?: string;
  user?: string;
  assessmentDate: string;
  topHollandCodes: HollandCode[];
  summary: string;

  recommendedCareers: Career[];
}

export interface ChatMessage {
    role: 'user' | 'bot';
    text: string;
}

export interface InterviewQuestion {
    type: 'Behavioral' | 'Technical' | 'Situational';
    question: string;
}

export interface SubscriptionPlan {
  name: string;
  audience: string;
  price: string;
  priceValue?: number;
  priceDetails?: string;
  features: string[];
  highlight: boolean;
}

export interface Notification {
    id: number;
    icon: React.ReactNode;
    title: string;
    description: string;
    timestamp: string;
    read: boolean;
}