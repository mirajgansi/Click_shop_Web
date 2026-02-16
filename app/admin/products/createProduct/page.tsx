import ToastProvider from "@/app/_componets/ToastProvider";
import CreateProductForm from "../_components/createProductForm";


export default function Page() {
    return (
        <div>
            <CreateProductForm/>
                <ToastProvider/>
        </div>
    );
}