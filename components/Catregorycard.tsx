'use client';

import Image from 'next/image';
import Link from 'next/link';

type CategoryCardProps = {
  title: string;
  image: string;
  href: string;
};

export default function CategoryCard({
  title,
  image,
  href,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="
        group
        flex flex-col items-center justify-center
        bg-white
        rounded-2xl
        p-4
        shadow-sm
        hover:shadow-md
        transition
        hover:-translate-y-1
      "
    >
      <div className="relative w-20 h-20 cursor-pointer">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
        />
      </div>

      <p className="mt-3 text-sm font-medium text-gray-800 group-hover:text-green-600 transition">
        {title}
      </p>
    </Link>
  );
}
