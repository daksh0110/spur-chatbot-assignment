import Image from 'next/image';
import  { useState, FormEvent, KeyboardEvent } from 'react';
import sendIcon from "@/public/chat/chat-header/send.svg"
interface ChatInputAreaProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInputArea({ onSend, isLoading }: ChatInputAreaProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-3 bg-white border-t border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800">
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-zinc-50 border border-zinc-200 p-1.5 rounded-2xl dark:bg-zinc-900 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-white/10 transition-shadow"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 max-h-32 min-h-[40px] bg-transparent resize-none border-0 focus:ring-0 px-3 py-2 text-sm outline-none dark:text-white"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="h-10 w-10 flex-shrink-0 bg-zinc-900 text-white rounded-xl flex items-center justify-center transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          aria-label="Send message"
        >
         <Image src={sendIcon} alt='send' width={18} height={18} />
        </button>
      </form>
      <div className="text-center mt-2">
        <span className="text-[10px] text-zinc-400 font-medium">Powered by E-Commerce</span>
      </div>
    </div>
  );
}
