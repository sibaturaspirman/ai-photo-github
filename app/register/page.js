'use client';

import Image from "next/image";
import { setCookie } from 'cookies-next';
import { useState } from 'react';
import TopLogo from "../components/TopLogo";
import BtnHexagon from "../components/BtnHexagon";
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    const [payload, setPayload] = useState({
      name: '',
      phone: '',
    });

    const isValid = () => {
      if (payload.name && payload.phone) return true
      else return false;
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setPayload((prev) => ({
          ...prev,
          [name]: value,
        }));
    };

    const handleSubmit = () => {
        setCookie('name', payload.name);
        setCookie('phone', payload.phone);
        setTimeout(() => {
            router.push('/how');
        }, 250);
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-top pt-12 p-20">
            <TopLogo></TopLogo>
            <div className='relative w-[40%] mt-4 mx-auto flex justify-center items-center pointer-events-none'>
                <Image src='/registration-title.png' width={606} height={118} alt='Zirolu' className='w-full' priority />
            </div>
            <div className="relative w-full flex flex-col justify-center items-center mt-12 mb-14">
                <div className='relative w-[80%] mb-14'>
                    <label htmlFor="name" className="text-[#D8BA78] font-bold text-2xl mb-4 block">Full Name</label>
                    <div className='relative w-full'>
                        <Image
                            src='/icon-user.png'
                            width={32}
                            height={32}
                            className='absolute left-4 top-1/2 -translate-y-1/2'
                            alt='icon'
                        />
                        <input
                            type='text'
                            value={payload.name}
                            id='name'
                            name='name'
                            className={`w-full border-2 border-[#D8BA78] rounded-sm font-semibold text-2xl outline-none py-6 pr-3 pl-14 text-white bg-black bg-opacity-[4%]'`}
                            placeholder='Your Name'
                            onChange={handleChange}
                        />
                    </div>
                    {/* {payload.name} */}
                    {/* {errorMsg && <p className='text-[#E00A0A] text-xs'>{errorMsg}</p>} */}
                </div>
                <div className='relative w-[80%] mb-14'>
                    <label htmlFor="name" className="text-[#D8BA78] font-bold text-2xl mb-4 block">Phone Number</label>
                    <div className='relative w-full'>
                        <Image
                            src='/icon-call.png'
                            width={32}
                            height={32}
                            className='absolute left-4 top-1/2 -translate-y-1/2'
                            alt='icon'
                        />
                        <p className='absolute left-[3.5rem] top-1/2 font-bold text-2xl -translate-y-1/2'>+62</p>
                        <input
                            type='number'
                            value={payload.phone}
                            id='phone'
                            name='phone'
                            className={`w-full border-2 border-[#D8BA78] rounded-sm font-semibold text-2xl outline-none py-6 pr-3 pl-28 text-white bg-black bg-opacity-[4%]'`}
                            placeholder='Your number'
                            onChange={handleChange}
                        />
                    </div>
                    {/* {payload.phone} */}
                    {/* {errorMsg && <p className='text-[#E00A0A] text-xs'>{errorMsg}</p>} */}
                </div>
            </div>
            <div className="relative w-[80%] flex justify-center items-center">
                <BtnHexagon
                    disabled={!isValid()}
                    onClick={handleSubmit}
                />
            </div>

            <div className="fixed w-[70%] bottom-[6rem] flex justify-center items-center">
                <Image
                    src='/footer.png'
                    width={1068}
                    height={80}
                    className='absolute left-4 top-1/2 -translate-y-1/2'
                    alt='zirolu'
                />
            </div>
        </main>
    );
}
