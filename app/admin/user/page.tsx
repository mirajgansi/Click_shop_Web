import Link from "next/link";
import { UsersTable } from "./_componenet/usersTable";

export default function Page() {
    return (
        <div>
            <Link className="text-blue-500 border border-blue-500 p-2 rounded inline-block mb-10"
             href="/admin/user/create">Create User</Link>

             
               <UsersTable />

        </div>
    );
}