import React from "react"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SearchResult= ({ setSearched, searchResults, setSearchResults }) => {

    return(
        <div className="pt-[5.5rem]">
            <ArrowBackIcon 
            onClick={()=>{
                setSearched(false);
                setSearchResults([]);
            }}
            className="cursor-pointer w-[5rem] h-[5rem] rounded-full p-3 text-black bg-[rgb(230,230,230)]" />
            <div>
                {searchResults.map((e,index)=>{
                    return(
                        <div key={"searchResult-"+index} className="flex flex-col">
                            <div className="flex items-center justify-center">
                                <img src={e.pictureUrl} />
                            </div>
                            <div className="flex flex-col items-start">
                                <span>{e.name}</span>
                                <span>₹{e.price}/-</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SearchResult