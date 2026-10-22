import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Smartphone, Sparkles, Check } from 'lucide-react';

export default function InstallAppModal({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallSuccess
}) {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA already
    const isApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(!!isApp);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isApple);
  }, []);

  if (!isOpen || isStandalone) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        if (onInstallSuccess) onInstallSuccess();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#25132d] via-[#190d23] to-[#120819] rounded-[32px] p-5 sm:p-6 border border-pink-500/30 shadow-2xl text-white space-y-4 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-pink-500/30 border border-pink-400/30 flex-shrink-0">
            🌸
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 block">
              Shortcut App
            </span>
            <h3 className="text-lg font-black tracking-tight text-white leading-tight">
              Download as Phone App
            </h3>
          </div>
        </div>

        <p className="text-xs text-pink-100/80 leading-relaxed">
          Add Ritudhara to your home screen for 1-tap instant access, silky smooth 3D animations, and 100% offline period tracking without browser bars.
        </p>

        {/* Dynamic Instructions based on Device */}
        {deferredPrompt ? (
          // Android / Chrome 1-tap install
          <div className="space-y-2 pt-1">
            <button
              onClick={handleNativeInstall}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install App to Home Screen</span>
            </button>
          </div>
        ) : isIOS ? (
          // iPhone Safari instructions
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs text-white/90">
            <div className="font-bold text-pink-300 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              Install on iPhone in 2 taps:
            </div>
            
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-pink-500/30 text-pink-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                1
              </div>
              <div className="leading-snug">
                Tap the <strong className="text-white">Share</strong> button <Share className="w-3.5 h-3.5 inline mx-0.5 text-pink-300" /> at the bottom of Safari.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-pink-500/30 text-pink-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="leading-snug">
                Scroll down and select <strong className="text-white">"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-pink-300" />.
              </div>
            </div>
          </div>
        ) : (
          // Standard browser / Android fallback
          <div className="space-y-2 pt-1">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-pink-200/80 leading-relaxed">
              💡 Tap your browser menu (<strong>⋮</strong> or <strong>Share</strong>) and select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Check className="w-4 h-4" />
              <span>Got it!</span>
            </button>
          </div>
        )}

        {/* Footer Dismiss Button */}
        <div className="text-center pt-1">
          <button
            onClick={onClose}
            className="text-xs text-white/50 hover:text-white transition font-medium"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
