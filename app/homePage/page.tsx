'use client';
import ProductCard from '@/components/card'
import React from 'react'

const homePage = () => {
  return (
    <div className='bg-white'>
    <div >
        <ProductCard
  image="/images/waiwai.png"
  name="Wai Wai"
  price={5}
  onAddToCart={() => console.log('Added to cart')}
  onToggleWishlist={() => console.log('Wishlist toggled')}
/>
</div>
    </div>
  )
}

export default homePage;