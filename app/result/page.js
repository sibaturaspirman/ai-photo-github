'use client';

import Link from 'next/link';
import Image from "next/image";
import TopLogo from "../components/TopLogo";
import { getCookie } from 'cookies-next';
import { useEffect, useState, useMemo } from 'react';
import { useQRCode } from 'next-qrcode';
import io from 'socket.io-client';
import BtnHexagon2 from "../components/BtnHexagon2";


// function downloadImage(data, filename = 'untitled.jpeg') {
//     var a = document.createElement('a');
//     a.href = data;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
// }

// SETUP SOCKET
let SERVER_IP = "https://ag.socket.web.id:11100";
let NETWORK = null;

function emitNetworkConnection() {
   NETWORK = io(SERVER_IP, {
      withCredentials: false,
      transoirtOptions: {
         pooling: {
            extraHeaders: {
               "my-custom-header": "ag-socket",
            },
         },
      },
   });
}

function emitString(key, payload) {
   NETWORK.emit(key, payload);
}
// !SETUP SOCKET


export default function Result() {
    const [imageResultAI, setImageResultAI] = useState(null);
    const [generateQR, setGenerateQR] = useState(null);
    const [linkQR, setLinkQR] = useState('https://zirolu.id/');
    const [idFormEmail, setIdFormEmail] = useState(null);
    const [sendEmailGak, setSendEmailGak] = useState(null);
    const [alamatEmail, setAlamatEmail] = useState();
    const [keKirimEmailGak, setKeKirimEmailGak] = useState(null);
    const [loadingDownload, setLoadingDownload] = useState(null);
    const [showEmail, setShowEmail] = useState(null);
    const [payload, setPayload] = useState({
      name: getCookie('name'),
      phone: getCookie('phone'),
    });
    const { Canvas } = useQRCode();

    emitNetworkConnection()

    useEffect(() => {
        // Perform localStorage action
        if (typeof localStorage !== 'undefined') {
            const item = localStorage.getItem('resulAIBase64')
            // const item2 = localStorage.getItem('faceURLResult')
            setImageResultAI(item)
            // setLinkQR(item2)
        }
        // const item2 = getCookie('phone')
        // const item3 = getCookie('name')
        // setPayload(() => ({
        //     name: item2,
        //     phone: item3,
        //   }));
    }, [imageResultAI, linkQR])

    const downloadImageAI = () => {
        import('html2canvas').then(html2canvas => {
            html2canvas.default(document.querySelector("#capture"), {scale:1}).then(canvas => 
            //   document.getElementById('canvasResult').appendChild(canvas)
                uploadImage(canvas)
            )
        }).catch(e => {console("load failed")})
    }
    const uploadImage = async (canvas) => {
        // downloadImage(canvas.toDataURL("image/jpeg", 1.0), 'my-canvas.jpeg')
        // console.log(payload)
        // bodyFormData.append("file", '');
        setLoadingDownload('≈')

        if (typeof localStorage !== 'undefined') {
            const item = localStorage.getItem('faceURLResult')
            // const item2 = localStorage.getItem('faceURLResult')
            // setImageResultAI(item)
            // setLinkQR(item2)
            emitString("sendImage", item);
        }

        canvas.toBlob(async function(blob) {
            let bodyFormData = new FormData();
            bodyFormData.append("name", payload.name);
            bodyFormData.append("phone", payload.phone);
            bodyFormData.append("file", blob, payload.name+'-photo-ai-iims.png');
          
            const options = {
                method: 'POST',
                body: bodyFormData,
                headers: {
                    'Authorization': 'de2e0cc3-65da-48a4-8473-484f29386d61:xZC8Zo4DAWR5Yh6Lrq4QE3aaRYJl9lss',
                    'Accept': 'application/json',
                }
            };
            
            await fetch('https://photo-ai-iims.zirolu.id/v1/uploads', options)
                .then(response => response.json())
                .then(response => {
                    // console.log(response)
                    setLinkQR(response.file)
                    setIdFormEmail(response.id)
                    // emitString("sendImage", response.file);
                    setGenerateQR('true')
                    setLoadingDownload(null)
                    // setImageResultAI()
                    // if (typeof localStorage !== 'undefined') {
                    //     localStorage.setItem("idSendEmail", )
                    // }
                })
                .catch(err => {
                    if (typeof localStorage !== 'undefined') {
                        const item = localStorage.getItem('faceURLResult')
                        // emitString("sendImage", item);
                        setShowEmail('true')
                        setLinkQR(item)
                        // setIdFormEmail(response.id)
                        setGenerateQR('true')
                        setLoadingDownload(null)
                    }
                });
        });
    }


    const handleChange = (e) => {
        setAlamatEmail(e.target.value)
    };
    const isValid = () => {
      if (alamatEmail) return true
      else return false;
    };

    const sendEmail = async () => {
        // SENT EMAIL
        // console.log(idFormEmail)
        const options = {
            method: 'POST',
            body: JSON.stringify({
                "email": alamatEmail,
                "id": idFormEmail
            }),
            headers: {
                'Authorization': 'de2e0cc3-65da-48a4-8473-484f29386d61:xZC8Zo4DAWR5Yh6Lrq4QE3aaRYJl9lss',
                'Content-Type': 'application/json',
            }
        };
          
        await fetch('https://photo-ai-iims.zirolu.id/v1/uploads/email', options)
            .then(response => response.json())
            .then(response =>{
                // console.log(response)
                setKeKirimEmailGak('true')
                // if(response.status){
                //     setKeKirimEmailGak('true')
                // }
            })
            .catch(err => console.error(err));
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-top pt-12 pb-0 p-13">
            <TopLogo></TopLogo>

            {/* QR */}
            {sendEmailGak &&
                <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center mt-0 flex-col z-50 bg-black bg-opacity-90'>
                    <div className='relative w-[70%] mt-0 mx-auto flex justify-center items-cente'>
                        <Image src='/popup.png' width={939} height={605} alt='Zirolu' className='w-full' priority />
                        <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col'>
                            {keKirimEmailGak && 
                                <div className='relative w-[60%]' onClick={()=>{setKeKirimEmailGak(null);setSendEmailGak(null)}}>
                                    <Image
                                        src='/success.png'
                                        width={596}
                                        height={434}
                                        className='w-full'
                                        alt='icon'
                                    />
                                </div>
                            }
                            <div className={`relative w-[80%] mb-5 ${keKirimEmailGak ? 'hidden' : ''}`}>
                                <label htmlFor="email" className="text-[#D8BA78] font-bold text-2xl mb-4 block">Input Your Email</label>
                                <div className='relative w-full'>
                                    <Image
                                        src='/icon-sms.png'
                                        width={32}
                                        height={32}
                                        className='absolute left-4 top-1/2 -translate-y-1/2'
                                        alt='icon'
                                    />
                                    <input
                                        type='email'
                                        value={alamatEmail}
                                        id='email'
                                        name='email'
                                        className={`w-full border-2 border-[#D8BA78] rounded-sm font-semibold text-2xl outline-none py-6 pr-3 pl-14 text-white bg-black bg-opacity-[4%]'`}
                                        placeholder='Your Email'
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className={`relative w-[60%] flex justify-center items-center ${keKirimEmailGak ? 'hidden' : ''}`}>
                                <BtnHexagon2
                                    disabled={!isValid()}
                                    onClick={sendEmail}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
            {generateQR && 
                <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-top mt-36 flex-col z-40 bg-black bg-opacity-0'>
                    <div className='relative w-[40%] mt-0 mx-auto flex justify-center items-center' onClick={()=>{setGenerateQR(null)}}>
                        <Image src='/qr-title.png' width={668} height={172} alt='Zirolu' className='w-full' priority />
                    </div>
                    <div className='relative mt-3' onClick={()=>{setGenerateQR(null)}}>
                        <Canvas
                        text={linkQR}
                        options={{
                            errorCorrectionLevel: 'M',
                            margin: 3,
                            scale: 4,
                            width: 500,
                            color: {
                            dark: '#000000',
                            light: '#ffffff',
                            },
                        }}
                        />
                    </div>
                    <p className='text-center font-semibold text-2xl mt-5'>Scan this QR Code to Download your image.</p>

                    <div className={`relative w-full  ${showEmail ? 'hidden' : ''}`}>
                    <div className="relative w-[60%] mx-auto flex justify-center items-center flex-col mt-5">
                        <button className="relative mx-auto flex justify-center items-center" onClick={()=>setSendEmailGak('true')}>
                            <Image src='/btn-send-email.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
                        </button>
                    </div>
                    </div>
                    {/* <Link href='/' className='text-center font-semibold text-lg mt-2 p-20' onClick={()=>{setGenerateQR(null)}}>Tap here to close</Link> */}
                    <a href='/' className='text-center font-semibold text-lg mt-2 p-20'>Tap here to close</a>
                </div>
            }
            {/* QR */}

            <div className={generateQR ? `opacity-0 pointer-events-none` : ''}>
                <Link href='/generate' className='relative w-[60%] mt-0 mx-auto flex justify-center items-center pointer-events-none'>
                    <Image src='/result-title.png' width={999} height={170} alt='Zirolu' className='w-full' priority />
                </Link>
                {imageResultAI && 
                <div className='relative w-[65%] mt-4 mx-auto flex justify-center items-center  border-2 border-[#D8BA78] rounded-sm' onClick={downloadImageAI}>
                    <div className='relative' id='capture'>
                        {/* <img src={imageResultAI} className='block'></img> */}
                        <Image src={imageResultAI}  width={420} height={689} alt='Zirolu' className='relative block w-full'></Image>
                        <Image src='data:image/png;base64,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' width={181} height={91} alt='Zirolu' className='absolute  block left-0 right-0 top-2 w-[180px] mx-auto pointer-events-none z-10' />
                    </div>
                    <div id='canvasResult' className='absolute top-0 left-0 right-0 bottom-0 z-10'></div>
                </div>
                }
                {loadingDownload && 
                    <div className='relative mt-2 border-2 border-[#D8BA78] rounded-lg text-center bg-[#341B1A] text-[#D8BA78] p-2 text-xl font-bold w-[50%] mx-auto'>
                        <p>Please wait, loading...</p>
                    </div>
                }
                <div className={`relative w-full ${loadingDownload ? 'hiddenx' : ''}`}>
                    <div className={`relative w-[60%] mx-auto flex justify-center items-center flex-col mt-5 ${loadingDownload ? 'hidden' : ''}`}   >
                        <button className={`relative mx-auto flex justify-center items-center ${loadingDownload ? 'hidden' : ''}`} onClick={downloadImageAI}>
                            <Image src='/btn-download.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
                        </button>
                        {/* <button className="relative mx-auto flex justify-center items-center" onClick={sendEmail}>
                            <Image src='/btn-download.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
                        </button> */}
                    </div>
                    <div className={`w-full mt-2 ${loadingDownload ? '' : 'hidden'}`}>
                        <p className='text-center font-semibold text-xl'>QR Code stuck & tidak muncul? coba tap re-download</p>
                        <div className="relative w-[60%] mx-auto flex justify-center items-center flex-col">
                            <a href='/result' className="block w-full relative mx-auto flex justify-center items-center">
                                <Image src='/btn-redownload.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
                            </a>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className="relative w-[60%] mx-auto flex justify-center items-center flex-col">
                            <Link href='/generate' className="relative mx-auto flex justify-center items-center">
                                <Image src='/btn-retake.png' width={820} height={192} alt='Zirolu' className='w-full' priority />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
