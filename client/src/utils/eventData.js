import {
  FiShield, FiEye, FiTarget, FiWifi, FiMonitor,
  FiTool, FiZap, FiTrendingUp,
} from 'react-icons/fi';
import { GiRobotGrab } from 'react-icons/gi';
import { PiPlantBold } from 'react-icons/pi';

export const EVENT_DATE_ISO = import.meta.env.VITE_EVENT_DATE || '2026-07-28T09:00:00+05:30';

export const TECH_FOCUS_AREAS = [
  {
    icon: FiShield,
    title: 'Quality Assurance & Defect Prevention',
    description: 'Improve manufacturing quality using advanced inspection systems.',
  },
  {
    icon: FiEye,
    title: 'AI Based Vision Inspection',
    description: 'Smart AI-powered visual inspection solutions.',
  },
  {
    icon: FiTarget,
    title: 'Advanced Metrology & Measurement',
    description: 'Precision measurement technologies.',
  },
  {
    icon: GiRobotGrab,
    title: 'Robotics & Automation',
    description: 'Automate manufacturing operations.',
  },
  {
    icon: FiWifi,
    title: 'Industry 4.0',
    description: 'Digital manufacturing transformation.',
  },
  {
    icon: FiMonitor,
    title: 'Machine Monitoring & OEE',
    description: 'Improve machine efficiency through real-time analytics.',
  },
  {
    icon: FiTrendingUp,
    title: 'Traceability & MES',
    description: 'Track every production stage digitally.',
  },
  {
    icon: FiTool,
    title: 'Predictive Maintenance',
    description: 'Reduce downtime using predictive technologies.',
  },
  {
    icon: FiZap,
    title: 'Energy Efficiency & Sustainability',
    description: 'Lower energy consumption while increasing productivity.',
  },
  {
    icon: PiPlantBold,
    title: 'Emerging Manufacturing Technologies',
    description: 'Latest industrial innovations.',
  },
];

export const WHY_ATTEND = [
  {
    title: 'Learn From Industry Experts',
    description: 'Gain valuable insights from Dana leadership.',
    icon: 'FiUsers',
  },
  {
    title: 'Live Technology Demonstrations',
    description: 'Experience cutting-edge manufacturing technologies.',
    icon: 'FiPlayCircle',
  },
  {
    title: 'Real Case Studies',
    description: 'Learn from successful implementation stories.',
    icon: 'FiBookOpen',
  },
  {
    title: 'Networking Opportunities',
    description: 'Connect with manufacturing professionals.',
    icon: 'FiShare2',
  },
  {
    title: 'Business Discussions',
    description: 'Meet technology providers.',
    icon: 'FiMessageSquare',
  },
  {
    title: 'One-on-One Consultation',
    description: 'Discuss your manufacturing challenges.',
    icon: 'FiUserCheck',
  },
];

export const EVENT_STATS = [
  { label: 'Technology Domains', value: 10, suffix: '+' },
  { label: 'Technology Partners', value: 20, suffix: '+' },
  { label: 'Industrial Professionals', value: 100, suffix: '+' },
  { label: 'Knowledge Sharing Day', value: 1, suffix: '' },
];

export const FAQ_ITEMS = [
  {
    question: 'Who can attend?',
    answer:
      'Senior Management, Manufacturing Leaders, Quality Leaders, Engineering Teams, and Continuous Improvement Personnel from Dana’s supplier network are invited to attend.',
  },
  {
    question: 'Is registration free?',
    answer: 'Yes, registration for Dana Supplier Technology Day 2026 is completely free of charge.',
  },
  {
    question: 'Will I receive a QR Code?',
    answer:
      'Yes, upon successful registration you will instantly receive a unique QR Code via WhatsApp and Email, which you must present at the venue for check-in.',
  },
  {
    question: 'Can I register multiple attendees?',
    answer:
      'Yes, each attendee from your organization should register individually with their own details to receive their personal QR Code.',
  },
  {
    question: 'How do I check in?',
    answer:
      'Simply present the QR Code received on your WhatsApp or Email at the registration desk. Our team will scan it for instant check-in.',
  },
];

export const TECHNOLOGY_INTEREST_OPTIONS = [
  'Metrology',
  'AI Based Vision Application',
  'Robotics & Automation',
  'Industry 4.0',
  'Traceability & MES',
  'Machine Monitoring & OEE Solutions',
];

export const REGISTRATION_TYPES = ['Attendee', 'Exhibitor', 'Dana'];
