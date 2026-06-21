import botIcon from "@/public/chat/chat-header/bot.svg"
import crossIcon from "@/public/chat/chat-header/cross.svg"
import Image from "next/image";
interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
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
      <button
        onClick={onClose}
        className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors"
        aria-label="Close chat"
      >
      <Image src={crossIcon} alt="Cross" width={20} height={20} />
      </button>
    </div>
  );
}
