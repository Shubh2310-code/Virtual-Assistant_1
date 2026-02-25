import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";
function Customize2() {
  const { serverUrl, userData, backendImage, selectedImage, setUserData, frontendImage } = useContext(UserContext);
  const navigate = useNavigate();
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);
  const handleUpdateAssistant = async() => {
    try {
        let formData = new FormData();
        formData.append("assistantName", assistantName);
        if(backendImage) {
            formData.append("assistantImage", backendImage);
        } else if(selectedImage) {
            formData.append("imageUrl", selectedImage);
        }
        const result = await axios.post(`${serverUrl}/api/user/update-assistant`, formData, {withCredentials: true});
        console.log(result.data);
        setUserData(result.data);
        navigate('/');
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-[#030353] flex justify-center items-center flex-col p-5 relative'>
      <MdKeyboardBackspace className='absolute top-5 left-5 text-white cursor-pointer text-3xl hover:text-blue-400 transition' onClick={() => navigate('/')} />
      <div className='w-full max-w-md flex flex-col items-center justify-center gap-6'>
        <h1 className='text-white text-3xl text-center'>Enter Your <span className='text-blue-200'>Assistant Name</span></h1>
        <input
          type="text"
          placeholder="eg: Shifra"
          className="w-full h-12 outline-none border border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg"
          onChange={(e) => setAssistantName(e.target.value)}
          value={assistantName}
        />
        <button
          onClick={() => {
            setLoading(true);
            handleUpdateAssistant();
          }}
          disabled={loading || !assistantName.trim()}
          className='min-w-[200px] h-12 text-black font-semibold bg-white rounded-full text-base hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Create Your Assistant
        </button>
      </div>
    </div>
  );
}

export default Customize2;
