
import { createV2Workshop } from '../factory';

// THE OFFICIAL 10 IMI WORKSHOPS
export const coreWorkshops = [
  createV2Workshop(
    1, 'TECH', 'Online Fraud and Scam Prevention', 'Cybersecurity', 
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000', 
    'Learn how to identify, prevent, and report online scams. Protect your digital identity and finances with practical strategies.', 
    [
        "Introduction to Digital Risks", 
        "Common Scams in SADC Region", 
        "Phishing & Social Engineering", 
        "Mobile Money Security", 
        "Identity Theft Protection", 
        "Cyber Laws & Reporting"
    ]
  ),
  createV2Workshop(
    2, 'BUS', 'Event Planning & Management', 'Business', 
    'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000', 
    'Master the art of organizing successful events, from corporate conferences to weddings. Learn budgeting, logistics, and vendor management.', 
    [
        "Event Strategy & Concept",
        "Budgeting & Financial Planning",
        "Venue Selection & Logistics",
        "Marketing & Promotion",
        "Vendor & Stakeholder Management",
        "Risk Management & Safety"
    ]
  ),
  createV2Workshop(
    3, 'TECH', 'Computer Basics', 'Technology', 
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000', 
    'Gain essential computer literacy skills. Understand hardware, software, operating systems, and basic troubleshooting.', 
    [
        "Hardware Fundamentals",
        "Operating Systems (Windows/Linux)",
        "File Management & Organization",
        "Internet & Web Browsing",
        "Productivity Software Basics",
        "Basic Troubleshooting & Maintenance"
    ]
  ),
  createV2Workshop(
    4, 'BUS', 'Digital Marketing Basics', 'Business', 
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000', 
    'Unlock the power of social media and online advertising. Learn how to reach customers and build a brand online.', 
    [
        "Marketing Fundamentals",
        "Social Media Strategy",
        "Content Marketing & Copywriting",
        "Search Engine Optimization (SEO)",
        "Email Marketing Campaigns",
        "Analytics & ROI Measurement"
    ]
  ),
  createV2Workshop(
    5, 'SOC', 'Digital Parenting', 'Social Sciences', 
    'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000', 
    'Navigate the challenges of raising children in the digital age. Manage screen time and ensure online safety.', 
    [
        "The Digital Landscape for Kids",
        "Screen Time & Health",
        "Online Safety & Privacy Tools",
        "Cyberbullying Awareness",
        "Digital Footprint Management",
        "Fostering Healthy Habits"
    ]
  ),
  createV2Workshop(
    6, 'BUS', 'Public Speaking', 'Business', 
    'https://images.unsplash.com/photo-1475721027767-p0500e41c729?q=80&w=1000', 
    'Overcome stage fright and communicate with confidence. Learn techniques for effective speech writing and delivery.', 
    [
        "Overcoming Speech Anxiety",
        "Structuring Your Speech",
        "Voice Control & Body Language",
        "Audience Engagement Techniques",
        "Visual Aids & Presentation Tools",
        "Impromptu Speaking Skills"
    ]
  ),
  createV2Workshop(
    7, 'HLTH', 'Stress Management', 'Health', 
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000', 
    'Identify stressors and learn practical coping mechanisms. Explore mindfulness and lifestyle changes.', 
    [
        "The Science of Stress",
        "Mindfulness & Meditation",
        "Time Management for Stress",
        "Physical Health & Nutrition",
        "Building Emotional Resilience",
        "Work-Life Balance Strategies"
    ]
  ),
  createV2Workshop(
    8, 'BUS', 'Time Management', 'Business', 
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000', 
    'Maximize your productivity by mastering time. Learn prioritization matrices and scheduling techniques.', 
    [
        "Goal Setting (SMART)",
        "Prioritization Frameworks",
        "Scheduling & Planning Tools",
        "Overcoming Procrastination",
        "Delegation & Outsourcing",
        "Digital Distraction Management"
    ]
  ),
  createV2Workshop(
    9, 'SOC', 'Disaster Preparedness', 'Social Sciences', 
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000', 
    'Equip yourself with life-saving knowledge. Understand risk assessment and emergency planning.', 
    [
        "Risk Assessment & Identification",
        "Emergency Planning Basics",
        "First Aid & Response",
        "Fire Safety Protocols",
        "Natural Disaster Response",
        "Community Resilience Building"
    ]
  ),
  createV2Workshop(
    10, 'AGRI', 'Smart Farming', 'Agriculture', 
    'https://images.unsplash.com/photo-1625246333195-58197bd47a30?q=80&w=1000', 
    'Revolutionize agriculture with technology. Learn about precision farming and data-driven crop management.', 
    [
        "Introduction to AgriTech",
        "Soil Health & Sensors",
        "Water Management Systems",
        "Precision Crop Monitoring",
        "Drone Technology in Farming",
        "Data Analysis for Yield"
    ]
  )
];
