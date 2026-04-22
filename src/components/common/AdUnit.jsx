import { useEffect, useRef } from 'react';

/**
 * Reusable Google AdSense ad unit component.
 * 
 * @param {string} format - Ad format: 'auto' | 'horizontal' | 'vertical' | 'rectangle'
 * @param {string} slot - The ad slot ID (optional, uses auto if not set)
 * @param {string} className - Additional CSS class for styling
 */
export default function AdUnit({ format = 'auto', slot = '', className = '', style = {} }) {
  const adRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    
    try {
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isInitialized.current = true;
      }
    } catch (e) {
      console.log('AdSense not available');
    }
  }, []);

  const layoutKey = format === 'horizontal' ? '-fb+5w+4e-db+86' : undefined;

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        ref={adRef}
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6478474654625002"
        data-ad-slot={slot}
        data-ad-format={format === 'horizontal' ? 'fluid' : format === 'auto' ? 'auto' : format}
        data-full-width-responsive="true"
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
      />
    </div>
  );
}
