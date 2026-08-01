import { MessageCircle } from "lucide-react";

export function ChatButton() {
  return (
    <button className="fixed bottom-11 lg:right-11 right-7 z-[70] flex lg:h-[76px] lg:w-[76px] h-[60px] w-[60px] items-center justify-center rounded-full bg-black text-white shadow-xl" aria-label="Chat">
      <MessageCircle className="h-8 w-8 fill-white" />
    </button>
  );
}
