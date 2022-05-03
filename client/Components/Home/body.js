import React , { useState , useEffect } from "react";
import axios from 'axios';
import BackArrow from '@mui/icons-material/ArrowBackIos';
import ForwardArrow from '@mui/icons-material/ArrowForwardIos';
import { useRouter } from "next/router";

import { prettifyNumber } from "../../pages/product/[productId]";

const HomeBody = () => {

    const router = useRouter();

    const [ products, setProducts ] = useState([]);
    const [ allProducts , setAllProducts ] = useState([]);
    const [ slicingInfo, setSlicingInfo ] = useState({ start:0, end:3, length:0 })

    async function getProducts(){
        const res = await axios.get("http://localhost:3001/getProducts");
        const data = await res.data;
        setAllProducts(data);

        setProducts(data.slice(slicingInfo.start, slicingInfo.end ));
    }

    useEffect(()=>{
        getProducts()
    },[])

    function addProducts(addNextProducts){

        let start = slicingInfo.start;
        let end = slicingInfo.end;

        if(addNextProducts){
            if(slicingInfo.end < allProducts.length){
                setSlicingInfo({
                    start : slicingInfo.start+1,
                    end : slicingInfo.end+1,
                    length : slicingInfo.length
                });
                start = slicingInfo.start+1;
                end = slicingInfo.end+1;
            }
        }else{
            if(slicingInfo.start > 0){
                setSlicingInfo({
                    start : slicingInfo.start-1,
                    end : slicingInfo.end-1,
                    length : slicingInfo.length
                });
                start = slicingInfo.start-1;
                end = slicingInfo.end-1;
            }
        }

        setProducts(allProducts.slice(start, end))
    }

    return(
        <div className="pt-[5.5rem]">

            <div className="flex items-center justify-center px-5 py-3 bg-white mx-10 my-3 rounded-lg">

                <div className="flex items-center justify-center w-[10%]">
                    <BackArrow
                    onClick={()=>{
                        addProducts(false)
                    }} 
                    className="w-[2.5rem] h-[2.5rem] cursor-pointer" />
                </div>

                <div className="w-[80%]">
                    <h1 className="font-bold text-[2rem] mb-8">Available Products</h1>
                    <div className="grid grid-cols-3">
                        {products.map((e,index)=>{
                            return(
                                <div className="mx-4" key={"availableProduct-"+index}>
                                    <img 
                                    onClick={()=>{router.push(`/product/${e._id}`)}} src={e.pictureUrl} 
                                    className="cursor-pointer border-[0.075rem] scale-90 border-black rounded-md hover:scale-105 duration-200 " />
                                    <div className="flex flex-col items-start px-3">
                                        <span onClick={()=>{router.push(`/product/${e._id}`)}} className="cursor-pointer hover:underline text-[1.35rem] font-semibold">{e.name}</span>
                                        <span className="text-[1.15rem]">₹{prettifyNumber(e.price)}/-</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="w-[10%]">
                    <ForwardArrow 
                    onClick={()=>{
                        addProducts(true)
                    }}
                    className="w-[2.5rem] h-[2.5rem] cursor-pointer" />
                </div>

            </div>

        </div>
    )
}

export default HomeBody;