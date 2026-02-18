
import { Workshop } from '../../types';
import { createV2Workshop } from '../factory';

// Re-generating using the strict factory to ensure schema compliance
// while preserving the custom titles and description.

export const onlineFraudWorkshop: Workshop = createV2Workshop(
    1, 
    'TECH', 
    "Online Fraud and Scam Prevention", 
    "Cybersecurity & Digital Safety", 
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000",
    "This practical and highly relevant workshop equips learners with the skills to identify online fraud, protect themselves digitally, understand cybercrime laws in Zambia, and respond correctly to cyber incidents. Through real Zambian examples, global best practices, and guided assessments, learners gain confidence to stay safe online and take the next step into professional cybersecurity certification.",
    [
        "Introduction to Online Fraud and Digital Risks", // Mand 1
        "Common Scams in Zambia & SADC Region", // Mand 2
        "Phishing & Social Engineering Mechanics", // Mand 3
        "Cyber Laws, Ethics & Reporting Protocols", // Elec 1
        "Building Personal Digital Resilience", // Elec 2
        "Enterprise Security & Fraud Prevention" // Elec 3
    ]
);

// Override specific ID to match existing records if needed (though factory uses deterministic IDs based on params)
onlineFraudWorkshop.id = "imi_ws_TECH_001";
onlineFraudWorkshop.course_id = "imi_ws_TECH_001";
