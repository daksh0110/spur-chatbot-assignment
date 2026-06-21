import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from './types';
import { getCookie, setCookie, deleteCookie } from '@/lib/cookies';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionIdState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return getCookie('sessionId');
    }
    return null;
  });
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const fetchMessages = useCallback(async (sid: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat/message?sessionId=${sid}`);
      if (response.ok) {
        const json = await response.json();
        const historyData = json.data?.messages || [];
        if (historyData.length > 0) {
          const history: Message[] = historyData.map((m: { id: string; type: string; message: string; created_at: string }) => ({
            id: m.id,
            sender: m.type === 'USER' ? 'user' : 'bot',
            text: m.message,
            timestamp: m.created_at,
          }));
          setMessages(history);
        }
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      fetchMessages(sessionId);
    }
  }, [sessionId, fetchMessages]);

  const setSessionId = useCallback((id: string) => {
    setSessionIdState(id);
    setCookie('sessionId', id);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          ...(sessionId && { sessionId }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const json = await response.json();
      const responseData = json.data || json;
      
      if (responseData.sessionId && !sessionId) {
        setSessionId(responseData.sessionId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: responseData.reply || "I didn't get a response. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to connect to the agent. Please try again later.');
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Sorry, I encountered an error. Please try again later.',
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, setSessionId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionIdState(null);
    deleteCookie('sessionId');
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    messagesEndRef,
    clearChat,
  };
}
