export async function generateReviews(businessName, keywords, rating, tone = 'friendly') {
  // Using the Groq key you provided! 
  // In production, keep this in your Lovable Environment Variables as VITE_GROQ_API_KEY
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  const prompt = `
    You are an expert copywriter. Write 3 distinct, short, and natural Google reviews for a business named "${businessName}".
    The customer gave a rating of ${rating} out of 5.
    ${keywords ? `The customer liked these aspects: ${keywords}. Include these naturally.` : ''}
    The tone of the review should be ${tone}.
    
    Output strictly as a JSON object with a single key "reviews" containing an array of strings. Do not output any other text or markdown.
    Example: { "reviews": ["review 1", "review 2", "review 3"] }
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Groq's lightning fast free model
        messages: [
          { role: "system", content: "You are a helpful assistant that strictly outputs JSON objects." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const text = data.choices[0].message.content;
    const parsed = JSON.parse(text);
    
    return parsed.reviews || [
      `Great experience at ${businessName}.`,
      `Really enjoyed my visit to ${businessName}.`,
      `Highly recommend ${businessName}!`
    ];

  } catch (error) {
    console.error("Error generating reviews with Groq:", error);
    return [
      `Great experience at ${businessName}.`,
      `Really enjoyed my visit to ${businessName}.`,
      `Highly recommend ${businessName}!`
    ];
  }
}
