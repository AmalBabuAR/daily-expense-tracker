import axios from "axios";
import { apiKey } from "./apiKey";

export const generateAIReport = async (incomeData, expenseData) => {
  let prompt = "";
  if (incomeData.length === 0 && expenseData.length === 0) {
     prompt = `suggeste how can I improve my income and expense. give me the steps to get the income on and where to spend `;
  } else if (incomeData.length !== 0 && expenseData.length === 0) {
    prompt = `
    Analyze the following income data and provide suggestions 
    on where expense can be used:
    
    Income:
    ${incomeData
      .map(
        (item) =>
          `- ${item.type}: ${item.amount} on ${item.category} at ${item.date}`
      )
      .join("\n")}
      `;
  } else if (incomeData.length === 0 && expenseData.length !== 0) {
    prompt = `
    Analyze the following income and expense data and provide suggestions 
    on where expense management can be improved:
    
    Income:
    ${incomeData
      .map(
        (item) =>
          `- ${item.type}: ${item.amount} on ${item.category} at ${item.date}`
      )
      .join("\n")}
      
    Expenses:
    ${expenseData
      .map(
        (item) =>
          `- ${item.type}: ${item.amount} on ${item.category} at ${item.date}`
      )
      .join("\n")}
      `;
  } else {
    prompt = `
    Analyze the following income and expense data and provide suggestions 
    on where expense management can be improved:
    
    Income:
    ${incomeData
      .map(
        (item) =>
          `- ${item.type}: ${item.amount} on ${item.category} at ${item.date}`
      )
      .join("\n")}
      
    Expenses:
    ${expenseData
      .map(
        (item) =>
          `- ${item.type}: ${item.amount} on ${item.category} at ${item.date}`
      )
      .join("\n")}
      `;
  }
  try {
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      method: "post",
      data: { contents: [{ parts: [{ text: prompt }] }] },
    });

    return response["data"]["candidates"][0]["content"]["parts"][0]["text"];
  } catch (error) {
    console.error("Error generating AI report:", error);
    return "Sorry, we couldn’t generate a report at this time.";
  }
};
