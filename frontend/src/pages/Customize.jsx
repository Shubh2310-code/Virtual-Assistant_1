import React, { useRef, useState, useContext } from 'react';
import Card from '../components/Card';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import image1 from "../assets/5e5bdc03-3163-4755-a05b-33696832821d.avif"
import image2 from "../assets/virtualassistant.avif"
import { RiImageAddFill } from "react-icons/ri";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
  const{ frontendImage, setFrontendImage, backendImage, setBackendImage } = useContext(UserContext);
  
  const inputImage = useRef();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const handle = (e) => {
    const file = e.target.files[0];
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file));
      };
  return (
    <div className='w-full h-screen bg-gradient-to-b from-black to-[#030353] flex justify-center items-center flex-col p-5 relative'>
      <MdKeyboardBackspace className='absolute top-5 left-5 text-white cursor-pointer text-3xl hover:text-blue-400 transition' onClick={() => navigate('/')} />
      <h1 className='text-white mb-8 text-3xl text-center'>Select your <span className='text-blue-200'>Assistant Image</span></h1>
      <div className='w-full max-w-4xl flex justify-center items-center flex-wrap gap-4'>
        <Card image={image1}/>
        <Card image={image2}/>
        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectedImage==="input"?"border-4 border-white shadow-2xl shadow-blue-950" : null} ${frontendImage ? 'border-white' : ''}`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
  >
          {!frontendImage && <RiImageAddFill className='text-white 
          w-4 h-5' />}
          {frontendImage && <img src={frontendImage} alt="Selected" className='w-full h-full object-cover' />}
        </div>
        <input type="file" accept='image/*' ref={inputImage} hidden onChange={handle}/>
      </div>
      <button onClick={() => navigate('/customize2')} className='min-w-[150px] h-12 mt-4 text-black font-semibold bg-white rounded-full text-base'>Next</button>
    </div>
    
  );
}

export default Customize;
