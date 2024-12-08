'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Message } from 'postcss';

export function ChatBox() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1, text: "สวัสดีค่ะ ดิฉัน มะลิ เป็นพยาบาลเสมือนที่จะมาดูแลการซักประวัตินะคะ", sender: 'bot',
            type: ''
        }
    ]);

    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    
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
    
    const handleSendMessage = () => {
        if (inputMessage.trim() === '') return;
    
        // User message
        const newUserMessage: Message = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            type: ''
        };
    
        // Bot response (simple echo for demonstration)
        const botResponse: Message = {
            id: messages.length + 2,
            text: `${inputMessage}`,
            sender: 'bot',
            type: ''
        };
    
        setMessages(prevMessages => [...prevMessages, newUserMessage, botResponse]);
        setInputMessage('');
    };

    return (
        
        <div className="h-full w-4/5 border rounded-t-xl p-2 bg-white flex flex-col gap-10">
            <div className="h-4/5 w-full p-2 overflow-y-auto bg-white">
                {messages.map((message) => (
                    <div 
                        key={message.id} 
                        className={`flex ${
                            message.sender === 'user' 
                            ? 'justify-end' 
                            : 'justify-start'
                        }`}
                        >
                        <div 
                            className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'user' 
                                ? 'bg-gray-100 text-black' 
                                : 'bg-gray-100 text-black'
                            }`}
                        >
                            {message.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className='h-[50px] space-x-2'>
                <Input 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSendMessage();
                    }
                    }}
                    placeholder="Type your message..."
                    className="flex-grow"
                >
                
                </Input>
            </div>
        </div>
    )
}