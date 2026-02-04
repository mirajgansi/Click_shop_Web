import ResetPasswordForm from "../_componets/resetPasswordForm";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const query = await searchParams;
    const token = query.token ? (query.token as string) : '';
    return (
        <div>
            <ResetPasswordForm token={token} />
        </div>
    );
}