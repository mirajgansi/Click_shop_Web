"use server";

//Server  side actions
import  {register, login} from '../api/auth'
import { setAuthToken,setUserData  } from '../cookie';
export async function handleRegister(formData:any) {
    try{
        //how to ake data from componenets
        const result = await register(formData)
        // how to send data to componenet
        if(result.success){
            return{
                success: true,
                message : "message successfull",
                data: result.data
            }
        }return {success: false, message:"Registration failed"}
        
    }catch(err:Error |any){
        return {success: false, message: err.message}
    }
}

 export async function handleLogin(formData:any) {
    try{
        //how to ake data from componenets
        const result = await login(formData)
        // how to send data to componenet
        if(result.success){
            await setUserData(result.data)
           await setAuthToken(result.token);
            return{
                success: true,
                message : "message successfull",
                data: result.data
            }
        }return {success: false, message:"Login failed"}
        
    }catch(err:Error |any){
        return {success: false, message: err.message}
    }
}
 