import React from "react";
import configDetails from "../Config/Config";

async function getAllCartItems({userEmail}){
    try{
        const api=`${configDetails.baseUrl}${configDetails.getUserCartItems}?email=${userEmail}`
        const response=await fetch(api,{
            method:'GET',
            headers:{
                "Content-Type": "application/json",
                'Authorization':authIdToken
            }
        })
        if(response.ok){
            const responseData= await response.json()
            return responseData;
        }else{
            console.log("Error in Getting Cart Items.")
        }
    }catch(error){
        console.log("failed to get Cart Items")
    }
}

export default getAllCartItems;