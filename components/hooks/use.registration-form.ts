import { useState,ChangeEvent } from "react";


export const useRegistrationForm =()=>{
       const [username, setUsername]= useState("");
        const [password, setPassword]= useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const[email, setEmail]= useState("");
        const[lastname, setLastname]= useState("");


        const handleUsername= (e:ChangeEvent<HTMLInputElement>)=>{
            setUsername(e.target.value);
        }
          const handleLastname= (e:ChangeEvent<HTMLInputElement>)=>{
            setLastname(e.target.value);
        }
          const handleEmail= (e:ChangeEvent<HTMLInputElement>)=>{
            setEmail(e.target.value);
        }
        const handlePassword = (e:ChangeEvent<HTMLInputElement>) =>{
            setPassword(e.target.value);
        }
          const handleconfirm = (e:ChangeEvent<HTMLInputElement>) =>{
            setConfirmPassword(e.target.value);
        }

        const handleSubmit = () => {
  if (
    !username.trim() ||
    !lastname.trim() ||
    !email.trim() ||
    !password.trim() ||
    !confirmPassword.trim()
  ) {
    alert("All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const data = {
    username,
    lastname,
    email,
    password,
  };

  console.log(data);
  alert("Registration successful");
};
        return{
            username, password, lastname, email, confirmPassword,
            setUsername, setPassword,
            handlePassword, handleSubmit,handleUsername, handleLastname, handleEmail, handleconfirm
        }
}

