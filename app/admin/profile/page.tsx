import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import UpdateFrom from "./_components/updateForm";


export default async function Page() {
    const result = await handleWhoami();
    if(!result.success){
        throw new Error("Error fetching user data")
    }
    if(!result.data){
            notFound();
            }
    return (
        <div>
            <UpdateFrom user={result.data}/>
        </div>
    );
}
