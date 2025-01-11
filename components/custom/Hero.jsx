"use client"
import { MessagesContext } from '@/context/MessagesContext'
import Colors from '@/data/Colors'
import Lookup from '@/data/Lookup'
import { ArrowRight, Link } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { FlipWordsTitle } from './FlipWordsTitle'

const Hero = () => {
    const [userInput, setUserInput] = useState();
    const {messages, setMessages} = useContext(MessagesContext);

    const onGenerate = (input) => {
        setMessages({
            role: 'user',
            content: input
        })
    }

  return (
    <div className='flex flex-col items-center mt-24 xl:mt-32 gap-6'>

        <FlipWordsTitle />
        <p className='text-gray-400 font-medium'>{Lookup.HERO_DESC}</p>
        
        <div className='p-5 border rounded-xl max-w-xl w-full mt-3'
        style = {{
            backgroundColor: Colors.BACKGROUND
        }}
        >
            <div className='flex gap-2'>
                <textarea 
                    onChange={(event) => setUserInput(event.target.value)} 
                    placeholder={Lookup.INPUT_PLACEHOLDER} 
                    className='outline-none bg-transparent w-full h-32 max-h-56 resize-none'
                />
                {userInput && (
                    <ArrowRight
                        onClick={() => onGenerate(userInput)}
                        className='bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer hover:bg-blue-600 transition-colors'
                    />
                )}
            </div> 
            <div className='mt-2'>
                <Link className='h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors' />
            </div>               
        </div>
        <div className='flex mt-8 flex-wrap max-w-xl justify-center gap-3'>
            {Lookup?.SUGGESTIONS.map((suggestion, index) => (
                <h2 
                    className='p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer transition-colors'
                    key={index}
                    onClick={() => onGenerate(suggestion)}
                >
                    {suggestion}
                </h2>
            ))}
        </div>
    </div>
  )
}

export default Hero
