import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
 <div className="min-h-screen flex">
  {/* Left side: Auth form */}
  <div
    className="
      w-full max-w-md
      min-h-screen
      p-8
      bg-gradient-to-br
      from-[#fdfefe] via-[#ffeef4] to-[#eafbf1]
    "
  >
    <div className="flex justify-center mb-6">
      <Image
        src="/cookie.jpg"
        width={80}
        height={80}
        alt="Logo"
        className="rounded-full"
      />
    </div>
    {children}
  </div>

<div className="flex-1 relative min-h-screen">
  <Image
    src="/grocery_image.png"
    alt="grocery"
    fill                  
    className="object-cover"
    quality={100}       
    priority              
  />
</div>
</div>

  );
}
