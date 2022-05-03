import React, { useState } from "react";
import axios from "axios";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from "next/router";
import Head from "next/head";

const Login = () => {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [passwordType, setPasswordType] = useState("password");

    async function loginUser(){
        const res = await axios.post("http://localhost:3001/login", {
            email: email,
            password: password
        });
        const data = await res.data;

        if(data.user){
            localStorage.setItem("userToken", data.user);
            alert("Logged In!");
            router.push("./")
        }else{
            alert("User not found!")
        }

    }

    return(
        <div className="bg-white h-[100vh]">
            <Head><title>Amazon.in | Login</title></Head>
            <div className="py-3 px-6 bg-[#131A22] flex items-center justify-start">
                <img className="w-[175px] h-[40px] cursor-pointer" onClick={()=>{router.push("./")}} src="/amazonIcon.png" />
            </div>

            <div className="flex items-center justify-center ">

                <div className="flex flex-col p-6 border-2 my-4 border-gray-200 rounded-lg">
                    <div className="flex items-center justify-start py-3">
                        <h1 className="font-semibold text-[1.5rem]">Login</h1>
                    </div>

                    <div className="flex flex-col my-2">
                        <label className="text-[1.1rem] font-semibold">Email</label>
                        <input className="text-[1.15rem] border-2 px-2 rounded-md border-black focus:border-[#e89529]" type="text" onChange={(e)=>{setEmail(e.target.value)}} />
                    </div>

                    <div className="flex flex-col my-2">
                        <label className="text-[1.1rem] font-semibold">Password</label>
                        <div className="text-[1.15rem] border-2 px-2 rounded-md border-black focus-within:border-[#e89529]">
                            <input type={passwordType} onChange={(e)=>{setPassword(e.target.value)}} />
                            {passwordType==="password"?
                                <VisibilityIcon onClick={()=>{setPasswordType("text")}} className="cursor-pointer w-[2rem] h-[2rem]" />
                            :
                                <VisibilityOffIcon onClick={()=>{setPasswordType("password")}} className="cursor-pointer w-[2rem] h-[2rem]" />
                            }
                        </div>
                    </div>

                    <button className="border-[0.075rem] rounded-md bg-[#eba54b] hover:bg-[#e89529] duration-200 text-[1.15rem] bordder-[0.075rem] border-black py-2" 
                    onClick={()=>{
                        loginUser();
                    }} >Submit</button>
                </div>

            </div>

            <div className="text-[1.15rem] flex items-center justify-center">
                <span>Not registered? Then, <a href="./register">Sign In</a></span>
            </div>

        </div>
    )
}

export default Login;