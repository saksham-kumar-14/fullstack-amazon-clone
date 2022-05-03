import React, { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";

import Header from "../Components/header";
import HomeBody from "../Components/Home/body";
import SearchResult from "../Components/Home/searchResult";

const Home = () => {

  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ userInfo, setUserInfo ] = useState({cart:[]});

  // giving search result
  const [ searchResults, setSearchResults ] = useState([]);
  const [ searched, setSearched ] = useState(false);

  async function getUser(){
    const token = localStorage.getItem("userToken");
    const res = await axios.get("http://localhost:3001/api/login",{
      headers: {
        "user-token": token
      }
    });
    const data = await res.data;
    if(data.userExists){
      setLoggedIn(true);
      setUserInfo(data.user);
    }
    
  }

  useEffect(()=>{
    getUser()
  },[])
  
  return(
    <div>
      <Head>
        <title>Online Shopping Site | Amazon</title>
      </Head>

      <Header loggedIn={loggedIn} userInfo={userInfo} 
      headerFixed={true} homePath={"./"} 
      setSearched={setSearched} setSearchResults={setSearchResults} />

      {searched?
      <SearchResult setSearched={setSearched} searchResults={searchResults} setSearchResults={setSearchResults} />:
      <HomeBody />}

    </div>
  )
}


export default Home;