'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE_URL = 'https://microhum-mali-nurse-rest-api.hf.space';

interface ExtendedMessage {
    id: number;
    text: string;
    sender: 'user' | 'nurse';
    type: string;
    feedback?: 'liked' | 'disliked' | null;
}

export function ChatBox() {
    const [messages, setMessages] = useState<ExtendedMessage[]>([
        {
            id: 1, 
            text: "สวัสดีค่ะ ดิฉัน มะลิ เป็นพยาบาลเสมือนที่จะมาดูแลการซักประวัตินะคะ", 
            sender: 'nurse',
            type: '',
            feedback: null
        }
    ]);

    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ 
            behavior: "smooth",
            block: "nearest" 
          });
        }
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
    
        const userMessageId = messages.length + 1;
        const nurseMessageId = messages.length + 2;
    
        const newUserMessage: ExtendedMessage = {
            id: userMessageId,
            text: inputMessage,
            sender: 'user',
            type: 'user',
            feedback: null
        };

        setInputMessage('');
    
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);
        setError(null);
    
        try {
          const response = await fetch(`${API_BASE_URL}/nurse_response`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_input: inputMessage
            })
          });
    
          if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
          }
    
          const data = await response.json();
    
          console.log('Full API Response:', data);
    
          const nurseResponse = 
            data.nurse_response || 
            data.response || 
            data.text || 
            'No response received';
    
          const newNurseMessage: ExtendedMessage = {
            id: nurseMessageId,
            text: nurseResponse,
            sender: 'nurse',
            type: 'nurse',
            feedback: null
          };
    
          setMessages(prev => [...prev, newNurseMessage]);
          setInputMessage('');
        } catch (error) {
          console.error('Error:', error);
          setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
          setIsLoading(false);
        }
    };

    const handleLike = (messageId: number) => {
        setMessages(prevMessages => 
            prevMessages.map(msg => 
                msg.id === messageId 
                    ? { 
                        ...msg, 
                        feedback: msg.feedback === 'liked' ? null : 'liked' 
                      } 
                    : msg
            )
        );
    };

    const handleDislike = (messageId: number) => {
        setMessages(prevMessages => 
            prevMessages.map(msg => 
                msg.id === messageId 
                    ? { 
                        ...msg, 
                        feedback: msg.feedback === 'disliked' ? null : 'disliked' 
                      } 
                    : msg
            )
        );
    };

    return (
        <div className="h-full w-4/5 border rounded-t-xl p-2 bg-white flex flex-col gap-10">
            <div className="h-4/5 w-full p-2 overflow-y-auto bg-white">
                {messages.map((message) => (
                    <div 
                        key={message.id} 
                        className={`flex mb-4 ${
                            message.sender === 'user' 
                            ? 'justify-end' 
                            : 'justify-start'
                        }`}
                    >
                        <div 
                            className={`relative max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'user' 
                                ? 'bg-gray-100 text-black' 
                                : 'bg-gray-100 text-black'
                            }`}
                        >
                            {message.text}
                            {message.sender === 'nurse' && (
                                <div className="absolute -bottom-6 right-0 flex space-x-2 mt-2">
                                    <button 
                                        onClick={() => handleLike(message.id)}
                                        className={`flex items-center space-x-1 ${
                                            message.feedback === 'liked'
                                                ? 'text-green-600'
                                                : 'text-gray-500 hover:text-green-600'
                                        }`}
                                    >
                                        <ThumbsUp size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDislike(message.id)}
                                        className={`flex items-center space-x-1 ${
                                            message.feedback === 'disliked'
                                                ? 'text-red-600'
                                                : 'text-gray-500 hover:text-red-600'
                                        }`}
                                    >
                                        <ThumbsDown size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className='h-[50px] flex space-x-2'>
                <Input 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => 
                        e.key === 'Enter' && handleSendMessage()
                    }
                    placeholder="Type your message..."
                    className="flex-grow"
                />
                <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className='h-full w-[150px]'
                >
                    Send
                </Button>
            </div>
        </div>
    )
}