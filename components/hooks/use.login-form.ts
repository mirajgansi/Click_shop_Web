import { useState, ChangeEvent  } from "react";


export const useLoginFrom = ()=>{
    //State and funciton 
        const [email, SetEmail]= useState("");
        const [password, setPassword]= useState("");
    

        const handleUsername= (e:ChangeEvent<HTMLInputElement>)=>{
            SetEmail(e.target.value);
        }
        const handlePassword = (e:ChangeEvent<HTMLInputElement>) =>{
            setPassword(e.target.value);
        }

        const handleSubmit =()=>{
            const data ={
                "email":email,
                "password":password
            }
        }
        //return object with state and functions
        return{
            email, password, 
            SetEmail, setPassword,
            handlePassword, handleSubmit,handleUsername, 
        }
}
