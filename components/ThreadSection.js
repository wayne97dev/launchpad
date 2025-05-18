// components/ThreadSection.js
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import avatar from '../public/Logo.png'

const messages = [
    {
      id: 1,
      username: "BTcTW9 (dev)",
      timestamp: "27/01/2025, 10:16:59",
      avatar: "/avatars/btctw9.png",
      content: "DEEP SICK ($ICK)",
      likes: 0,
      hasReply: false
    },
    {
      id: 2,
      username: "Bradford56",
      timestamp: "27/01/2025, 10:17:07",
      avatar: "/avatars/bradford.png",
      content: "Stop working harder. Start automating smarter.",
      likes: 0,
      hasReply: true
    },
    {
      id: 3,
      username: "Estelle91",
      timestamp: "27/01/2025, 10:17:08",
      avatar: "/avatars/estelle.png",
      content: "Look at this masterpiece.",
      likes: 0,
      hasReply: true
    },
    {
      id: 4,
      username: "CanzKN",
      timestamp: "27/01/2025, 10:17:10",
      avatar: "/avatars/canzk.png",
      content: "🚀",
      likes: 0,
      hasReply: false
    }
  ];
  

export default function ThreadSection() {
  const [activeTab, setActiveTab] = useState('thread');

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  return (
    <div className="bg-[#1a1b1e] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <button 
            className={`${activeTab === 'thread' ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setActiveTab('thread')}
          >
            thread
          </button>
          <button 
            className={`${activeTab === 'trades' ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setActiveTab('trades')}
          >
            trades
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">sort: time (asc) ↑</span>
          <button 
            onClick={() => setIsReplyModalOpen(true)}
            className="border border-green-500 text-green-500 px-3 py-1 rounded hover:bg-green-500/10"
            variant="outline"
          >
            post a reply
          </button>
        </div>
      </div>

      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent className="bg-[#1a1b1e] border-[#2a2b2e]">
          <DialogHeader>
            <DialogTitle className="text-white">add a comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              placeholder="Write your comment..."
              className="bg-[#2a2b2e] border-[#2a2b2e] min-h-[100px] text-white"
            />
            
            <div className="border-2 border-dashed border-[#2a2b2e] rounded-lg p-8 text-center">
              <p className="text-gray-400">drag & drop an image here</p>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                id="file-upload"
              />
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => document.getElementById('file-upload').click()}
              >
                choose file
              </Button>
              <p className="text-xs text-gray-500 mt-2">no file chosen</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsReplyModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                [cancel]
              </Button>
              <Button
                className="bg-green-500 text-black hover:bg-green-600"
              >
                post reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="border-b border-[#2a2b2e] pb-4">
            <div className="flex items-center gap-2 mb-2">
              <img src='http://localhost:3002/Logo.png' className="w-6 h-6 rounded-full" />
              <span className="text-white">{message.username}</span>
              <span className="text-gray-500 text-sm">{message.timestamp}</span>
            </div>
            <div className="pl-8">
              {message.image && (
                <img src={message.image} className="w-8 h-8 rounded mb-2" />
              )}
              <p className="text-white">{message.content}</p>
              <div className="flex gap-3 mt-2">
                <button className="text-gray-500 hover:text-white">♡ {message.likes}</button>
                <button className="text-gray-500 hover:text-white">[reply]</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
