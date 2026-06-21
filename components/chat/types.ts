export type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
};

export type ChatSession = {
  sessionId: string;
  messages: Message[];
};
