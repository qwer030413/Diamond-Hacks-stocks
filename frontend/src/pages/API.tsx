import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "" });

export default function API() {
  return (
    <div className="api">
      <h1>Welcome to the API Page!</h1>
      <p>This is the main page of our application.</p>
      <p>Feel free to explore the features and functionalities.</p>
    </div>
  );
}

async function gemini_questions(stockName: string, questionAmount: number) {
  // Dynamically update the prompt with the stock name
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Provide ${questionAmount} fact-checkable multiple-choice questions about ${stockName} stock performance relative to past stock prices. Each question should include a month and year, and be based on real historical events.
Each question must follow this format exactly, without any markdown, bullets, or formatting:
Question: [Situational event with ${stockName} and time reference]
Choice 1: [Describe a potential stock price change, with percentage (e.g., Increase of 10%)]
Choice 2: [Describe another potential stock price change, with percentage (e.g., Decrease of 5%)]
Answer: [Correct choice, either "Choice 1" or "Choice 2"]
The scenarios should be situational, such as ${stockName} announcing new features, facing production delays, or major economic events. The answer choices must involve actual increase/decrease percentages that could realistically reflect ${stockName}'s stock movement during that time. Ensure the data is historically grounded and the format is consistent for parsing.
Do not add any additional explanation or formatting outside of the 10 question blocks. Only return the 10 formatted Q&A blocks.
`
          }
        ]
      }
    ]
  });

  // Safely extract the text
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  console.log("Raw response text:\n", text);

  const pattern = /Question:\s*(.*?)\s*Choice 1:\s*(.*?)\s*Choice 2:\s*(.*?)\s*Answer:\s*(Choice 1|Choice 2)/gs;

  // Extract matched questions and map them into an array of objects
  const questionsArray = Array.from(text.matchAll(pattern)).map(match => ({
    question: match[1].trim(),
    choice1: match[2].trim(),
    choice2: match[3].trim(),
    answer: match[4].trim()
  }));

  console.log("Parsed questions:", questionsArray);

  const correctAnswer = questionsArray[0].answer;
  const userChoice = "Choice 1"; // For example, this can be dynamically set by user
  const explanation = "I think the stock will go up because it mentions that it will go down.";
  // Explanation request
  const explanationResponse = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `The correct answer to this question is ${correctAnswer}. The user entered ${userChoice} with explanantion ${explanation}. Please explain why or why not my reasoning is correct in a short and concise paragraph.`
          }
        ]
      }
    ]
  });

  // Get and log the explanation from the model
  const explanationText = explanationResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  console.log("Explanation:\n", explanationText);
}

// Call the function with a dynamic stock name (e.g., Apple)
gemini_questions("Apple", 10);
gemini_questions("Tesla", 3);
gemini_questions("Google", 6);

// use gemini to print the reasoning 