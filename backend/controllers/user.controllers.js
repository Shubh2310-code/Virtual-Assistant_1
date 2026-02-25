import User from "../models/user.model.js"
import uploadCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js";
import moment from "moment/moment.js";

export const getCurrent=async (req,res)=>{
    try {
        const userId=req.userId;
        const user=await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message:"get current user error"});
    }
}
export const updateAssistant=async (req,res)=>{
    try {
        const {userName,assistantName,imageUrl}=req.body;
        let assistantImage;
        if(req.file){
            assistantImage=await uploadCloudinary(req.file.path);
        }else{
            assistantImage=imageUrl;
        }
        const user = await User.findByIdAndUpdate(req.userId,{assistantName,assistantImage},{new:true}).select("-password");
        // respond immediately with updated user
        res.status(200).json(user);

        // run assistant update in background (do not send another response)
        geminiResponse("update assistant", assistantName, userName)
            .then((result) => {
                try {
                    const jsonMatch = result.match(/{[\s\S]*}/);
                    if (!jsonMatch) return;
                    const gemResult = JSON.parse(jsonMatch[0]);
                    console.log("Gemini update assistant result:", gemResult);
                } catch (e) {
                    console.error("Gemini parse error:", e);
                }
            })
            .catch((err) => console.error("Gemini error:", err));

    } catch (error) {
        return res.status(500).json({message:"update assistant error"});
    }
}

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        console.log('Received command:', command);
        
        if (!command) {
            console.log('Command is empty');
            return res.status(400).json({ message: "No command provided" });
        }

        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            console.log('User not found:', req.userId);
            return res.status(404).json({ message: "User not found" });
        }

        const assistantName = user.assistantName || "Assistant";
        const userName = user.name || "User";

        console.log('Calling geminiResponse with:', { command, assistantName, userName });
        const result = await geminiResponse(command, assistantName, userName);
        console.log('Gemini response:', result);
        
        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            console.log('No JSON found in Gemini response');
            return res.status(400).json({ response: "sorry, i can't understand" });
        }
        
        let gemResult;
        try {
            gemResult = JSON.parse(jsonMatch[0]);
            console.log('Parsed Gemini result:', gemResult);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            return res.status(400).json({ response: "sorry, i can't understand" });
        }
        
        const type = gemResult.type;
        const userInput = gemResult.userinput || gemResult.userInput;

        switch (type) {
            case 'get_date':
                return res.json({ type, userInput, response: `current date is ${moment().format("MMMM Do YYYY")}` });
            case 'get_time':
                return res.json({ type, userInput, response: `current time is ${moment().format("hh:mm A")}` });
            case 'get_day':
                return res.json({ type, userInput, response: `current day is ${moment().format("dddd")}` });
            case 'get_month':
                return res.json({ type, userInput, response: `current month is ${moment().format("MMMM")}` });
            case 'google_search':
            case 'instagram_search':
            case 'facebook_search':
            case 'youtube_search':
            case 'youtube_play':
            case 'calculator_open':
            case 'instagram_open':
            case 'facebook_open':
            case 'weather_show':
            case 'general':
                // Save to history
                try {
                    user.history.push({
                        command: command,
                        response: gemResult.response,
                        type: type
                    });
                    await user.save();
                } catch (historyError) {
                    console.warn('Failed to save history:', historyError);
                }
                return res.json({ type, userInput, response: gemResult.response });
            default:
                console.log('Unknown type:', type);
                // Save to history for unknown types too
                try {
                    user.history.push({
                        command: command,
                        response: gemResult.response || "I didn't understand that command",
                        type: type
                    });
                    await user.save();
                } catch (historyError) {
                    console.warn('Failed to save history:', historyError);
                }
                return res.json({ type, userInput, response: gemResult.response || "I didn't understand that command" });
        }
    } catch (error) {
        console.error('askToAssistant error:', error.message);
        
        // Handle Gemini API rate limiting (429)
        if (error.response?.status === 429) {
            console.warn('Gemini API rate limited (429)');
            return res.status(429).json({ 
                message: "API rate limit exceeded. Please try again in a moment.",
                response: "I'm processing too many requests. Please wait a moment and try again."
            });
        }
        
        // Handle other API errors
        if (error.response?.status) {
            console.error(`Gemini API error ${error.response.status}:`, error.response.data);
            return res.status(error.response.status).json({ 
                message: `API error: ${error.response.status}`,
                response: "I encountered an error. Please try again."
            });
        }
        
        // Network or other errors
        return res.status(500).json({ 
            message: "askToAssistant error: " + error.message,
            response: "Sorry, something went wrong. Please try again."
        });
    }
}

export const getHistory = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("history");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Return history in reverse order (newest first) and limit to 50
        const history = user.history.slice(-50).reverse();
        res.status(200).json({ history });
    } catch (error) {
        console.error('getHistory error:', error);
        return res.status(500).json({ message: "Failed to fetch history" });
    }
}

export const clearHistory = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.userId, { history: [] }, { new: true }).select("-password");
        res.status(200).json({ message: "History cleared successfully", user });
    } catch (error) {
        console.error('clearHistory error:', error);
        return res.status(500).json({ message: "Failed to clear history" });
    }
}

export const searchSocialMedia = async (req, res) => {
    try {
        const { query, platform } = req.body;
        
        if (!query || !platform) {
            return res.status(400).json({ message: "Query and platform are required" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let searchUrl = '';
        let response = '';

        // Generate appropriate URLs and responses based on platform
        switch (platform.toLowerCase()) {
            case 'instagram':
                searchUrl = `https://www.instagram.com/explore/tags/${encodeURIComponent(query)}`;
                response = `Searching Instagram for ${query}. Opening now!`;
                break;
            case 'facebook':
                searchUrl = `https://www.facebook.com/search/top/?q=${encodeURIComponent(query)}`;
                response = `Searching Facebook for ${query}. Opening now!`;
                break;
            case 'google':
                searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                response = `Searching Google for ${query}. Opening now!`;
                break;
            case 'youtube':
                searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
                response = `Searching YouTube for ${query}. Opening now!`;
                break;
            default:
                return res.status(400).json({ message: "Invalid platform" });
        }

        // Save to history
        try {
            user.history.push({
                command: `Search ${platform} for ${query}`,
                response: response,
                type: `${platform.toLowerCase()}_search`
            });
            await user.save();
        } catch (historyError) {
            console.warn('Failed to save search history:', historyError);
        }

        res.status(200).json({ 
            success: true,
            url: searchUrl,
            response: response,
            platform: platform
        });
    } catch (error) {
        console.error('searchSocialMedia error:', error);
        return res.status(500).json({ message: "Failed to process search" });
    }
}