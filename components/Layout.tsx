import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Real-Time Stock Dashboard' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Real-time stock tracking dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </>
  );
}
