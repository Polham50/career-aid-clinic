import React from 'react';
import { SubscriptionPlan } from './types';

export const ASSESSMENT_QUESTIONS = [
  "I enjoy working with my hands or with tools to build or repair things.",
  "I like to solve complex problems and understand how things work.",
  "I have a good imagination and enjoy creating new things through art, music, or writing.",
  "I like helping people, teaching, or providing service to others.",
  "I enjoy leading teams, persuading others, and selling ideas or products.",
  "I am organized, detail-oriented, and enjoy working with data and clear procedures.",
  "I prefer outdoor activities and physical work.",
  "I am curious about science and enjoy conducting research or experiments.",
  "I express myself creatively and value originality and beauty.",
  "I am good at listening, understanding others' feelings, and working in groups.",
  "I am ambitious, energetic, and enjoy taking on challenges for financial or status gain.",
  "I like to follow a plan and am good at keeping records and managing budgets.",
];

export const HOLLAND_CODE_ICONS: { [key: string]: React.ReactNode } = {
  R: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  I: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477z" />
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
    </svg>
  ),
  A: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  S: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  E: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  C: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M12 11h.01M12 21h-3a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v1m-6 4h.01" />
    </svg>
  ),
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: "FREEMIUM",
    audience: "Public Access for Students",
    price: "Free",
    priceValue: 0,
    features: [
      "2 career assessments (1 profile per user)",
      "Basic dashboard with career summaries",
      "Ad-supported interface",
      "Access to limited guidance content",
      "No export or save options",
    ],
    highlight: false,
  },
  {
    name: "STUDENT PREMIUM",
    audience: "B2C Subscription",
    price: "₦3,000 / month",
    priceValue: 3000,
    features: [
      "Unlimited assessments & updated profiling",
      "Career-fit subject selection guide (JSS3, SS1)",
      "Custom academic roadmap suggestions",
      "Certificate of completion",
      "Offline access to content via download",
    ],
    highlight: true,
  },
    {
    name: "PARENT PLAN",
    audience: "Monitor Child's Progress",
    price: "₦3,000 / month",
    priceValue: 3000,
    features: [
      "Register and monitor up to 5 children monthly",
      "Notifications and recommendations",
      "Access to parental guidance tips",
      "View/download student reports",
      "Advice packs for parents",
    ],
    highlight: false,
  },
    {
    name: "TEACHER/COUNSELOR",
    audience: "B2C Subscription for Educators",
    price: "₦3,000 / month",
    priceValue: 3000,
    features: [
      "Manage and guide up to 5 students monthly",
      "Career-fit subject selection guide",
      "Custom academic roadmap suggestions",
      "Generate certificates of completion",
      "Offline access to all content",
    ],
    highlight: false,
  },
  {
    name: "SCHOOL PLAN",
    audience: "B2B: Institution Licensing",
    price: "₦2,000,000",
    priceValue: 2000000,
    priceDetails: "/ per session",
    features: [
      "Bulk student account generation",
      "Central admin dashboard",
      "Teacher-assigned assessments",
      "Group analytics & reporting",
      "Optional school branding",
    ],
    highlight: false,
  },
  {
    name: "JAMB CBT CENTRE PLAN",
    audience: "Integration for Test Centers",
    price: "Contact Us",
    priceDetails: "for custom pricing",
    features: [
      "Assessment integration in CBT prep",
      "Multi-user access per terminal",
      "Printable reports for orientation",
      "Branding & white-labelling options",
      "New monetization stream",
    ],
    highlight: false,
  },
];

export const CheckIcon = () => (
    <svg className="w-5 h-5 text-cyan-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);