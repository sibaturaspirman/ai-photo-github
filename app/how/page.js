'use client';

import Link from 'next/link';
import Image from "next/image";
import TopLogo from "../components/TopLogo";
export default function How() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-top pt-12 p-20">
            <TopLogo></TopLogo>
            <div className='relative w-[40%] mt-2 mx-auto flex justify-center items-center pointer-events-none'>
                <Image src='/how-title.png' width={820} height={168} alt='Zirolu' className='w-full' priority />
            </div>
            <div className="relative w-full flex flex-col justify-center items-center mt-3 mb-3">
                <div className='relative w-[80%] mb-14'>
                    <Image src='/how-to.png' width={1126} height={1406} alt='Zirolu' className='w-full' priority />
                </div>
            </div>

            <div className="relative w-full flex justify-center items-center">
                <Link href='/cam' className="relative mx-auto flex justify-center items-center">
                    <Image src='/btn-areyouready.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
                </Link>
            </div>
        </main>
    );
}
