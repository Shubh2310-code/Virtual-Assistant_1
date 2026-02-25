import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const handleCurrentUser = useCallback(async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/current`,
        { withCredentials: true }
      );
      setUserData(result.data);
    } catch (error) {
      // Silently fail if backend is not available or user is not authenticated
      setUserData(null);
    }
  }, [serverUrl]);

  const getgeminiResponse = async (command) => {
    try {
      const result = await axios.post(`${serverUrl}/api/user/askToAssistant`,{command},{withCredentials:true})
      return result.data;
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleCurrentUser();
  }, [handleCurrentUser]);
  
  const value = { 
    serverUrl, 
    userData, 
    setUserData, 
    frontendImage, 
    setFrontendImage, 
    backendImage, 
    setBackendImage, 
    selectedImage, 
    setSelectedImage,
    getgeminiResponse
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
