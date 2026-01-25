//use'client garna paidaina
import { exampleAction } from "@/lib/actions/example-aciton";
import { notFound } from "next/navigation";

export default async function ExamplePage() {
    const result = await exampleAction();

    if(result.sucess){
        throw new Error("Error")
    }
    
    if(result.data){
        notFound();
    }

    return (
        <div>
            load page   
        </div>
    )
}