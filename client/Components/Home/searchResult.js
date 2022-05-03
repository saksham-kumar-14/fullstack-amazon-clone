import React from "react"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/router";

import { prettifyNumber } from "../../pages/product/[productId]";

const SearchResult= ({ setSearched, searchResults, setSearchResults }) => {

    const router = useRouter();

    return(
        <div className="pt-[5.5rem]">
            <ArrowBackIcon 
            onClick={()=>{
                setSearched(false);
                setSearchResults([]);
            }}
            className="cursor-pointer w-[5rem] h-[5rem] rounded-full p-3 text-black bg-[rgb(230,230,230)]" />
            <div className="grid grid-cols-3 px-8 py-4">
                {searchResults.map((e,index)=>{
                    return(
                        <div key={"searchResult-"+index} className="flex flex-col items-center">
                            <div className="flex items-center justify-center">
                                <img
                                onClick={()=>{
                                    router.push(`/product/${e._id}`)
                                }}
                                className="border-[0.075rem] border-black rounded-md duration-200 hover:scale-105 cursor-pointer w-[300px] h-[300px]" src={e.pictureUrl} />
                            </div>
                            <div className="flex flex-col items-start">
                                <span 
                                onClick={()=>{
                                    router.push(`/product/${e._id}`)
                                }}
                                className="cursor-pointer hover:underline font-semibold text-[1.75rem]">{e.name}</span>
                                <span className="text-[1.25rem]">₹{prettifyNumber(e.price)}/-</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SearchResult