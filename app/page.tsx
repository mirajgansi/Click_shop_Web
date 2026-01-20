import Image from "next/image";
import OnBoarding from "./onboarding/page";
import { useAuth } from "./(auth)/context/AuthContext";



export default function Home() {
  // const { user , logout} = useAuth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-100 font-sans dark:bg-green-100">
      
      <OnBoarding/>
      {/* {user && 'welcome, ' + user.name }
      {user && <button onClick={logout}>Logout</button>} */}
    </div>
  );
}
