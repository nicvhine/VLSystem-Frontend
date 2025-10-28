'use client';

import React, { useState } from "react";
import PenaltyEndorsementTab from "./penaltyEndorsement";
import ClosureEndorsementTab from "./closureEndorsement";
import Manager from "@/app/userPage/managerPage/page";

export default function PenaltiesPage() {
  const [activeTab, setActiveTab] = useState<'penalty' | 'closure'>('penalty');

  return (
    <Manager>
    <div className="p-6">
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'penalty' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('penalty')}
        >
          Penalty Endorsement
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'closure' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('closure')}
        >
          Closure Endorsement
        </button>
      </div>

      <div>
        {activeTab === 'penalty' ? <PenaltyEndorsementTab /> : <ClosureEndorsementTab />}
      </div>
    </div>
    </Manager>
  );
}
