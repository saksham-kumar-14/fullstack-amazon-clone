import React, { useState } from "react";
import axios from "axios";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from "next/router";
import Head from "next/head";

const Register = () => {

    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password");

    async function emailExists(){
        const res = await axios.get("http://localhost:3001/getUsers");
        const allUsers = await res.data;
        let result = false;
        allUsers.map((e)=>{
            if(e.email === email){
                result= true;
            }
        });
        return result;
    }

    async function createUser(e){
        axios.post("http://localhost:3001/createUser", {
            name: name,
            email: email,
            password: password
        }).then(()=>{
            alert("User created!");
            router.push("./login");
        }).catch(()=>{
            alert("An error occured");
        })
    }

    return(
        <div className="bg-white h-[100vh]">
            <Head><title>Amazon.in | Sign in</title></Head>
            <div className="py-3 px-6 bg-[#131A22] flex items-center justify-start">/
                <img className="w-[175px] h-[40px] cursor-pointer" onClick={()=>{router.push("./")}} src="/amazonIcon.png" />
            </div>

            <div className="flex items-center justify-center ">

                <div className="flex flex-col p-6 border-2 my-4 border-gray-200 rounded-lg">
                    <div className="flex items-center justify-start py-3">
                        <h1 className="font-semibold text-[1.5rem]">Sign In</h1>
                    </div>
                    
                    <div className="flex flex-col my-2">
                        <label className="text-[1.1rem] font-semibold">Name</label>
                        <input className="text-[1.15rem] border-2 px-2 rounded-md border-black focus:border-[#e89529]" type="text" onChange={(e)=>{setName(e.target.value)}} />
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

                    <button 
                    className="border-[0.075rem] rounded-md bg-[#eba54b] hover:bg-[#e89529] duration-200 text-[1.15rem] bordder-[0.075rem] border-black py-2" 
                    onClick={async()=>{
                        if(await(emailExists())){
                            alert("A user with this email already has an account. Try to login ..");
                        }else{
                            createUser();
                        }
                    }}>Submit</button>
                </div>

            </div>

            <div className="text-[1.15rem] flex items-center justify-center">
                <span>Already registered? Then, <a href="./login">Login</a></span>
            </div>

        </div>
    )
}

export default Register;