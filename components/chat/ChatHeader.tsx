import botIcon from "@/public/chat/chat-header/bot.svg"
import crossIcon from "@/public/chat/chat-header/cross.svg"
import Image from "next/image";
interface ChatHeaderProps {
  onClose: () => void;
  onClearChat?: () => void;
}

export function ChatHeader({ onClose, onClearChat }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 text-white rounded-t-2xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
            <Image src={botIcon} alt="Bot" width={18} height={18} />
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-900" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Support</h3>
          <p className="text-xs text-zinc-400">Replies instantly</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {onClearChat && (
          <button
            onClick={onClearChat}
            className="px-2 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors mr-1"
          >
            New Chat
          </button>
        )}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors"
          aria-label="Close chat"
        >
          <Image src={crossIcon} alt="Cross" width={20} height={20} className="invert opacity-80 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}
