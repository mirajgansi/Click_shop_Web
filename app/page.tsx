import Image from "next/image";
import OnBoarding from "./onboarding/page";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-100 font-sans dark:bg-green-100">
      <OnBoarding/>
    </div>
  );
}
