import { exampleAction } from "@/lib/actions/example-aciton";

export default async function ExamplePage() {
    const result = await exampleAction();
    return (
        <div>
            load page
        </div>
    )
}
