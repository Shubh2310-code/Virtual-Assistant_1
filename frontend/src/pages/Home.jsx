import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoClose, IoTrash, IoSearch } from 'react-icons/io5';

function Home() {
  const { userData, serverUrl, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastRequestTimeRef = useRef(0);
  const requestPendingRef = useRef(false);
  const requestCacheRef = useRef(new Map());
  const assistantNameRef = useRef(userData?.assistantName || 'Assistant');
  const userNameRef = useRef(userData?.name || 'User');

  // Update refs when userData changes
  useEffect(() => {
    if (userData?.assistantName) {
      assistantNameRef.current = userData.assistantName;
    }
    if (userData?.name) {
      userNameRef.current = userData.name;
    }
  }, [userData]);

  // Quick response without API
  const getQuickResponse = useCallback((command) => {
    const lower = command.toLowerCase();
    
    // Social media quick responses
    if ((lower.includes('open') || lower.includes('go')) && lower.includes('instagram')) {
      return { response: 'Opening Instagram for you!', type: 'instagram_open' };
    }
    if ((lower.includes('open') || lower.includes('go')) && lower.includes('facebook')) {
      return { response: 'Opening Facebook for you!', type: 'facebook_open' };
    }
    if ((lower.includes('open') || lower.includes('go')) && lower.includes('google')) {
      return { response: 'Opening Google for you!', type: 'google_open' };
    }
    if ((lower.includes('open') || lower.includes('calculator'))) {
      return { response: 'Opening calculator for you!', type: 'calculator_open' };
    }
    if ((lower.includes('search') || lower.includes('find')) && (lower.includes('instagram') || lower.includes('facebook') || lower.includes('instagram'))) {
      return { response: 'Searching for you now!', type: 'social_search' };
    }
    
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return { response: `Hello! I'm ${assistantNameRef.current}. How can I help?`, type: 'greeting' };
    }
    if ((lower.includes('what') || lower.includes('who')) && lower.includes('name')) {
      return { response: `My name is ${assistantNameRef.current}. Nice to meet you!`, type: 'name_query' };
    }
    if (lower.includes('who') && (lower.includes('made') || lower.includes('created'))) {
      return { response: `I was created by ${userNameRef.current}. Thanks for asking!`, type: 'creator_query' };
    }
    if (lower.includes('thank')) {
      return { response: 'You are welcome! Happy to help.', type: 'thanks' };
    }
    if (lower.includes('how are you')) {
      return { response: 'I am doing great! How can I assist you?', type: 'greeting' };
    }
    return null;
  }, []);

  // Text-to-speech
  const speakResponse = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Fetch history
  const fetchHistory = useCallback(async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/history`, { withCredentials: true });
      setHistory(result.data.history || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }, [serverUrl]);

  // Clear history
  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      try {
        await axios.post(`${serverUrl}/api/user/clear-history`, {}, { withCredentials: true });
        setHistory([]);
        alert('History cleared successfully!');
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  // Send command with caching and rate limiting
  const sendCommand = useCallback(async (command) => {
    if (requestPendingRef.current || !command.trim()) return;

    const cacheKey = command.toLowerCase().trim();

    // Check cache
    if (requestCacheRef.current.has(cacheKey)) {
      const cached = requestCacheRef.current.get(cacheKey);
      setResponse(cached);
      setTimeout(() => speakResponse(cached), 300);
      return;
    }

    // Try quick response
    const quick = getQuickResponse(command);
    if (quick) {
      setResponse(quick.response);
      requestCacheRef.current.set(cacheKey, quick.response);
      
      // Handle quick social media opens
      if (quick.type === 'instagram_open') {
        setTimeout(() => window.open('https://www.instagram.com', '_blank'), 500);
      } else if (quick.type === 'facebook_open') {
        setTimeout(() => window.open('https://www.facebook.com', '_blank'), 500);
      } else if (quick.type === 'google_open') {
        setTimeout(() => window.open('https://www.google.com', '_blank'), 500);
      } else if (quick.type === 'calculator_open') {
        setTimeout(() => window.open('https://www.google.com/search?q=calculator', '_blank'), 500);
      }
      
      setTimeout(() => speakResponse(quick.response), 300);
      
      // Save to history
      try {
        await axios.post(`${serverUrl}/api/user/askToAssistant`, 
          { command: command.trim() }, 
          { withCredentials: true, timeout: 30000 });
      } catch (e) {
        console.log('History save skipped');
      }
      
      await fetchHistory();
      return;
    }

    // Rate limit: 3 seconds between API calls
    const now = Date.now();
    const timeSince = now - lastRequestTimeRef.current;
    if (timeSince < 3000) {
      setResponse('Processing...');
      setTimeout(() => sendCommand(command), 3000 - timeSince);
      return;
    }

    requestPendingRef.current = true;
    setIsLoading(true);
    lastRequestTimeRef.current = now;

    try {
      console.log('API call:', command);
      const res = await axios.post(
        `${serverUrl}/api/user/askToAssistant`,
        { command: command.trim() },
        { withCredentials: true, timeout: 30000 }
      );

      const msg = res.data.response;
      setResponse(msg);
      requestCacheRef.current.set(cacheKey, msg);
      
      setTimeout(() => speakResponse(msg), 500);

      if (res.data.type === 'google_search') {
        setTimeout(() => {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(res.data.userInput || command)}`, '_blank');
        }, 1000);
      } else if (res.data.type === 'instagram_search') {
        setTimeout(() => {
          window.open(`https://www.instagram.com/explore/tags/${encodeURIComponent(res.data.userInput || command)}`, '_blank');
        }, 1000);
      } else if (res.data.type === 'facebook_search') {
        setTimeout(() => {
          window.open(`https://www.facebook.com/search/top/?q=${encodeURIComponent(res.data.userInput || command)}`, '_blank');
        }, 1000);
      } else if (res.data.type === 'youtube_search' || res.data.type === 'youtube_play') {
        setTimeout(() => {
          window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(res.data.userInput || command)}`, '_blank');
        }, 1000);
      } else if (res.data.type === 'instagram_open') {
        setTimeout(() => window.open('https://www.instagram.com', '_blank'), 500);
      } else if (res.data.type === 'facebook_open') {
        setTimeout(() => window.open('https://www.facebook.com', '_blank'), 500);
      } else if (res.data.type === 'calculator_open') {
        setTimeout(() => window.open('https://www.google.com/search?q=calculator', '_blank'), 500);
      }

      await fetchHistory();
    } catch (error) {
      console.error('Error:', error.message);
      const msg = 'Sorry, could not process that request.';
      setResponse(msg);
    } finally {
      requestPendingRef.current = false;
      setIsLoading(false);
    }
  }, [serverUrl, speakResponse, getQuickResponse, fetchHistory]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onstart = () => {
      console.log('Listening...');
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      if (window.speechSynthesis.speaking) return;

      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const txt = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += txt + ' ';
        } else {
          interim += txt;
        }
      }

      setTranscript(finalTranscript.trim() + (interim ? ' ' + interim : ''));

      if (event.results[event.results.length - 1].isFinal) {
        const cmd = finalTranscript.trim();
        if (cmd && !requestPendingRef.current) {
          console.log('Final:', cmd);
          setTranscript(cmd);
          sendCommand(cmd);
          finalTranscript = '';
        }
      }
    };

    recognition.onerror = (e) => {
      console.error('Recognition error:', e.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      try {
        setTimeout(() => recognition.start(), 100);
      } catch (e) {
        console.log('Cannot restart');
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.warn('Start error:', err);
    }

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [sendCommand]);

  // Fetch user data and history on mount
  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true });
        if (result?.data) {
          setUserData(result.data);
          await fetchHistory();
        } else {
          navigate('/signin');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/signin');
      }
    };
    fetchCurrent();
  }, [serverUrl, setUserData, navigate, fetchHistory]);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition not available');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setResponse('');
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log('Recognition already running');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/user/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
    setUserData(null);
    navigate('/signin');
  };

  const handleHistoryItemClick = (item) => {
    setTranscript(item.command);
    sendCommand(item.command);
    setShowHistory(false);
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex justify-center items-center flex-col p-4 relative overflow-hidden'>
      {/* Background gradient effect */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse'></div>
      </div>

      <div className='relative z-10 flex flex-col items-center justify-center gap-8 max-w-2xl w-full'>
        {/* Assistant Image with enhanced styling */}
        {userData?.assistantImage && (
          <div className='relative'>
            <div className={`absolute inset-0 rounded-3xl opacity-75 transition-all duration-300 ${
              isListening ? 'bg-gradient-to-r from-green-400 to-blue-500 animate-pulse blur-lg' : 'bg-gradient-to-r from-purple-500 to-pink-500 blur-lg'
            }`}></div>
            <img
              src={userData.assistantImage}
              alt={userData.assistantName || 'Assistant'}
              className={`relative w-[250px] h-[250px] lg:w-[350px] lg:h-[350px] rounded-3xl object-cover border-4 transition-all duration-300 ${
                isListening ? 'border-green-400 ring-4 ring-green-400 shadow-lg shadow-green-500' : 'border-purple-400 ring-4 ring-purple-400 shadow-lg shadow-purple-500'
              }`}
            />
          </div>
        )}

        {/* Header with Assistant Name */}
        <div className='text-center'>
          <h1 className='text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent'>
            {userData?.assistantName || 'Virtual Assistant'}
          </h1>
          <p className='text-purple-200 text-lg'>Your AI-powered voice assistant</p>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className='w-full bg-gradient-to-r from-blue-900 to-purple-900 bg-opacity-60 backdrop-blur-md p-4 rounded-2xl border border-blue-400 shadow-lg transform transition-all duration-300 hover:scale-105'>
            <p className='text-white text-center text-lg'>
              <span className='text-yellow-300 font-semibold text-xl'>You:</span> <span className='text-blue-100'>{transcript}</span>
            </p>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className='w-full bg-gradient-to-r from-green-900 to-emerald-900 bg-opacity-60 backdrop-blur-md p-4 rounded-2xl border border-green-400 shadow-lg transform transition-all duration-300 hover:scale-105'>
            <p className='text-white text-center text-lg'>
              <span className='text-green-300 font-semibold text-xl'>{userData?.assistantName || 'Assistant'}:</span> <span className='text-green-100'>{response}</span>
            </p>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-purple-400 rounded-full animate-bounce'></div>
            <div className='w-3 h-3 bg-purple-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
            <div className='w-3 h-3 bg-purple-400 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
            <span className='text-purple-300 ml-2'>Processing your command...</span>
          </div>
        )}

        {/* Status Indicator */}
        {isListening && !isLoading && (
          <p className='text-green-400 font-semibold animate-pulse text-lg'>🎤 Listening...</p>
        )}

        {/* Main Action Buttons */}
        <div className='flex flex-col gap-6 w-full'>
          {/* Microphone Button */}
          <button
            onClick={handleMicClick}
            disabled={isLoading}
            className={`w-full px-8 py-5 rounded-full font-bold text-white text-xl transition-all transform duration-300 ${
              isListening
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 scale-105 ring-4 ring-green-400 shadow-lg shadow-green-500'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg shadow-purple-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? '🛑 Stop Listening' : '🎤 Start Listening'}
          </button>

          {/* Secondary Action Buttons */}
          <div className='grid grid-cols-2 gap-4 mt-4'>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className='px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg'
            >
              <IoSearch className='text-xl' />
              History
            </button>
            <button
              onClick={() => navigate('/customize')}
              className='px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all transform hover:scale-105 shadow-lg'
            >
              ⚙️ Customize
            </button>
            <button
              onClick={handleLogout}
              className='px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 col-span-2 shadow-lg'
            >
              🚪 Sign Out
            </button>
          </div>

          {/* Quick Command Buttons */}
          <div className='grid grid-cols-2 gap-3 mt-2'>
            <button
              onClick={() => sendCommand('open instagram')}
              className='px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 shadow-md'
            >
              📸 Instagram
            </button>
            <button
              onClick={() => sendCommand('open facebook')}
              className='px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-105 shadow-md'
            >
              👥 Facebook
            </button>
            <button
              onClick={() => sendCommand('open google')}
              className='px-4 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white rounded-lg text-sm font-semibold hover:from-yellow-600 hover:to-red-600 transition-all hover:scale-105 shadow-md'
            >
              🔍 Google
            </button>
            <button
              onClick={() => sendCommand('open calculator')}
              className='px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all hover:scale-105 shadow-md'
            >
              🧮 Calculator
            </button>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex'>
          <div className='w-full max-w-md bg-gradient-to-b from-slate-800 via-slate-900 to-black ml-auto h-full overflow-hidden flex flex-col shadow-2xl'>
            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-blue-900/50'>
              <h2 className='text-white text-2xl font-bold flex items-center gap-2'>
                <IoSearch className='text-purple-400' />
                Search History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className='text-white hover:text-red-400 transition-colors'
              >
                <IoClose className='text-3xl' />
              </button>
            </div>

            {/* History Items */}
            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
              {history && history.length > 0 ? (
                history.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleHistoryItemClick(item)}
                    className='bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/40 hover:to-blue-500/40 p-4 rounded-lg cursor-pointer transition-all transform hover:scale-105 border border-purple-400/30 hover:border-purple-400/60 group'
                  >
                    <p className='text-blue-300 text-sm font-semibold group-hover:text-blue-200 transition-colors'>
                      📝 {item.command}
                    </p>
                    <p className='text-gray-300 text-xs mt-2 truncate'>
                      {item.response}
                    </p>
                    <p className='text-gray-500 text-xs mt-1'>
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <p className='text-gray-400 text-center'>No search history yet. Start asking me something!</p>
                </div>
              )}
            </div>

            {/* Clear History Button */}
            {history && history.length > 0 && (
              <div className='border-t border-purple-500/30 p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50'>
                <button
                  onClick={handleClearHistory}
                  className='w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 shadow-lg'
                >
                  <IoTrash className='text-xl' />
                  Clear History
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;