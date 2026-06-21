'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import openIcon from '@/public/chat/chat-widget/open.svg';
import closeIcon from '@/public/chat/chat-widget/close.svg';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputArea } from './ChatInputArea';
import { useChat } from './useChat';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, error, sendMessage, messagesEndRef } = useChat();

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end sm:bottom-8 sm:right-8">
      {isOpen && (
        <div className="mb-4 flex flex-col w-[350px] sm:w-[380px] h-[550px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden dark:bg-zinc-950 dark:border-zinc-800 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <ChatHeader onClose={() => setIsOpen(false)} />
          
          {error && (
            <div className="bg-red-50 text-red-600 text-xs px-4 py-2 text-center border-b border-red-100 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          <ChatMessageList 
            messages={messages} 
            isLoading={isLoading} 
            messagesEndRef={messagesEndRef} 
          />
          
          <ChatInputArea 
            onSend={sendMessage} 
            isLoading={isLoading} 
          />
        </div>
      )}

      <button
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen 
            ? 'bg-zinc-800 text-white rotate-90 dark:bg-zinc-200 dark:text-black' 
            : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <Image src={closeIcon} alt="Close chat" width={24} height={24} />
        ) : (
          <Image src={openIcon} alt="Open chat" width={24} height={24} className="invert dark:invert-0" />
        )}
      </button>
    </div>
  );
}
