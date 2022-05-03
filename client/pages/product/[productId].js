import React, { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";

import Header from "../../Components/header";

const productId = () => {

    // for the time of arrival stuff
    const [arrivalTime, setArrivalTime] = useState({
        day : 0,
        month: 0,
        year: 0
    })
    // leap year will be considered later
    const monthKey = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    }
    const isLeapYear=(year)=> {
        if(year%4 === 0){
            if(year%100 === 0){
                if(year%400 === 0){
                    return true;
                }else{
                    return false;
                }
            }else{
                return true;
            }
        }else{
            return false;
        }
    }

    function getMonth(monthIndex){
        const months = ["January","February","March","April",
            "May", "June", "July","August","September","October",
            "November","December"];
        return months[monthIndex];
    }

    function getNumberSub(number){
        const last = number[number.length-1];
        if(number==="11"||number==="12"||number==="13"||number==="14"){
            return "th"
        }else if(last==="1"){
            return "st"
        }else if(last === "2"){
            return "nd";
        }else if(last === "3"){
            return "rd";
        }else if(last === "4"){
            return "rth"
        }else{
            return "th";
        }
    }

    function prettifyArrivalTime(){
        let result = "";
        result += arrivalTime.day;
        result += getNumberSub(arrivalTime.day.toString());
        result += " ";
        result += getMonth(arrivalTime.month);
        result += ", ";
        result += arrivalTime.year;
        return result;
    }


    const router = useRouter();
    const productId = router.query.productId;
    const [productInfo, setProductInfo] = useState({});

    const [userInfo, setUserInfo] = useState({
        cart: {}
    });
    const [loggedIn, setLoggedIn] = useState(false);

    async function getProductInfo(){
        const res = await axios.get("http://localhost:3001/getProducts");
        const data = await res.data;
        data.map((e)=>{
            if(e._id === productId){
                setProductInfo(e);
                const d = new Date();
                let year = d.getFullYear();
                let day = d.getDate();
                let month = d.getMonth();
                const leapYear = isLeapYear(year);
                day = day + e.deliveryTime;

                while(day > monthKey[month]){
                    month += 1;
                    day -= monthKey[month];
                } 

                while(month > 12){
                    year += 1;
                    month -= 12;
                }
                setArrivalTime({
                    day: day,
                    month: month,
                    year: year
                })

            }
        })
    }

    async function getUserInfo(){
        const token  = localStorage.getItem("userToken");
        const res = await axios.get("http://localhost:3001/api/login", {
            headers: {
                "user-token": token
            }
        });
        const data = await res.data;
        console.log(data);
        if(data.userExists){
            setUserInfo(data.user);
            setLoggedIn(true);
        }
    }

    async function addToCart(){
        let newCart = userInfo.cart;
        newCart.push(productId);
        const res = await axios.post("http://localhost:3001/updateUser", {
            email: userInfo.email,
            cart: newCart
        });

        const data = await res.data;
        if(data.updated){
            alert("Added to cart successfully!")
        }else{
            alert("An error occured while adding item to cart")
        }
    }

    function prettifyNumber(number){
        if(!number){
            return number;
        }
        number = number.toString();
        let digits = 0
        let threeDigitsDone = false;
        let result = "";
        for(let i=number.length-1;i>-1;i--){
            digits += 1;
            result = number[i] + result;
            if(!threeDigitsDone){
                if(digits === 3 && i!==0){
                    result = "," + result
                    threeDigitsDone = true;
                    digits = 0;
                }
            }else{
                if(digits === 2 && i!==0){
                    result = "," + result;
                    digits = 0;
                }
            }
        }
        return result;
    }

    useEffect(()=>{
        getProductInfo();
        getUserInfo();
    },[])

    return(
        <div className="bg-white h-[100vh] overflow-y-scroll">
            <Head>
                <title>{productInfo.name} {productInfo.specifications}</title>
            </Head>

            <Header loggedIn={loggedIn} userInfo={userInfo} headerFixed={false} homePath={"../../"} />

            <div>
                <div className="grid grid-cols-2">
                    <div className="flex items-center justify-center">
                        <img src={productInfo.pictureUrl} />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[2rem] font-semibold">{productInfo.name}</span>
                        <div className="flex item-top py-2">
                            <span className="text-[1rem] mx-2 font-semibold text-gray-600">Price: </span>
                            <span className="text-[1.5rem] text-[#fb860a]">₹{prettifyNumber(productInfo.price)}/-</span>
                        </div>
                        <div className="flex items-center font-semibold">
                            <span className="text-blue-500 mx-2">Expected to arrive latest by</span> 
                            <span className="font-semibold text-[1.3rem]">{prettifyArrivalTime()}</span>
                        </div>

                        <div className="grid grid-cols-2 my-6">
                            <div className="flex items-center justify-center">
                                <button
                                className="px-[5.5rem] py-2 rounded-3xl duration-300 bg-yellow-400 hover:bg-yellow-500"
                                onClick={()=>{
                                    if(loggedIn){
                                        addToCart();
                                    }else{
                                        alert("You are not signed in ..")
                                    }
                                }}>Add to Cart</button>
                            </div>

                            <div className="flex items-center justify-center">
                                <button
                                className="px-[5.5rem] py-2 rounded-3xl duration-300 bg-orange-500 hover:bg-orange-600" 
                                onClick={()=>{
                                    alert("Go to the real amazon if you wanna buy this ..")
                                }}>Proceed To Buy</button>
                            </div>
                        </div>

                        <hr></hr>

                        <div className="py-5 px-2">
                            <span className="text-[1.5rem] font-semibold">About this item</span>
                            <div>
                                {productInfo.specifications!==undefined && productInfo.specifications.map((feature)=>{
                                    return <div className="flex items-top my-2">
                                            <span className="py-[4px] text-[0.75rem] mx-2">⚫</span>
                                            <span>{feature}</span>
                                        </div>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export function prettifyNumber(number){
    if(!number){
        return number;
    }
    number = number.toString();
    let digits = 0
    let threeDigitsDone = false;
    let result = "";
    for(let i=number.length-1;i>-1;i--){
        digits += 1;
        result = number[i] + result;
        if(!threeDigitsDone){
            if(digits === 3 && i!==0){
                result = "," + result
                threeDigitsDone = true;
                digits = 0;
            }
        }else{
            if(digits === 2 && i!==0){
                result = "," + result;
                digits = 0;
            }
        }
    }
    return result;
}

export default productId;