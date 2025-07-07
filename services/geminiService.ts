
import { GoogleGenAI } from "@google/genai";
import { SummaryResult, GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeYouTubeVideo = async (videoUrl: string, language: string): Promise<SummaryResult> => {
    const model = "gemini-2.5-flash-preview-04-17";
    
    const prompt = `
      You are a highly specialized AI assistant for summarizing YouTube videos.
      The user has provided the following YouTube URL: ${videoUrl}

      Your primary objective is to find the content of this specific video and summarize it. Follow these steps:
      1. Use your search tool to identify the video's exact title and find a transcript of the video at the provided URL.
      2. If a transcript is found, base your entire summary and key ideas directly on the content of that transcript. This is the preferred method.
      3. If you cannot find a transcript, use your search tool to find reliable articles or summaries that describe the content of this specific video. Synthesize that information for your summary.
      
      IMPORTANT: Do NOT give a general summary of the topic. Your summary must be about what is said and shown in THIS PARTICULAR VIDEO.

      The user requires the output in ${language}.

      Please provide your response as a single, valid JSON object with the following structure, and nothing else:
      {
        "title": "The exact title of the video, in its original language.",
        "summary": "A concise, single-paragraph summary of the video's content, written in ${language}.",
        "keyIdeas": [
          "The first key takeaway from the video, in ${language}.",
          "The second key takeaway from the video, in ${language}.",
          "A third key takeaway from the video, in ${language}."
        ]
      }
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr);

        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        const sources: GroundingSource[] = groundingMetadata?.groundingChunks
            ?.map((chunk: any) => chunk.web && chunk.web.uri ? { uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri } : null)
            .filter((s: GroundingSource | null): s is GroundingSource => s !== null) || [];
        
        // Remove duplicate sources by URI
        const uniqueSources = sources.filter((source, index, self) =>
            index === self.findIndex((s) => s.uri === source.uri)
        );

        if (typeof parsedData.title === 'string' && typeof parsedData.summary === 'string' && Array.isArray(parsedData.keyIdeas)) {
            return { ...parsedData, sources: uniqueSources };
        } else {
            throw new Error("Invalid JSON structure received from API.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof SyntaxError) {
             throw new Error("Failed to parse the AI model's response. The format was not valid JSON.");
        }
        throw new Error("Failed to get a valid response from the AI model.");
    }
};
