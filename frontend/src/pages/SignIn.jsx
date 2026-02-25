import React, { useContext, useState } from 'react'; // <-- added useState
import bg from "../assets/virtualassistant.avif";
import { IoEye } from "react-icons/io5";
import { IoIosEyeOff } from "react-icons/io";
import { UserContext } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from "axios"



function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const {serverUrl,userData, setUserData}=useContext(UserContext);
    const navigate=useNavigate()
    const [email,setEmail]=useState("")
    const [loading,setLoading]=useState(false)
    const [password,setPassword]=useState("")
    const [err, setErr]=useState("")
    const handleSignIn=async ()=>{
        setErr("")
        setLoading(true)
      try {
        let result=await axios.post(`${serverUrl}/api/auth/signin`,{
          email,password
        },{withCredentials:true})
        setUserData(result.data)
        setLoading(false)
      } catch (error) {
        console.error(error.response?.data || error.message || error)
        setUserData(null)
        setLoading(false)
        setErr(error.response?.data?.message || "Email dosen't exist")
      }

    }

    return (
        <div
            className="w-full h-screen bg-cover flex justify-center items-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <form 
              onSubmit={(e) =>{
                e.preventDefault();
                handleSignIn();
              }}
            className="relative w-[90%] h-[400px] max-w-[500px] bg-[#00000069] backdrop-blur shadow-black flex flex-col items-center justify-center gap-5 px-5">
                
                <h1 className="text-white text-xl font-semibold mb-5">
                    Sign In to <span className="text-blue-200">Virtual Assistant</span>
                </h1>

                

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full h-10 outline-none border border-white bg-transparent text-white placeholder-gray-200 px-5 rounded-full text-lg" required onChange={(e)=>setEmail(e.target.value)}
                    value={email}
                />

                {/* Password Field */}
                <div className="relative w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full h-10 outline-none border border-white bg-transparent text-white placeholder-gray-200 px-5 pr-12 rounded-full text-lg" required onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                    />
                    {!showPassword && (
                        <IoEye
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white cursor-pointer"
                            onClick={() => setShowPassword(true)}
                        />
                    )}

                    {showPassword && (
                        <IoIosEyeOff
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white cursor-pointer"
                            onClick={() => setShowPassword(false)}
                        />
                    )}
                </div>
                {err && <p className='text-red-500 text-base'>*{err}</p>}
              <button type='submit' className='min-w-[150px] h-12 mt-2 text-black font-semibold bg-white rounded-full text-base' disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button> 
              <p className="text-white text-lg cursor-pointer" onClick={() => navigate("/signup")}>Want to create an account? <span className="text-blue-400">Sign Up</span></p>

            </form>
        </div>
    );
}

export default SignIn;
