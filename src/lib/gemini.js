// Utility to call Gemini API
// Make sure to add VITE_GEMINI_API_KEY in your .env file

export async function generateReviews(businessName, keywords, rating, tone = 'friendly') {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("No Gemini API key found. Returning mock suggestions.");
    return [
      `I had an amazing experience at ${businessName}! The service was fantastic and I highly recommend it.`,
      `${businessName} completely exceeded my expectations. Will definitely be coming back!`,
      `Five stars! Everything was perfect from start to finish at ${businessName}.`
    ];
  }

  const prompt = `
    You are an expert copywriter. Write 3 distinct, short, and natural Google reviews for a business named "${businessName}".
    The customer gave a rating of ${rating} out of 5.
    ${keywords ? `The customer liked these aspects: ${keywords}. Include these naturally.` : ''}
    The tone of the review should be ${tone}.
    
    Output strictly as a JSON array of strings, with no other text or markdown.
    Example: ["review 1", "review 2", "review 3"]
  `;

  try {
    const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const text = data.candidates[0].content.parts[0].text;
    // Strip possible markdown blocks if Gemini returns them despite instructions
    const cleanText = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Error generating reviews:", error);
    return [
      `Great experience at ${businessName}.`,
      `Really enjoyed my visit to ${businessName}.`,
      `Highly recommend ${businessName}!`
    ];
  }
}
