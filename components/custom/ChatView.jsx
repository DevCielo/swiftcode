"use client"
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { useSidebar } from '../ui/sidebar';

export const countToken = (inputText) => {
    return inputText.trim().split(/\s+/).filter(word => word).length;
}

const ChatView = () => {
    const { id } = useParams();
    const convex = useConvex();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { messages, setMessages } = useContext(MessagesContext);
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateMessages);
    const { toggleSidebar } = useSidebar();
    const UpdateTokens = useMutation(api.users.UpdateToken);

    useEffect(() => {
        id && GetWorkspaceData();

    }, [id])
    /**
     * Used to get workspace data using workspace ID
     */
    const GetWorkspaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        })
        setMessages(result.messages);
        console.log(result);
    }

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role === 'user') {
                GetAiResponse();
            }
        }
    }, [messages])

    const GetAiResponse = async () => {
        setLoading(true);
        const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
        const result = await axios.post('/api/ai-chat', {
            prompt: PROMPT
        })
        console.log(result.data.result);
        const aiResp = {
            role: 'ai',
            content: result.data.result
        }
        setMessages(prev => [...prev, aiResp]);

        await UpdateMessages({
            messages: [...messages, aiResp],
            workspaceId: id
        })


        const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));

        // Update tokens in database
        await UpdateTokens({
            userId: userDetail?._id,
            token: token
        })

        setLoading(false);
    }

    const onGenerate = (input) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content: input
        }]);

        setUserInput('');
    }

    return (
        <div className='relative h-[75vh] flex flex-col'>
            <div className='flex-1 overflow-y-scroll scrollbar-hide'>
                {Array.isArray(messages) && messages.map((msg, index) => (
                    <div key={index} className="p-3 rounded-lg mb-2 flex gap-2 items-start leading-7" style={{
                        backgroundColor: Colors.CHAT_BACKGROUND
                    }}>
                        {msg?.role === 'user' && (
                            <Image
                                src={userDetail?.picture || '/default-user.png'}
                                alt='userImage'
                                width={35}
                                height={35}
                                className='rounded-full'
                            />
                        )}
                        <ReactMarkdown className='flex flex-col'>{msg.content}</ReactMarkdown>
                    </div>
                ))}
                {loading && <div className="p-3 rounded-lg mb-2 flex gap-2 items-center" style={{
                    backgroundColor: Colors.CHAT_BACKGROUND
                }}>
                    <Loader2Icon className='animate-spin' />
                    <h2>Generating response...</h2>
                </div>}
            </div>

            {/* Input Section */}
            <div className='flex flex-col items-start gap-2 mt-3'>
                <div
                    className='p-5 border rounded-xl max-w-xl w-full'
                    style={{
                        backgroundColor: Colors.BACKGROUND,
                    }}
                >
                    <div className='flex gap-2'>
                        <textarea
                            onChange={(event) => setUserInput(event.target.value)}
                            value={userInput}
                            placeholder={Lookup.INPUT_PLACEHOLDER}
                            className='outline-none bg-transparent w-full h-32 max-h-56 resize-none'
                        />
                        {userInput && (
                            <ArrowRight
                                onClick={() => onGenerate(userInput)}
                                className='bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer'
                            />
                        )}
                    </div>
                    <div>
                        <Link className='h-5 w-5' />
                    </div>
                </div>
                {userDetail && (
                    <Image
                        onClick={toggleSidebar}
                        src={userDetail?.picture}
                        alt='user'
                        width={30}
                        height={30}
                        className='rounded-full cursor-pointer'
                    />
                )}
            </div>


        </div>
    )
}

export default ChatView