import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyChpPCR3wY7lmnPFAoX28g8I_ELgk6h7TI");

export const analyzeInterviewFeedback = async (feedback, rating) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `Analyze this interview feedback and rating concisely:
    Feedback: ${feedback}
    Rating: ${rating}/10

    Provide a brief JSON response with:
    1. 2-3 key strengths
    2. 2-3 areas to improve
    3. Overall score (0-100)
    4. One-line summary

    Format:
    {
      "strengths": ["point 1", "point 2"],
      "improvements": ["point 1", "point 2"],
      "overallScore": number,
      "summary": "one line summary"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const analysis = JSON.parse(text);
    return analysis;
  } catch (error) {
    console.error("Error analyzing feedback with Gemini AI:", error);
    return {
      strengths: ["Unable to analyze strengths"],
      improvements: ["Unable to analyze improvements"],
      overallScore: rating * 10,
      summary: "Analysis unavailable"
    };
  }
};

export const generatePerformanceInsights = async (feedbacks) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `Analyze these interview feedbacks concisely:
    ${JSON.stringify(feedbacks)}

    Provide a brief JSON response with:
    1. 2-3 key trends
    2. 2-3 main strengths
    3. 2-3 improvement areas
    4. 2-3 specific recommendations
    5. Overall score (0-100)
    6. One-line summary

    Format:
    {
      "trends": ["point 1", "point 2"],
      "commonStrengths": ["point 1", "point 2"],
      "recurringImprovements": ["point 1", "point 2"],
      "recommendations": ["point 1", "point 2"],
      "overallScore": number,
      "summary": "one line summary"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }
    
    const jsonStr = jsonMatch[0].replace(/```json\n?|\n?```/g, '').trim();
    const insights = JSON.parse(jsonStr);
    
    return {
      trends: insights.trends || ["No trends available"],
      commonStrengths: insights.commonStrengths || ["No strengths available"],
      recurringImprovements: insights.recurringImprovements || ["No improvements available"],
      recommendations: insights.recommendations || ["No recommendations available"],
      overallScore: insights.overallScore || 0,
      summary: insights.summary || "No summary available"
    };
  } catch (error) {
    console.error("Error generating performance insights with Gemini AI:", error);
    return {
      trends: ["Unable to analyze trends"],
      commonStrengths: ["Unable to analyze strengths"],
      recurringImprovements: ["Unable to analyze improvements"],
      recommendations: ["Unable to generate recommendations"],
      overallScore: 0,
      summary: "Analysis unavailable"
    };
  }
};
