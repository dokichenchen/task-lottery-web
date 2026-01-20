import React, { useState } from 'react';
import { Task } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  winners: string[];
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, task, winners }) => {
  const [mode, setMode] = useState<'text' | 'link'>('text');

  if (!isOpen) return null;

  // Generate a portable link that contains all necessary data parameters
  const generateShareUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('t', task.title);
    params.set('w', winners.join(','));
    params.set('c', task.color);
    params.set('i', task.icon);
    params.set('cnt', task.winnersCount.toString());
    
    // Construct URL: baseUrl/#/share?params...
    // Note: Assuming HashRouter is used
    return `${baseUrl}#/share?${params.toString()}`;
  };

  const shareUrl = generateShareUrl();
  const winnersText = winners.join(', ');
  const baseShareText = `任務: ${task.title}\n中獎者: ${winnersText}`;
  const fullShareText = `${baseShareText}\n\n查看詳細結果:\n${shareUrl}`;

  const copyAndOpen = async (appUrl: string, appName: string) => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      // Give visual feedback or simple alert before switching apps
      if (confirm(`已複製抽籤結果與連結，是否開啟 ${appName} 並貼上發送？`)) {
         window.location.href = appUrl;
      }
    } catch (err) {
      console.error('Clipboard failed', err);
      alert('複製失敗，請手動複製文字');
    }
  };

  const handleNativeShare = async () => {
    // Check if Web Share API is supported (works on most mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: '任務抽籤結果',
          text: fullShareText,
          url: shareUrl
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed', error);
      }
    } else {
      // Fallback for browsers that don't support it
      alert('您的瀏覽器不支援原生分享功能，請使用複製文字功能。');
    }
  };

  const handleLineShare = () => {
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(fullShareText)}`, '_blank');
  };

  const handleMessengerShare = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      copyAndOpen('fb-messenger://', 'Messenger');
    } else {
      window.open('https://www.messenger.com/', '_blank');
    }
  };

  const handleWeChatShare = () => {
    copyAndOpen('weixin://', 'WeChat');
  };

  const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        alert('已複製到剪貼簿');
    } catch (err) {
        console.error('Failed to copy', err);
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[480px] bg-white rounded-t-[2.5rem] px-6 pt-3 pb-8 shadow-2xl animate-slide-up" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pt-1 mb-4">
          <div className="w-10"></div>
          <div className="h-1.5 w-12 rounded-full bg-stone-200"></div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full text-morandi-text-muted hover:bg-stone-50 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-lg font-bold text-morandi-text-dark tracking-tight">分享結果</h2>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-bold text-morandi-plum tracking-[0.15em] uppercase px-1">
              分享至社群
            </span>
            <div className="flex justify-between items-start px-1">
              <ShareButton 
                color="#06C755" 
                icon="chat" 
                label="LINE" 
                onClick={handleLineShare}
              />
              <ShareButton 
                color="#0084FF" 
                icon="chat_bubble" 
                label="Messenger" 
                onClick={handleMessengerShare}
              />
              <ShareButton 
                color="#07C160" 
                icon="forum" 
                label="WeChat" 
                onClick={handleWeChatShare}
              />
              <button 
                onClick={handleNativeShare}
                className="flex flex-col items-center gap-2 active:opacity-60 transition-opacity group"
              >
                <div className="w-14 h-14 bg-stone-100 rounded-app-icon flex items-center justify-center text-morandi-charcoal group-hover:bg-stone-200 transition-colors">
                  <span className="material-symbols-outlined text-2xl">more_horiz</span>
                </div>
                <span className="text-[11px] font-medium text-morandi-text-muted">更多</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                setMode('link');
                copyToClipboard(shareUrl);
              }}
              className={`h-14 flex flex-col items-center justify-center rounded-app-button transition-all active:scale-[0.97] ${
                mode === 'link' 
                  ? 'bg-morandi-plum text-white shadow-lg shadow-morandi-plum/20' 
                  : 'bg-stone-100 text-morandi-charcoal hover:bg-stone-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">link</span>
                <span className="font-bold">複製連結</span>
              </div>
            </button>
            <button 
              onClick={() => {
                setMode('text');
                copyToClipboard(fullShareText);
              }}
              className={`h-14 flex items-center justify-center gap-2 rounded-app-button transition-all active:scale-[0.97] ${
                mode === 'text' 
                  ? 'bg-morandi-plum text-white shadow-lg shadow-morandi-plum/20' 
                  : 'bg-stone-100 text-morandi-charcoal hover:bg-stone-200'
              }`}
            >
              <span className="material-symbols-outlined text-xl">content_copy</span>
              <span className="font-bold">複製文字</span>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end px-1">
              <span className="text-[11px] font-bold text-morandi-plum tracking-[0.15em] uppercase">預覽內容</span>
            </div>
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-morandi-plum"></div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm text-morandi-text-muted whitespace-nowrap">任務:</span>
                  <span className="text-sm font-bold text-morandi-text-dark">{task.title}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm text-morandi-text-muted whitespace-nowrap">中獎:</span>
                  <span className="text-sm font-bold text-morandi-plum-deep">{winnersText}</span>
                </div>
                <div className="flex items-start gap-2 mt-2 pt-2 border-t border-stone-200">
                  <span className="text-xs text-morandi-text-muted break-all line-clamp-2">{shareUrl}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareButton = ({ color, gradient, icon, label, onClick }: { color?: string, gradient?: string, icon: string, label: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 active:opacity-60 transition-opacity"
  >
    <div 
      className={`w-14 h-14 rounded-app-icon flex items-center justify-center text-white ${gradient ? gradient : ''}`}
      style={color ? { backgroundColor: color } : {}}
    >
      <span className="material-symbols-outlined text-3xl icon-fill">{icon}</span>
    </div>
    <span className="text-[11px] font-medium text-morandi-text-muted">{label}</span>
  </button>
);