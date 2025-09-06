import React from 'react';
import { CareerProfile, ChatMessage } from '../types';
import { getChatResponseStream } from '../services/apiService';
import Card from './shared/Card';

interface ChatbotProps {
  careerProfile: CareerProfile;
}

const BotMessage: React.FC<{ text: string }> = ({ text }) => {
    const renderPart = (part: string, key: number) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={key}>{part.slice(2, -2)}</strong>;
        }
        return part;
    };

    const blocks = text.split('\n\n'); // Split by double newline for paragraphs

    return (
        <div className="space-y-2">
            {blocks.map((block, index) => {
                const trimmedBlock = block.trim();
                // Check if the block is a list
                if (trimmedBlock.startsWith('* ') || trimmedBlock.startsWith('- ')) {
                    const listItems = block.split('\n').map(item => item.trim().replace(/^[\*\-]\s*/, ''));
                    return (
                        <ul key={index} className="list-disc list-inside space-y-1">
                            {listItems.map((item, i) => (
                                <li key={i}>
                                    {item.split(/(\*\*.*?\*\*)/g).map(renderPart)}
                                </li>
                            ))}
                        </ul>
                    );
                }
                
                // Otherwise, it's a paragraph
                return (
                    <p key={index}>
                        {block.split(/(\*\*.*?\*\*)/g).map(renderPart)}
                    </p>
                );
            })}
        </div>
    );
};


const Chatbot: React.FC<ChatbotProps> = ({ careerProfile }) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessage: ChatMessage = { role: 'bot', text: '' };
    setMessages((prev) => [...prev, botMessage]);

    try {
        const stream = await getChatResponseStream(careerProfile, [...messages, userMessage]);

        let text = '';
        for await (const chunk of stream) {
            text += chunk;
            setMessages((prev) =>
                prev.map((msg, index) =>
                    index === prev.length - 1 ? { ...msg, text: text } : msg
                )
            );
        }
    } catch (error) {
        console.error('Chatbot error:', error);
        const errorText = 'Sorry, I encountered an error. Please try again.';
        setMessages((prev) =>
            prev.map((msg, index) =>
                index === prev.length - 1 ? { ...msg, text: errorText } : msg
            )
        );
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="p-4 md:p-6">
        <h3 className="text-2xl font-bold text-center text-cyan-600 mb-4">Career Clinic</h3>
        <p className="text-center text-gray-500 mb-6">Have more questions? Ask our AI counselor in the Career Clinic!</p>
        <div className="h-96 bg-gray-100 rounded-lg p-4 overflow-y-auto flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${
                  msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.role === 'user' ? msg.text : null}
                {msg.role === 'bot' && msg.text ? <BotMessage text={msg.text} /> : null}
                {msg.role === 'bot' && !msg.text && <span className="italic">Thinking...</span>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about skills, courses, or jobs..."
            className="flex-grow bg-white border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-800"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-cyan-600 text-white font-bold rounded-r-full px-6 py-2 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Chatbot;