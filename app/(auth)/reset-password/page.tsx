import ResetPasswordForm from "../_componets/resetPasswordForm";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const email =
    typeof searchParams.email === "string" ? searchParams.email : "";

  return (
    <div>
      <ResetPasswordForm initialEmail={email} />
    </div>
  );
}
