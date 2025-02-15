"use client";

import { MessagesContext } from '@/context/MessagesContext';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import { ArrowRight, Link } from 'lucide-react';
import React, { useContext, useState, useEffect } from 'react';
import { FlipWordsTitle } from './FlipWordsTitle';
import { UserDetailContext } from '@/context/UserDetailContext';
import SignInDialog from './SignInDialog';
import { useTheme } from 'next-themes';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const [userInput, setUserInput] = useState('');
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onGenerate = async (input) => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }

    const msg = {
      role: "user",
      content: input,
    };

    // setMessages((prevMessages) => [...prevMessages, msg]);

    const workspaceId = await CreateWorkspace({
      user: userDetail._id,
      messages: [msg],
    });
    console.log(workspaceId);
    router.push('/workspace/' + workspaceId);
  };

  const arrowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    exit: { opacity: 0, y: 20, transition: { duration: 0.5 } },
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className='flex flex-col items-center mt-20 xl:mt-20 gap-6'>
      <FlipWordsTitle />
      <p className='text-gray-400 font-medium'>{Lookup.HERO_DESC}</p>

      <div
        className='p-5 border rounded-xl max-w-xl w-full mt-3'
        style={{
          backgroundColor:
            resolvedTheme === "light" ? "#ffffff" : Colors.BACKGROUND,
        }}
      >
        <div className='flex gap-2'>
          <textarea
            onChange={(event) => setUserInput(event.target.value)}
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className={`outline-none w-full h-32 max-h-56 resize-none ${
              resolvedTheme === "light"
                ? "bg-white text-black placeholder-gray-500"
                : "bg-[#151515] text-white placeholder-gray-400"
            }`}
          />
          
          <AnimatePresence>
            {userInput && (
              <motion.div
                key="arrowButton"
                variants={arrowVariants}
                initial="hidden"
                animate="visible"
                exit="exit" 
                whileHover="hover"
                whileTap="tap"
                onClick={() => onGenerate(userInput)}
                className='bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer hover:bg-blue-600 transition-colors flex items-center justify-center'
              >
                <ArrowRight className='text-white h-6 w-6' />
              </motion.div>
            )}
          </AnimatePresence>
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

      <SignInDialog
        openDialog={openDialog}
        closeDialog={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default Hero;
