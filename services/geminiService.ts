import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, RoadmapItem, Course, EventAnalysis } from '../types.ts';

const SYSTEM_INSTRUCTION = `You are a senior AI system architect and career mentor for BTech engineering students in India.
Your goal is to provide specific, actionable, and encouraging career guidance.
Always consider the user's profile (Branch, Year, Goal, Skills) in your responses.`;

// Helper to get a fresh AI instance
const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || '' });

export const generateRoadmap = async (profile: UserProfile): Promise<RoadmapItem[]> => {
  // Mock roadmap data
  return [
    {
      stage: 'Now',
      title: 'Build Core Skills',
      description: `Focus on fundamental ${profile.branch} concepts and improve your programming skills.`,
      resources: ['Online tutorials', 'Textbooks', 'Practice problems']
    },
    {
      stage: 'Next',
      title: 'Gain Experience',
      description: 'Work on projects, internships, and participate in coding competitions.',
      resources: ['GitHub projects', 'Internship opportunities', 'Hackathons']
    },
    {
      stage: 'Later',
      title: 'Specialize and Network',
      description: `Deepen knowledge in ${profile.goal} and build professional connections.`,
      resources: ['Advanced courses', 'Industry conferences', 'LinkedIn networking']
    }
  ];
};

export const getCourseRecommendations = async (profile: UserProfile): Promise<Course[]> => {
  // Mock course recommendations
  const courses = [
    {
      id: '1',
      title: 'Introduction to Computer Science',
      provider: 'Coursera',
      reason: 'Builds fundamental knowledge required for your field',
      level: 'Beginner',
      url: 'https://coursera.org'
    },
    {
      id: '2',
      title: 'Data Structures and Algorithms',
      provider: 'Udemy',
      reason: 'Essential for technical interviews and problem-solving',
      level: 'Intermediate',
      url: 'https://udemy.com'
    },
    {
      id: '3',
      title: 'Machine Learning Basics',
      provider: 'edX',
      reason: 'Growing field with high demand for skilled professionals',
      level: 'Intermediate',
      url: 'https://edx.org'
    },
    {
      id: '4',
      title: 'Web Development Fundamentals',
      provider: 'freeCodeCamp',
      reason: 'Practical skills for building applications',
      level: 'Beginner',
      url: 'https://freecodecamp.org'
    }
  ];

  // Filter based on profile if needed
  return courses.slice(0, 4);
};

export const analyzeEvent = async (eventDetails: string): Promise<EventAnalysis> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Analyze this technical event/competition/workshop description for BTech students.
      Check for credibility, unrealistic promises, and organizer reputation.
      Event: ${eventDetails}
      Output JSON: { "isVerified": boolean, "score": number, "verdict": string, "redFlags": string[] }`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isVerified: { type: Type.BOOLEAN },
            score: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['isVerified', 'score', 'verdict', 'redFlags']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Event analysis failed:", error);
    return { isVerified: false, score: 0, verdict: "Analysis failed. Please ensure an API Key is selected.", redFlags: ["API Connection Error"] };
  }
};

export const analyzeResume = async (resumeContent: string, profile: UserProfile) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Analyze this resume content for a ${profile.goal} role.
      Resume Content: ${resumeContent}
      Student Context: ${profile.branch}, ${profile.year}, Skills: ${profile.skills.join(', ')}.
      Provide a score (0-100), missing keywords, improvement suggestions, and optimized content snippets.
      Output JSON format.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            optimizedContent: { type: Type.STRING }
          },
          required: ['score', 'missingKeywords', 'suggestions', 'optimizedContent']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Resume analysis failed:", error);
    throw error;
  }
};

export const conductMockInterview = async (profile: UserProfile, history: any[], nextMessage: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-1.5-pro',
    config: {
      systemInstruction: `You are an expert interviewer conducting a technical/HR interview for a ${profile.goal} position.
      Ask one question at a time. After each response, briefly evaluate and then ask the next question.
      Focus on ${profile.branch} related core concepts if applicable.`,
    }
  });

  // Send conversation history first
  for (const msg of history) {
    await chat.sendMessage({ message: msg.content });
  }

  // Send the new message
  const response = await chat.sendMessage({ message: nextMessage });
  return response.text;
};
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Student Question: ${query}
      Context: ${profile.year} ${profile.branch}, goal is ${profile.goal}, currently knows ${profile.skills.join(', ')}.`,
      config: {
        systemInstruction: "You are a friendly senior mentor named 'GuideBot'. Answer questions briefly but with deep insight into the Indian engineering ecosystem (placements, CGPA, gate, hackathons).",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Mentor advice failed:", error);
    return "I'm having trouble connecting. Please check if your API key is selected.";
  }
};