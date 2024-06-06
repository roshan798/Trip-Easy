import React from 'react'
import aboutImg from '../assets/images/about_img.png'
import { FaExternalLinkAlt } from 'react-icons/fa'

const About = () => {
    return (
        <div className='flex w-full justify-center'>
            <div className='flex w-[90%] max-w-2xl flex-col gap-3 rounded-xl p-3 shadow-xl'>
                <h1 className='text-center text-4xl font-semibold'>About</h1>
                <div className='flex w-max flex-col'>
                    <img src={aboutImg} className='h-40 w-40' alt='Image' />
                    <h1 className='text-center text-xl font-semibold'>
                        Sanjay NG
                    </h1>
                </div>
                <ul className='mx-5 w-max list-disc'>
                    <li className='cursor-pointer hover:text-blue-600 hover:underline'>
                        <a
                            className='flex items-center gap-2'
                            href='https://github.com/Sanjayng125'
                            target='_blank'>
                            Git-Hub <FaExternalLinkAlt />
                        </a>
                    </li>
                    <li className='cursor-pointer hover:text-pink-600 hover:underline'>
                        <a
                            className='flex items-center gap-2'
                            href='https://www.instagram.com/sanjay_ng_125/'
                            target='_blank'>
                            Instagram <FaExternalLinkAlt />
                        </a>
                    </li>
                </ul>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Quidem aliquam voluptatibus odit, saepe exercitationem autem
                    molestias asperiores dolores sit corrupti molestiae ea,
                    facere, totam necessitatibus enim quod aliquid. Quisquam,
                    dolor. aliquam voluptatibus odit, saepe exercitationem autem
                    molestias asperiores dolores sit corrupti molestiae ea,
                    facere, totam necessitatibus enim quod aliquid. Quisquam,
                    dolor.
                </p>
            </div>
        </div>
    )
}

export default About
