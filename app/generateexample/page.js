'use client';

import * as fal from '@fal-ai/serverless-client';
import Image from "next/image";
import { getCookie } from 'cookies-next';
import { useState, useMemo } from 'react';
import TopLogo from "../components/TopLogo";
import BtnHexagon from "../components/BtnHexagon";
import { useRouter } from 'next/navigation';

// @snippet:start(client.config)
fal.config({
    // credentials: 'FAL_KEY_ID:FAL_KEY_SECRET',
    requestMiddleware: fal.withProxy({
      targetUrl: '/api/fal/proxy', // the built-int nextjs proxy
      // targetUrl: 'http://localhost:3333/api/fal/proxy', // or your own external proxy
    }),
});

const DEFAULT_PROMPT = 'anime style illustration of techwear, cyborg ninja, holding a sword, wearing a mask, striking pose, all limbs appear in frame, japanese vibe, detailed design for streetwear and urban style t-shirt design, solid color background, etc pro vector';
const DEFAULT_NEG_PROMPT = 'boobs, sexy, bad anatomy, bad hands, blurry, low resolution, bad, ugly, low quality, pixelated, interpolated, compression artifacts, noisey, grainy';
let URL_RESULT = ''
export default function Register() {
    const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
    const negative_prompt = DEFAULT_NEG_PROMPT;
    const [imageFile, setImageFile] = useState(localStorage.getItem("faceImage"));
    const [CGF, setCGF] = useState(7.5);
    const [numSteps, setNumSteps] = useState(50);
    const [numProses, setNumProses] = useState(0);
    // Result state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [resultFaceSwap, setResultFaceSwap] = useState(null);
    const [logs, setLogs] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    // @snippet:end
    const image = useMemo(() => {
      if (!result) {
        return null;
      }
      if (result.image) {
        return result.image;
      }
      
    }, [result]);
    const imageFaceSwap = useMemo(() => {
      if (!resultFaceSwap) {
        return null;
      }
      if (resultFaceSwap.image) {
        return resultFaceSwap.image;
      }
      return null;
    }, [resultFaceSwap]);
    
    const reset = () => {
      setLoading(false);
      setError(null);
      setResult(null);
      setResultFaceSwap(null);
      setLogs([]);
      setElapsedTime(0);
    };
    const reset2 = () => {
      setLoading(false);
      setError(null);
      // setLogs([]);
      setElapsedTime(0);
    };
  
    const generateImage = async () => {
      reset();
      // @snippet:start("client.queue.subscribe")
      setLoading(true);
      const start = Date.now();
      try {
        const result = await fal.subscribe(
          'fal-ai/ip-adapter-face-id',
          {
            input: {
              prompt,
              face_image_url: imageFile,
              negative_prompt,
              guidance_scale: CGF,
              num_inference_steps: numSteps,
              width: 624,
              height: 1024
            },
            pollInterval: 5000, // Default is 1000 (every 1s)
            logs: true,
            onQueueUpdate(update) {
              setElapsedTime(Date.now() - start);
              if (
                update.status === 'IN_PROGRESS' ||
                update.status === 'COMPLETED'
              ) {
                setLogs((update.logs || []).map((log) => log.message));
                // console.log(update)
              }
            },
          }
        );
        setResult(result);
        URL_RESULT = result.image.url
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
        setElapsedTime(Date.now() - start);
        generateImageSwap()
      }
      // @snippet:end
    };


    const generateImageSwap = async () => {
        reset2();
        // @snippet:start("client.queue.subscribe")
        setLoading(true);
        const start = Date.now();
        try {
        const result = await fal.subscribe(
            'fal-ai/face-swap',
            {
            input: {
                base_image_url: URL_RESULT,
                swap_image_url: imageFile
            },
            pollInterval: 5000, // Default is 1000 (every 1s)
            logs: true,
            onQueueUpdate(update) {
                setElapsedTime(Date.now() - start);
                if (
                update.status === 'IN_PROGRESS' ||
                update.status === 'COMPLETED'
                ) {
                setLogs((update.logs || []).map((log) => log.message));
                }
            },
            }
        );
        setResultFaceSwap(result);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
            setElapsedTime(Date.now() - start);
        }
        // @snippet:end
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-top pt-12 p-20">
            <TopLogo></TopLogo>
            <div className='relative w-[40%] mt-4 mx-auto flex justify-center items-center pointer-events-none'>
                <Image src='/registration-title.png' width={606} height={118} alt='Zirolu' className='w-full' priority />
            </div>
            <div className="relative w-full flex flex-col justify-center items-center mt-12 mb-3">
                <div className='relative w-[80%] mb-3'>
                    <label htmlFor="prompt" className="text-[#D8BA78] font-bold text-2xl mb-4 block">Prompt</label>
                    <div className='relative w-full'>
                        <input
                            type='text'
                            value={prompt}
                            id='prompt'
                            name='prompt'
                            className={`w-full border-2 border-[#D8BA78] rounded-sm font-semibold text-2xl outline-none py-6 pr-3 pl-3 text-white bg-black bg-opacity-[4%]'`}
                            placeholder='Your Name'
                            onChange={(e) => setPrompt(e.target.value)}
                            onBlur={(e) => setPrompt(e.target.value.trim())}
                        />
                    </div>
                </div>
                <div className='relative w-[80%] mb-3'>
                    <label htmlFor="image_url" className="text-[#D8BA78] font-bold text-2xl mb-4 block">Your Photo</label>
                    <div className='relative w-full'>
                        <input
                            type='file'
                            id='image_url'
                            name='image_url'
                            className={`w-full border-2 border-[#D8BA78] rounded-sm font-semibold text-2xl outline-none py-6 pr-3 pl-3 text-white bg-black bg-opacity-[4%]'`}
                            placeholder='Choose a file'
                            accept="image/*;capture=camera"
                            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                        />
                    </div>
                </div>
            </div>
            <div className="relative w-[80%] flex justify-center items-center">
                {/* <BtnHexagon
                    disabled={!isValid()}
                    onClick={handleSubmit}
                    text='Masuk'
                /> */}
                <button
                onClick={(e) => {
                    e.preventDefault();
                    generateImage();
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-3 px-6 mx-auto rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
                >
                {loading ? 'Generating...' : 'Generate Image'}
                </button>
            </div>

            {/* HASIL */}
            <div className="w-full flex flex-col space-y-4">
                <div className="mx-auto">
                    {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image.url} alt="" />
                    )}
                    {imageFaceSwap && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageFaceSwap.url} alt="" />
                    )}
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-light">JSON Result</h3>
                    <p className="text-sm text-current/80">
                    {`Elapsed Time (seconds): ${(elapsedTime / 1000).toFixed(2)}`}
                    </p>
                    <pre className="text-sm bg-black/70 text-white/80 font-mono h-60 rounded whitespace-pre overflow-auto w-full">
                    {result
                        ? JSON.stringify(result, null, 2)
                        : '// result pending...'}
                    </pre>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-light">Logs</h3>
                    <pre className="text-sm bg-black/70 text-white/80 font-mono h-60 rounded whitespace-pre overflow-auto w-full">
                    {logs.filter(Boolean).join('\n')}
                    </pre>
                </div>
            </div>
        </main>
    );
}
