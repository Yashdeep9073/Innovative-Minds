
import { WorkshopStructure } from '../../../types';

export const TECHNOLOGY_CONTENT: Record<string, Partial<WorkshopStructure>> = {
  "Cybersecurity Trends in Africa": {
    orientation: {
      welcome_message: "Securing Africa's Digital Future.",
      how_it_works: "Master the frameworks protecting Zambian digital infrastructure.",
      learning_outcomes: [
        "Analyze the ZICTA Cyber Security Act.",
        "Defend against mobile money fraud.",
        "Secure enterprise networks in Lusaka.",
        "Implement ethical hacking protocols."
      ]
    },
    topics: [
      {
        id: "t01",
        title: "The African Cyber Threat Landscape",
        introductory_notes: `<h3>Understanding Regional Risks</h3>
        <p>As Zambia digitizes, the attack surface grows. This module dissects threats specific to the SADC region, including <strong>mobile money phishing</strong> and infrastructure attacks.</p>
        <ul>
            <li>Overview of the ZICTA Cyber Security & Cyber Crimes Act.</li>
            <li>Case studies from banking sectors in Lusaka.</li>
            <li>The rise of ransomware in developing economies.</li>
        </ul>`,
        section_1: { video: { title: "Cyber Laws in Zambia", url: "https://www.youtube.com/embed/_fQ6k_k3k3k", duration: "14:00", source_credit: "IMI Tech" }, key_points: ["Data Sovereignty", "Reporting Mechanisms", "Legal Frameworks"], quiz: { pass_mark: 80, questions: [] } },
        section_2: { video: { title: "Mobile Money Security", url: "https://www.youtube.com/embed/inWWhr5tnEA", duration: "10:00", source_credit: "IMI Tech" }, key_points: ["SIM Swaps", "USSD Vulnerabilities", "Social Engineering"], quiz: { pass_mark: 80, questions: [] } },
        section_3: { video: { title: "Enterprise Defense", url: "https://www.youtube.com/embed/3Kq1MIfTWCE", duration: "18:00", source_credit: "IMI Tech" }, key_points: ["Firewalls", "Intrusion Detection", "Employee Training"], quiz: { pass_mark: 80, questions: [] } },
        revision_notes: "Review the Data Protection Act 2021 fundamentals."
      }
    ]
  }
};
