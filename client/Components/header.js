import Image from "next/image";
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CartIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useRouter } from "next/router";
import axios from 'axios';
import React , { useState } from "react";

const Header = ({ loggedIn , userInfo, headerFixed, homePath, setSearched, setSearchResults }) => {

    const router = useRouter();

    const [ searchedWord, setSearchedWord ] = useState("");

    async function giveSearchResults(e){
        e.preventDefault();

        let result = []
        const res = await axios.get("http://localhost:3001/getProducts");
        const data = await res.data;
        data.map((e)=>{
            if(e.name.includes(searchedWord)){
                setSearchResults([...result, e]);
                result.push(e);
            }
        })

        setSearched(true);
        console.log(searchedWord);
    }

    function logoutUser(e){
        e.preventDefault();
        localStorage.clear();
        router.push("/login")
    }

    async function deleteUser(e){
        e.preventDefault();
        const res = await axios.post("http://localhost:3001/deleteUser",{
            email: userInfo.email
        });
        const data = await res.data;
        if(data.deleted){
            localStorage.clear();
            alert("User Delete Successfully!");
            router.push("/register");
        }else{
            alert("Unable to delete the user!");
        }
    }

    return (
        <div id="home-header"  className={headerFixed? "grid grid-cols-3 bg-[#131A22] py-2 text-white fixed top-0 w-[100vw]": "grid grid-cols-3 bg-[#131A22] py-2 text-white"}>
            <div className="grid grid-cols-2 px-4">

                <div 
                onClick={()=>{router.push(homePath)}}
                className="flex items-center justify-center cursor-pointer border-[0.075rem] border-[#131A22] hover:border-white p-3 rounded-md">
                        <Image 
                        width="125"
                        height="35"
                        src="/amazonIcon.png"
                        />
                </div>

                <div className="flex flex-col items-center justify-center cursor-pointer border-[0.075rem] border-[#121A22] hover:border-white rounded-md">
                    <div className="ml-6 text-gray-300">Hello</div>
                    <div className="flex items-center justify-center">
                        <LocationOnIcon className="w-[2rem]" />  
                        <span className="font-bold">Earth</span>
                    </div>
                </div>

            </div>

            <div className="text-black flex items-center justify-center">
                <div className="flex items-center justify-center w-[100%] rounded-lg focus-within:border-[#e89529] border-2 border-[#131A22]">
                    <input
                    onChange={(e)=>{
                        setSearchedWord(e.target.value);
                    }} 
                    className="w-[100%] h-[2.5rem] rounded-l-md py-2 px-3" />
                    <div className="flex items-center justify-center rounded-r-md px-2 cursor-pointer bg-[#FEBD69] hover:bg-[#f0aa4f]">
                        <SearchIcon
                        onClick={giveSearchResults} 
                        className="w-[2.5rem] h-[2.5rem]" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2">

                <div className="flex items-center justify-center">

                {loggedIn ?
                    <div>
                        <div id="username-div">
                            <span
                            onClick={()=>{
                                router.push("/cart");
                            }} 
                            className="font-semibold cursor-pointer hover:underline">{userInfo.name}</span>

                            <div id="username-floating-div"
                            className="hidden absolute bg-white text-black p-3 rounded-md border-[0.05rem] border-gray-400">
                                <button onClick={logoutUser} className="px-3 py-2 text-[1.1rem] cursor-pointer border-[0.075rem] border-white rounded-md hover:border-black">Logout</button>
                                <button onClick={deleteUser} className="px-3 py-2 text-[1.1rem] cursor-pointer border-[0.075rem] border-white rounded-md hover:border-black">Delete User</button>
                            </div>
                        </div>
                    </div>
                :    
                    <div id="sign-in-div" className="cursor-pointer">
                        <span className="font-semibold text-[1.25rem]">Sign In</span>
                        <div id="sign-in-floating-div" className="hidden absolute bg-white text-black pl-[2.5rem] p-3 rounded-md border-[0.05rem] border-gray-400">
                            <button
                            onClick={()=>{
                                router.push("/register")
                            }} 
                            className="text-[1.1rem] border-[0.075rem] rounded-md px-3 py-2 border-white hover:border-black">Register</button>
                            <button
                            onClick={()=>{
                                router.push("/login")
                            }} 
                            className="text-[1.1rem] border-[0.075rem] rounded-md px-3 py-2 border-white hover:border-black">Login</button>
                        </div>
                    </div>
                }
               
                </div>

                <div className="flex items-center justify-center">
                    <div className="cursor-pointer border-[0.075rem] rounded-md border-[#131A22] hover:border-white p-2">
                        <CartIcon
                        onClick={()=>{
                            router.push("/cart")
                        }} 
                        className="h-[2.75rem] w-[2.75rem]" />
                        <span className="text-[#f09d31] text-[1.5rem] font-bold">{userInfo.cart.length}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;