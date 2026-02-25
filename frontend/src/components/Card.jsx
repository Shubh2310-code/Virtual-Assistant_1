import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function Card({image}) {
  const { selectedImage, setSelectedImage, setBackendImage, setFrontendImage } = useContext(UserContext);
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden cursor-pointer hover:border-4 hover:border-white transition-all duration-200 ${selectedImage==image?"border-4 border-white shadow-2xl shadow-blue-950" : null}`} onClick={() => {
      setSelectedImage(image)
      setBackendImage(null)
      setFrontendImage(null)
    }}>
      <img src={image} alt="Assistant" className='w-full h-full object-cover' />
    </div>
  );
}

export default Card;
