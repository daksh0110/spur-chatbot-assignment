import React from 'react';
import { Message } from './types';

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessageList({ messages, isLoading, messagesEndRef }: ChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center mt-24 mb-10 text-center px-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl shadow-sm">
            Hi there! 👋 I am the E-commerce support agent. How can I help you today?
          </p>
        </div>
      )}
      
      {messages.map((msg) => {
        const isUser = msg.sender === 'user';
        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                isUser
                  ? 'bg-zinc-900 text-white rounded-br-sm'
                  : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-sm shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      })}
      
      {isLoading && (
        <div className="flex flex-col items-start">
          <div className="bg-white border border-zinc-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} className="h-px w-full" />
    </div>
  );
}
