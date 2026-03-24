'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatbotAPI, type ChatResponse, type ApiResponse } from '@/lib/api';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Hello! 👋 Welcome to ShopEase. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || input.trim();
    if (!messageToSend) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response: ApiResponse<ChatResponse> = await chatbotAPI.sendMessage(messageToSend);
      if (response.success && response.data) {
        const botMessage: Message = {
          role: 'bot',
          content: response.data.bot_response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg hover:shadow-xl transition-all z-40"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-40 border border-border">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">ShopEase Support</h3>
            <p className="text-sm opacity-90">We&apos;re here to help!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-muted rounded-bl-none'
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted px-3 py-2 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-3 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="sm" disabled={loading}>
                <Send size={16} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
