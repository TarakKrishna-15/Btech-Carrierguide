# 🎯 BTech Guide – AI Career Mentor & Interview Coach

**BTech Guide** is a high-performance AI-powered mentorship platform specifically designed for engineering students in India. It bridges the gap between academic curriculum and industry readiness by providing personalized career roadmaps, real-time interview coaching, and deep resume analysis using the latest Gemini AI models.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![Gemini](https://img.shields.io/badge/AI-Gemini%203%20Pro-red?logo=google-gemini)

## 🚀 Key Features

### 🗺️ AI-Powered Career Roadmaps
Dynamic, step-by-step learning paths generated based on your engineering branch (CSE, IT, ECE, MECH, etc.), current year, and specific career goals (SWE, Data Science, Core Engineering).

### 🎙️ Real-time Interview Coach
Interactive mock interviews powered by `gemini-3-pro-preview`. Receive instant feedback on your technical answers and behavioral responses tailored to your target role.

### 📄 Resume Hub & ATS Analyzer
*   **PDF Extraction:** Upload your resume in PDF format for automatic text parsing.
*   **ATS Scoring:** Get a "Recruiter Score" out of 100.
*   **Keyword Optimization:** Identify missing industry keywords and get AI-optimized content snippets to bypass recruiter filters.

### 🛡️ Event Verifier
A specialized tool to verify the credibility of Hackathons, Workshops, and Recruitment drives. The AI analyzes event descriptions for "Red Flags" to protect students from low-quality or fake events.

### 🤖 GuideBot (AI Mentor)
A persistent chat companion with deep context on the Indian engineering ecosystem. Ask about placements, CGPA vs. Skills, GATE preparation, or internship opportunities.

### 📊 Professional Dashboard
*   **Learning Momentum:** Visual tracking of your preparation progress.
*   **Coding Presence:** Integration with LinkedIn, LeetCode, Codeforces, and HackerRank.
*   **Live Deadlines:** Stay updated with upcoming registration dates for national hackathons and exams (TCS NQT, Google STEP, etc.).

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **AI Core:** Google Gemini API (`@google/genai`)
- **Data Visualization:** Recharts
- **PDF Processing:** PDF.js (v4.10.38)
- **Icons:** Lucide React

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/btech-guide.git
    cd btech-guide
    ```

2.  **Install dependencies:**
    The project uses ES modules directly from `esm.sh`. Ensure you have a local dev server (like Vite or Live Server).

3.  **Environment Variables:**
    Create a `.env` file or set the environment variable:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Launch:**
    Open `index.html` via your local server.

## 🧠 System Architecture

The application is built with a modular component-based architecture:
- `services/geminiService.ts`: Centralized AI logic using `generateContent` and `Chat` APIs.
- `components/Survey.tsx`: A multi-step onboarding flow to build the `UserProfile` context.
- `components/ResumeAnalyzer.tsx`: Handles complex PDF parsing and AI-driven document review.

## 🤝 Contributing

Contributions are welcome! If you're a BTech student or a developer interested in EdTech, feel free to:
- Open issues for bug reports.
- Submit PRs for new features (e.g., specific branch roadmaps for Mechanical/Civil).
- Suggest new AI-driven mentorship modules.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for the Indian Engineering Community.*
