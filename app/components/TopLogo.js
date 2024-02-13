import Image from 'next/image';
import React from 'react';

const Nav = () => {
  return (
    <div className='relative w-[180px] mx-auto flex justify-center items-center pointer-events-none z-50'>
      <Image src='/logo.png' width={181} height={91} alt='Zirolu' className='w-full' priority />
    </div>
  );
};

export default Nav;
