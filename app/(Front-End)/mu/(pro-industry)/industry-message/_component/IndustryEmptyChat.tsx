"use client";

import { MessageSquare, Users } from "lucide-react";

function IndustryEmptyChat() {
  return (
    <div className="h-full min-h-[450px] flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 rounded-r-xl">
      <div className="w-16 h-16 rounded-full bg-primaryColor/10 flex items-center justify-center text-primaryColor mb-4 shadow-xs">
        <MessageSquare className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-headerColor mb-1">
        Pro Industry Messaging
      </h3>
      <p className="text-sm text-descriptionColor max-w-sm mb-4">
        Connect directly with candidates, applicants, and community members. As a Pro Industry account, you can message any user without requiring a prior connection.
      </p>
      <div className="inline-flex items-center gap-2 text-xs text-primaryColor bg-primaryColor/10 px-3 py-1.5 rounded-full font-medium">
        <Users className="w-3.5 h-3.5" />
        <span>Direct messaging enabled</span>
      </div>
    </div>
  );
}

export default IndustryEmptyChat;

