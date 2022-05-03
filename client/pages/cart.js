import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";

import Header from "../Components/header";
import { prettifyNumber } from "./product/[productId]";

const Cart = () => {

    const [ userInfo, setUserInfo ] = useState({
        cart: []
    });
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ cart, setCart ] = useState([]);
    const router = useRouter();

    function getCartItems(arr){
        let result = []
        arr.map(async(e)=>{
            const res = await axios.get("http://localhost:3001/getProduct", {
                headers: {
                    "product-id": e
                }
            });
            const data = await res.data;
            if(data.product){
                setCart([...result,data.product]);
                result.push(data.product)
            } 
        });
    }

    async function getUserInfo(){
        const token = localStorage.getItem("userToken");
        const res = await axios.get("http://localhost:3001/api/login",{
            headers: {
                "user-token": token
            }
        });
        const data = await res.data;
        if(data.userExists){
            setUserInfo(data.user);
            setLoggedIn(true);
            getCartItems(data.user.cart);
        }else{
            alert("You are not logged In ..");
        }
    }

    useEffect(()=>{
        getUserInfo();
    },[]);

    function makeShort(sentence){
        return sentence.slice(0,150) + "..."
    }

    async function removeFromCart(productIndex){
        const prevCart = userInfo.cart;
        const newCart = prevCart.filter((itemId,index)=>{
            return index!==productIndex
        });
        const res = await axios.post("http://localhost:3001/updateUser", {
            email: userInfo.email,
            cart: newCart
        });
        const data = await res.data;
        if(data.updated){
            location.reload();
        }else{
            alert("An error occured while updating cart.")
        }
    }

    return(
        <div>
            <Head>
                <title>Amazon.in | Cart</title>
            </Head>

            <Header loggedIn={loggedIn} userInfo={userInfo} headerFixed={false} homePath={"../"} />

            <div className="px-6 py-8">
                <h1 className="font-semibold text-[2.5rem]">Shopping Cart</h1>
                {cart.map((e,index)=>{
                    return(
                        <div 
                        key={"cartItem-"+index}
                        className="flex items-center p-3 justify-center cursor-pointer rounded-md hover:bg-[rgb(245,245,245)]">
                            <div className="mx-3">
                                <img 
                                className="w-[300px] h-[300px]"
                                onClick={()=>{
                                router.push(`./product/${e._id}`)
                                }} 
                                src={e.pictureUrl} />
                            </div>
                            <div>
                                <p
                                className="hover:underline font-semibold text-[1.8rem]" 
                                onClick={()=>{
                                router.push(`./product/${e._id}`)
                                }}>{e.name}</p>
                                <p className="text-[1.35rem] text-orange-500 font-semibold my-2">₹{prettifyNumber(e.price)}/-</p>
                                <p className="text-[1.1rem]">{makeShort(e.specifications.toString())}</p>
                                
                                <div className="grid grid-cols-2 py-4">
                                    <button 
                                    className="rounded-3xl bg-yellow-400 hover:bg-yellow-500 duration-300 mx-[4rem] py-2"
                                    onClick={()=>{ removeFromCart(index) }}>Remove from Cart</button>
                                    <button 
                                    className="rounded-3xl bg-orange-500 hover:bg-orange-600 duration-300 mx-[4rem] py-2"
                                    onClick={()=>{
                                        alert("Go to the real amazon if you wanna buy this ..")
                                    }}>Proceed to Buy</button>
                                </div>
                            </div>
                        </div>
                    )
                })}

                <hr className="border-[0.1px] border-gray-400 mt-10" />

                <div className="p-10">
                    <button 
                    className="py-2 px-[6rem] rounded-3xl bg-orange-500 duration-300 hover:bg-orange-600"
                    onClick={()=>{
                        alert("Go the the real amazon if you wanna buy this ..")
                    }}>Buy All</button>
                </div>
            </div>

        </div>
    )
}

export default Cart;