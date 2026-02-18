
import { GoogleGenAI } from "@google/genai";
import { TopicModule } from "../types";

let aiClient: GoogleGenAI | null = null;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const getClient = () => {
  if (!aiClient) {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!API_KEY) {
      console.warn("API Key missing for Gemini Service");
      return null;
    }

    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiClient;
};


// --- CHAT BOT ---
export const getChatResponse = async (userMessage: string, context: string = ''): Promise<string> => {
  const ai = getClient();
  if (!ai) return "System Offline: API Key Missing";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are Dr. Mwale, the AI Tutor for Innovative Minds Institute (IMI). 
      Context: ${context}
      User Question: ${userMessage}
      Provide a helpful, concise answer based on IMI academic standards.`,
    });
    return response.text || "I apologize, I'm having trouble connecting right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently offline. Please try again later.";
  }
};

// --- ACADEMIC CONTENT ENGINE (NUCLEAR OPTION) ---

export const generateAcademicTopicContent = async (
  courseTitle: string,
  topicTitle: string,
  topicIndex: number,
  category: string
): Promise<any> => {
  const ai = getClient();
  if (!ai) throw new Error("API Key Missing");

  const SYSTEM_INSTRUCTION = `
    You are the Chief Academic Architect for the Innovative Minds Institute (IMI).
    Your task is to generate rigorous, university-grade learning content for a specific workshop topic.
    
    SOURCES & INTEGRITY:
    You must synthesize information ONLY from verified academic domains, including:
    - scholar.google.com
    - worldbank.org/en/research
    - eric.ed.gov
    - arxiv.org
    - oercommons.org
    
    CONTEXT:
    - Target Audience: African and Global South learners (Beginner to Intermediate).
    - Tone: Formal, encouraging, practical, and devoid of fluff.
    - Localization: Use examples relevant to Zambia/SADC region where possible (e.g., currency in ZMW, local industries).
    
    OUTPUT RULES:
    - Do NOT use phrases like "Welcome to Module X". Start directly with the academic concept.
    - Ensure NO repetition between the 3 cycles.
    - Cycle 1 = Fundamentals. Cycle 2 = Application/Process. Cycle 3 = Advanced Analysis/Case Study.
  `;

  const JSON_SCHEMA = `
    {
      "introductory_notes": "400 words. Academic overview of the topic.",
      "revision_notes": "200 words. Summary of key takeaways.",
      "cycles": [
        {
          "cycle_number": 1,
          "title": "Fundamentals of ${topicTitle}",
          "introductory_notes": "200 words specific to Cycle 1.",
          "video_query": "Youtube search query for a lecture on ${topicTitle} fundamentals",
          "key_points": ["Point 1", "Point 2", ... (Exactly 15 points)],
          "quiz": {
             "pass_mark": 76,
             "questions": [
               {
                 "question": "Scenario-based question text",
                 "options": ["Correct Answer", "Distractor 1", "Distractor 2", "Distractor 3"],
                 "correctAnswer": 0,
                 "hint": "Pedagogical hint",
                 "explanation": "Academic explanation"
               }
               ... (Exactly 20 Questions)
             ]
          },
          "revision_points": ["Rev Point 1", ... (Exactly 15 points)]
        },
        {
          "cycle_number": 2,
          "title": "Applied ${topicTitle}",
          "introductory_notes": "200 words specific to Cycle 2 (Practical Application).",
          "video_query": "Youtube search query for practical tutorial on ${topicTitle}",
          "key_points": ["Point 1", ... (15 points)],
          "quiz": {
             "pass_mark": 76,
             "questions": [ ... (20 Questions) ]
          },
          "revision_points": ["Rev Point 1", ... (15 points)]
        },
        {
          "cycle_number": 3,
          "title": "Advanced ${topicTitle} & Case Studies",
          "introductory_notes": "200 words specific to Cycle 3 (Complex Analysis).",
          "video_query": "Youtube search query for case study or advanced lecture on ${topicTitle}",
          "key_points": ["Point 1", ... (15 points)],
          "quiz": {
             "pass_mark": 76,
             "questions": [ ... (20 Questions) ]
          },
          "revision_points": ["Rev Point 1", ... (15 points)]
        }
      ]
    }
  `;

  const prompt = `
    Generate FULL content for:
    Course: ${courseTitle}
    Category: ${category}
    Topic Module ${topicIndex + 1}: "${topicTitle}"

    Strictly follow the JSON schema provided. Ensure 15 key points and 20 quiz questions per cycle.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable grounding to find real academic concepts
        responseMimeType: 'application/json',
        systemInstruction: SYSTEM_INSTRUCTION,
        // High budget for large content generation
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    return JSON.parse(text);

  } catch (e) {
    console.error(`AI Generation Failed for ${topicTitle}`, e);
    return null;
  }
};

export const generateFullCourseContent = async (title: string, category: string, level: string): Promise<any> => {
  const ai = getClient();
  if (!ai) return null;

  const prompt = `
    Act as an academic curriculum designer.
    Create a complete JSON course structure for a "${level}" level course titled "${title}" in the category "${category}".
    
    The structure must strictly follow this JSON schema:
    {
      "description": "Comprehensive course description.",
      "workshop_structure": {
        "orientation": {
          "welcome_message": "...",
          "how_it_works": "...",
          "learning_outcomes": ["outcome1", "outcome2", "outcome3", "outcome4"]
        },
        "topics": [
          {
            "title": "Topic 1 Title",
            "introductory_notes": "...",
            "section_1": { "video": { "title": "Video 1", "url": "..." }, "key_points": ["p1", "p2"], "quiz": { "pass_mark": 75, "questions": [] } },
            "section_2": { "video": { "title": "Video 2", "url": "..." }, "key_points": ["p1", "p2"], "quiz": { "pass_mark": 75, "questions": [] } },
            "section_3": { "video": { "title": "Video 3", "url": "..." }, "key_points": ["p1", "p2"], "quiz": { "pass_mark": 75, "questions": [] } },
            "revision_notes": "..."
          },
          // ... Generate 5 topics in total
        ],
        "final_exam": {
           "question_count": 20,
           "pass_mark": 75,
           "max_attempts": 3,
           "questions": [
              { "question": "...", "options": ["...", "..."], "correctAnswer": 0, "hint": "...", "explanation": "..." }
              // ... generate 10 questions
           ]
        }
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Full Course Gen Error", e);
    return null;
  }
};

// Legacy stubs kept for compatibility
export const generateCourseBlueprint = async () => ({});
export const generateTopicModule = async () => ({});
