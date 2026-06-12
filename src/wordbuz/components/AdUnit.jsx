import React from 'react';

const AdUnit = ({ type = 'banner', slotId }) => {
  return (
    <div className={`ad-unit my-8 mx-auto overflow-hidden relative ${
      type === 'banner' ? 'max-w-2xl' : 'max-w-sm'
    }`}>
      <div className={`bg-white/[0.02] border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-700 relative ${
        type === 'banner' ? 'h-24 sm:h-28' : 'aspect-square'
      }`}>
        <div className="text-center space-y-1">
          <div className="text-xs font-bold ">Ad Placement</div>
          <div className="text-[9px] font-mono ">{slotId || 'auto'}</div>
        </div>
      </div>
      
      {/* 
        Real AdSense implementation:
        <ins className="adsbygoogle"
             style={{display: 'block'}}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot={slotId}
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      */}
    </div>
  );
};

export default AdUnit;
