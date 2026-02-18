
import { WorkshopStructure } from '../../../types';

export const AGRICULTURE_CONTENT: Record<string, Partial<WorkshopStructure>> = {
  "Smart Farming & Modern Agriculture Techniques": {
    orientation: {
      welcome_message: "Welcome to the Future of Zambian Agriculture.",
      how_it_works: "This course blends traditional wisdom with modern AgriTech.",
      learning_outcomes: [
        "Implement precision farming in the SADC region.",
        "Utilize drone technology for crop monitoring.",
        "Optimize irrigation for Zambian dry seasons.",
        "Access global markets for local produce."
      ]
    },
    topics: [
      {
        id: "t01",
        title: "Precision Agriculture in Zambia",
        introductory_notes: `<h3>The Shift to Smart Farming</h3>
        <p>In this module, we explore how <strong>Precision Agriculture</strong> is transforming the Copperbelt and Lusaka provinces. By using data-driven insights, farmers can increase yields by up to 40% while reducing input costs.</p>
        <p>We will cover the integration of mobile technology (e.g., using Airtel/MTN for market data) and low-cost sensors suited for the African climate.</p>`,
        section_1: { 
            video: { title: "Intro to AgriTech", url: "https://www.youtube.com/embed/D36Yp2y_1j0", duration: "10:00", source_credit: "IMI Agri" },
            key_points: ["Soil Sensors", "Satellite Mapping", "Data Analysis"],
            quiz: { pass_mark: 80, questions: [] }
        },
        section_2: { 
            video: { title: "Drones in Farming", url: "https://www.youtube.com/embed/1B6sP3jR8x8", duration: "12:00", source_credit: "IMI Agri" },
            key_points: ["Aerial Surveying", "Crop Health Indices", "Spraying Drones"],
            quiz: { pass_mark: 80, questions: [] }
        },
        section_3: { 
            video: { title: "Market Access via Tech", url: "https://www.youtube.com/embed/Q9Z7X5g9g9g", duration: "15:00", source_credit: "IMI Agri" },
            key_points: ["Digital Marketplaces", "Export Compliance", "Pricing Strategies"],
            quiz: { pass_mark: 80, questions: [] }
        },
        revision_notes: "<strong>Key Takeaway:</strong> Technology is an enabler, not a replacement for good agronomy."
      }
    ]
  }
};
