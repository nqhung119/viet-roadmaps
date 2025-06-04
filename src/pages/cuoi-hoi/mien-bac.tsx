import React from 'react';
import RoadmapTree from '@/components/RoadmapTree';
import data from '@/data/cuoi-hoi/mien-bac.json';

const MienBacPage = () => {
  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-6 text-indigo-700">
        Roadmap Cưới hỏi - Miền Bắc
      </h1>
      <p className="mb-8 text-gray-700 max-w-xl">
        Đây là lộ trình cưới hỏi phổ biến ở miền Bắc Việt Nam, bao gồm các bước quan trọng như lễ hỏi, lễ cưới và các nghi lễ liên quan.
      </p>

      <RoadmapTree data={data} />
    </main>
  );
};

export default MienBacPage;
