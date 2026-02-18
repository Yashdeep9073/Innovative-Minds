
import { createProfessionalCertificate } from '../factory';

// THE OFFICIAL 20 IM CERTIFIED PROFESSIONAL QUALIFICATIONS
const titles = [
  "IM Certified Professional in Digital Literacy",
  "IM Certified Professional in Cybersecurity Awareness",
  "IM Certified Professional in Artificial Intelligence Fundamentals",
  "IM Certified Professional in Data Analysis & Visualization",
  "IM Certified Professional in Software Development Basics",
  "IM Certified Professional in Entrepreneurship & Innovation",
  "IM Certified Professional in Financial Literacy & Accounting",
  "IM Certified Professional in Project Management",
  "IM Certified Professional in Digital Marketing",
  "IM Certified Professional in Public Speaking & Communication",
  "IM Certified Professional in Climate & Environmental Sustainability",
  "IM Certified Professional in Agricultural Technology",
  "IM Certified Professional in Business Administration",
  "IM Certified Professional in Human Resource Management",
  "IM Certified Professional in Leadership & Governance",
  "IM Certified Professional in ICT Support & Networking",
  "IM Certified Professional in Research Methods",
  "IM Certified Professional in Ethics & Professional Practice",
  "IM Certified Professional in Career Development & Employability",
  "IM Certified Professional in Innovation & Design Thinking"
];

const images = [
  'https://images.unsplash.com/photo-1531297461136-82lw9z2.jpg?q=80&w=1000', // Digital
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000', // Cyber
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000', // AI
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000', // Data
  'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1000', // SoftDev
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000', // Entrepreneur
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000', // Finance
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000', // Project Mgmt
  'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=1000', // Marketing
  'https://images.unsplash.com/photo-1475721027767-p0500e41c729?q=80&w=1000', // Public Speaking
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000', // Climate
  'https://images.unsplash.com/photo-1625246333195-58197bd47a30?q=80&w=1000', // AgriTech
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000', // Business Admin
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000', // HR
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000', // Leadership
  'https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1000', // ICT
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000', // Research
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000', // Ethics
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000', // Career
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000'  // Innovation
];

export const certificatesCollection = titles.map((title, index) => {
    // Generate deterministic category codes based on subject keywords
    let cat = 'BUS';
    if(title.includes('Digital') || title.includes('Cyber') || title.includes('ICT') || title.includes('Software') || title.includes('Data') || title.includes('AI')) cat = 'TECH';
    if(title.includes('Agricultural') || title.includes('Climate')) cat = 'AGRI';
    if(title.includes('Speaking') || title.includes('Ethics') || title.includes('Career')) cat = 'SOC';
    
    return createProfessionalCertificate(
        index + 1,
        cat,
        title,
        "Certificate",
        images[index % images.length],
        `The ${title} is a premier qualification designed for professionals seeking mastery in their field. This 5-module comprehensive program covers advanced theoretical frameworks, practical industry applications, and strategic implementation.`
    );
});
