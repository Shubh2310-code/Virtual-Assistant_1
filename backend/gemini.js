import axios from 'axios'
const geminiResponse=async(command,assistantName,userName)=>{

    try {
        const apiUrl = process.env.GEMINI_API_Url || process.env.GEMINI_API_URL;
        
        if (!apiUrl) {
            console.error('GEMINI_API_URL not configured');
            throw new Error('GEMINI_API_Url not configured');
        }

        const promptText = `You are a virtual assistant named ${assistantName} created by ${userName} and you are here to help answer questions and provide information. 
        You are not Google. You will now behave like a voice-assistant.
        
        Your task is to understand the user's natural language input and respond with ONLY a JSON 
        object like this (no other text):
        {
          "type": "general" | "google_search" | "instagram_search" | "facebook_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "facebook_open" | "weather_show",
          "userinput": "<original user input>",
          "response": "<a short spoken response to read out loud to user>"
        }
        
        Instructions:
        - "type": determine the intent of the user.
        - "userinput": original sentence the user spoke (remove assistant name if mentioned).
        - "response": A short voice-friendly reply, e.g., "Sure, searching now", "Here's what I found", "Today is Tuesday", etc.
        
        Type meanings:
        - "general": if it's a factual or informational question.
        - "google_search": if the user wants to search something on google (e.g., "search google for weather").
        - "instagram_search": if the user wants to search something on instagram (e.g., "search instagram for fashion").
        - "facebook_search": if the user wants to search something on facebook (e.g., "search facebook for news").
        - "youtube_search": if the user wants to search something on youtube (e.g., "search youtube for music").
        - "youtube_play": if the user wants to play a specific video on youtube.
        - "get_time": if the user wants to know the current time.
        - "get_date": if the user wants to know the current date.
        - "get_day": if the user wants to know the current day.
        - "get_month": if the user wants to know the current month.
        - "calculator_open": if user wants to open a calculator.
        - "instagram_open": if user wants to open instagram directly.
        - "facebook_open": if user wants to open facebook directly.
        - "weather_show": if the user wants to know the current weather.
        
        Important: Only respond with the JSON object, no explanations or additional text.
        
        User input: ${command}
        `; 

        const body = {
            contents: [
                {
                    parts: [ { text: promptText } ]
                }
            ]
        };

        console.log('Calling Gemini API...');
        const result = await axios.post(apiUrl, body, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 20000
        });

        const responseText = result.data.candidates[0].content.parts[0].text;
        console.log('Gemini API response:', responseText);
        return responseText;
        
    } catch (error) {
        console.error('Gemini API Error:');
        console.error('Error message:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            
            // Create a new error with response attached
            const apiError = new Error(error.message);
            apiError.response = error.response;
            throw apiError;
        }
        throw error;
    }
}
export default geminiResponse;