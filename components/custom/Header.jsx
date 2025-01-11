"use client";
import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button';
import Colors from '@/data/Colors';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="p-6 flex justify-between items-center shadow-md bg-card">
      <Link href="/">
        <Image
          src="/logo3.png"
          alt="Logo"
          width={50}
          height={50}
          className="cursor-pointer"
        />
      </Link>
      <div className="flex items-center gap-4">
        <Button variant="ghost">Sign In</Button>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Get Started
        </Button>
      </div>
    </header>
  );
};

export default Header;
