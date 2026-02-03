'use client';

import Nav from './Nav';
import Actions from './Actions';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
<div className="text-xl font-bold text-green-600">
            Click Shop</div>
                    <Nav />
        <Actions />
      </div>
    </header>
  );
}
