import { AcademicProgram, AcademicCourse, Faculty } from '../types';

export const generateProgramSchema = (program: AcademicProgram, faculty?: Faculty[]) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": program.title,
    "description": program.marketing_description || program.official_outline,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Innovative Minds Institute",
      "url": "https://iminstitute.online"
    },
    "educationalCredentialAwarded": program.level_id, // e.g., "Bachelor's Degree"
    "occupationalCategory": program.keywords?.join(", "),
    "timeToComplete": `P${program.duration_months}M`,
    "hasCourse": [] as any[]
  };

  return JSON.stringify(schema);
};

export const generateCourseSchema = (course: AcademicCourse, program: AcademicProgram) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.marketing_description,
    "courseCode": course.code,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Innovative Minds Institute",
      "url": "https://iminstitute.online"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "hybrid", // Default
      "courseWorkload": `P${course.credits * 10}H` // Approx hours based on credits
    },
    "isPartOf": {
      "@type": "EducationalOccupationalProgram",
      "name": program.title
    }
  };

  return JSON.stringify(schema);
};
