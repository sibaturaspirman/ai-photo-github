import Image from "next/image";
import Link from 'next/link';
import TopLogo from "./components/TopLogo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center pt-12 p-20">
      <TopLogo></TopLogo>
      <div className='relative w-[80%] mx-auto flex justify-center items-center pointer-events-none'>
        <Image src='/front-title.png' width={534} height={119} alt='Zirolu' className='w-full' priority />
      </div>
      <div className="relative w-full flex justify-center items-center mt-12 mb-14">
        <div className='animate-upDown relative w-1/3 mx-auto flex justify-center items-center pointer-events-none'>
          <Image src='/preview-1.png' width={264} height={642} alt='Zirolu' className='w-full' priority />
        </div>
        <div className='animate-upDown2 relative w-1/3 mx-auto flex justify-center items-center pointer-events-none'>
          <Image src='/preview-2.png' width={264} height={642} alt='Zirolu' className='w-full' priority />
        </div>
        <div className='animate-upDown3 relative w-1/3 mx-auto flex justify-center items-center pointer-events-none'>
          <Image src='/preview-3.png' width={264} height={642} alt='Zirolu' className='w-full' priority />
        </div>
      </div>
      <div className="relative w-full flex justify-center items-center">
        <Link href='/register' className="relative mx-auto flex justify-center items-center">
          <Image src='/btn-taptostart.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
        </Link>
      </div>
    </main>
  );
}
