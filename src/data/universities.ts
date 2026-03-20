
import { University } from '../types';

export const ZAMBIAN_UNIVERSITIES: University[] = [
  {
    id: 'harvard',
    name: 'Harvard University',
    shortName: 'Harvard',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Harvard_University_logo.svg/512px-Harvard_University_logo.svg.png',
    accredited: true,
    type: 'Private',
    location: 'Cambridge, MA',
    description: 'A private Ivy League research university in Cambridge, Massachusetts.',
    faculties: []
  },
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    shortName: 'MIT',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/512px-MIT_logo.svg.png',
    accredited: true,
    type: 'Private',
    location: 'Cambridge, MA',
    description: 'A private land-grant research university in Cambridge, Massachusetts.',
    faculties: []
  },
  {
    id: 'lpu',
    name: 'Lovely Professional University',
    shortName: 'LPU',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/Lovely_Professional_University_logo.png/220px-Lovely_Professional_University_logo.png',
    accredited: true,
    type: 'Private',
    location: 'Phagwara, Punjab',
    description: 'A private university situated in Phagwara, Punjab, India.',
    faculties: []
  },
  {
    id: 'unza',
    name: 'University of Zambia',
    shortName: 'UNZA',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/University_of_Zambia_Logo.png/220px-University_of_Zambia_Logo.png',
    accredited: true,
    type: 'Public',
    location: 'Lusaka',
    description: 'The oldest and largest public university in Zambia, established in 1965.',
    faculties: [
      {
        faculty: 'School of Law',
        programs: [
          {
            program_id: 'unza_law',
            program_name: 'Bachelor of Laws (LLB)',
            level: 'Degree',
            faculty: 'Law',
            years: [
              {
                year: 'First Year',
                semesters: [
                  { semester: 'Semester 1', modules: [{ id: 'l101', code: 'L101', name: 'Legal Process' }, { id: 'l102', code: 'L102', name: 'Law of Torts' }] },
                  { semester: 'Semester 2', modules: [{ id: 'l103', code: 'L103', name: 'Criminal Law' }, { id: 'l104', code: 'L104', name: 'Contract Law' }] }
                ]
              }
            ]
          }
        ]
      },
      {
        faculty: 'School of Engineering',
        programs: [
          {
            program_id: 'unza_eng',
            program_name: 'Bachelor of Engineering',
            level: 'Degree',
            faculty: 'Engineering',
            years: [
              {
                year: 'First Year',
                semesters: [
                  { semester: 'Semester 1', modules: [{ id: 'e101', code: 'ENG101', name: 'Engineering Mathematics' }, { id: 'e102', code: 'PHY101', name: 'Physics for Engineers' }] },
                  { semester: 'Semester 2', modules: [{ id: 'e103', code: 'ENG102', name: 'Engineering Drawing' }, { id: 'e104', code: 'CHE101', name: 'Chemistry' }] }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cbu',
    name: 'Copperbelt University',
    shortName: 'CBU',
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Copperbelt_University_logo.png',
    accredited: true,
    type: 'Public',
    location: 'Kitwe',
    description: 'A premier public university located in the heart of the Copperbelt province.',
    faculties: [
      {
        faculty: 'School of Business',
        programs: [
          {
            program_id: 'cbu_bus',
            program_name: 'Bachelor of Business Administration',
            level: 'Degree',
            faculty: 'Business',
            years: [
              {
                year: 'First Year',
                semesters: [
                  { semester: 'Semester 1', modules: [{ id: 'b101', code: 'BBA110', name: 'Principles of Management' }, { id: 'b102', code: 'ACC110', name: 'Financial Accounting' }] },
                  { semester: 'Semester 2', modules: [{ id: 'b103', code: 'ECO110', name: 'Microeconomics' }, { id: 'b104', code: 'MKT110', name: 'Marketing Fundamentals' }] }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'zcas',
    name: 'ZCAS University',
    shortName: 'ZCAS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/ZCAS_University_Logo.jpg', 
    accredited: true,
    type: 'Private',
    location: 'Lusaka',
    description: 'Specializing in accountancy, finance, and ICT education.',
    faculties: [
      {
        faculty: 'School of Accountancy',
        programs: [
          {
            program_id: 'zcas_acc',
            program_name: 'ACCA / Bachelor of Accountancy',
            level: 'Degree',
            faculty: 'Accountancy',
            years: [
              {
                year: 'First Year',
                semesters: [
                  { semester: 'Semester 1', modules: [{ id: 'a101', code: 'FA1', name: 'Recording Financial Transactions' }, { id: 'a102', code: 'MA1', name: 'Management Information' }] },
                  { semester: 'Semester 2', modules: [{ id: 'a103', code: 'FA2', name: 'Maintaining Financial Records' }, { id: 'a104', code: 'MA2', name: 'Managing Costs and Finance' }] }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'unilus',
    name: 'University of Lusaka',
    shortName: 'UNILUS',
    logo: 'https://unilus.ac.zm/wp-content/uploads/2023/06/cropped-University-of-Lusaka-Logo.png',
    accredited: true,
    type: 'Private',
    location: 'Lusaka',
    description: 'A modern university offering a wide range of undergraduate and postgraduate programs.',
    faculties: [
      {
        faculty: 'School of Social Sciences',
        programs: [
          {
            program_id: 'unilus_dev',
            program_name: 'Bachelor of Development Studies',
            level: 'Degree',
            faculty: 'Social Sciences',
            years: [
              {
                year: 'First Year',
                semesters: [
                  { semester: 'Semester 1', modules: [{ id: 'd101', code: 'DS101', name: 'Intro to Development' }, { id: 'd102', code: 'SOC101', name: 'Sociology' }] },
                  { semester: 'Semester 2', modules: [{ id: 'd103', code: 'ECO101', name: 'Economics for Development' }, { id: 'd104', code: 'POL101', name: 'Political Science' }] }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'hone',
    name: 'Evelyn Hone College',
    shortName: 'Evelyn Hone',
    logo: 'https://evelynhone.edu.zm/wp-content/uploads/2020/07/ehc-logo.png',
    accredited: true,
    type: 'College',
    location: 'Lusaka',
    description: 'The largest college of applied arts and commerce in Zambia.',
    faculties: [
      {
        faculty: 'School of Media',
        programs: [
          {
            program_id: 'hone_media',
            program_name: 'Diploma in Journalism',
            level: 'Diploma',
            faculty: 'Media Studies',
            years: [
              {
                year: 'First Year',
                semesters: [
                  { semester: 'Semester 1', modules: [{ id: 'j101', code: 'JRN101', name: 'News Writing' }, { id: 'j102', code: 'COM101', name: 'Communication Skills' }] },
                  { semester: 'Semester 2', modules: [{ id: 'j103', code: 'JRN102', name: 'Broadcasting Basics' }, { id: 'j104', code: 'ETH101', name: 'Media Ethics' }] }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'nipa',
    name: 'National Institute of Public Administration',
    shortName: 'NIPA',
    logo: 'https://nipa.ac.zm/wp-content/uploads/2022/03/NIPA-LOGO.png',
    accredited: true,
    type: 'Public',
    location: 'Lusaka',
    description: 'Training public servants and private sector leaders since 1963.',
    faculties: [
      {
        faculty: 'Management Studies',
        programs: [
          {
            program_id: 'nipa_pa',
            program_name: 'Diploma in Public Administration',
            level: 'Diploma',
            faculty: 'Management Studies',
            years: [
              {
                year: 'First Year',
                semesters: [
                  { semester: 'Semester 1', modules: [{ id: 'p101', code: 'PA101', name: 'Intro to Public Admin' }, { id: 'p102', code: 'GOV101', name: 'Zambian Government' }] },
                  { semester: 'Semester 2', modules: [{ id: 'p103', code: 'HRM101', name: 'Human Resource Mgmt' }, { id: 'p104', code: 'LAW101', name: 'Admin Law' }] }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'teveta',
    name: 'TEVETA',
    shortName: 'TEVETA',
    logo: 'https://www.teveta.org.zm/images/logo.png',
    accredited: true,
    type: 'Technical',
    location: 'National',
    description: 'The regulatory body for Technical Education, Vocational and Entrepreneurship Training.',
    faculties: [
      {
        faculty: 'Engineering',
        programs: [
          {
            program_id: 'teveta_auto',
            program_name: 'Automotive Mechanics',
            level: 'Diploma',
            faculty: 'Engineering',
            years: [
              {
                year: 'First Year',
                semesters: [
                  { semester: 'Semester 1', modules: [{ id: 'am101', code: 'AUT101', name: 'Engine Systems' }, { id: 'am102', code: 'WSP101', name: 'Workshop Practice' }] },
                  { semester: 'Semester 2', modules: [{ id: 'am103', code: 'ELE101', name: 'Auto Electronics' }, { id: 'am104', code: 'MAT101', name: 'Applied Math' }] }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
