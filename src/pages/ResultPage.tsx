import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Task } from '../types';
import { ShareModal } from '../components/ShareModal';

interface ResultPageProps {
  tasks: Task[];
}

export const ResultPage: React.FC<ResultPageProps> = ({ tasks }) => {
  const navigate = useNavigate();
  const { taskId, memberList } = useParams<{ taskId: string; memberList: string }>();
  const [searchParams] = useSearchParams();
  
  // Check if we are in "Share View" mode (reading from URL params)
  const isShareMode = searchParams.has('t') && searchParams.has('w');

  // State
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [winners, setWinners] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize Data
  useEffect(() => {
    if (isShareMode) {
      // 1. Share Mode: Reconstruct task and winners from URL query params
      const title = searchParams.get('t') || '未知任務';
      const winnerStr = searchParams.get('w') || '';
      const color = searchParams.get('c') || '#9A8C98';
      const icon = searchParams.get('i') || 'celebration';
      const count = parseInt(searchParams.get('cnt') || '1', 10);

      setTask({
        id: 'share-id', // Dummy ID
        title,
        color: decodeURIComponent(color),
        icon,
        category: 'Shared',
        winnersCount: count,
        members: []
      });
      setWinners(winnerStr.split(','));
    } else {
      // 2. Normal Mode: Find task from props and draw winners
      const foundTask = tasks.find(t => t.id === taskId);
      
      if (foundTask && memberList) {
        setTask(foundTask);
        // Draw logic
        const members = memberList.split(',');
        const shuffled = [...members].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(foundTask.winnersCount, members.length));
        setWinners(selected);
      }
    }
  }, [taskId, memberList, tasks, isShareMode, searchParams]);

  const handleRedraw = () => {
    if (isShareMode) {
        // Can't redraw a shared static result
        alert("這是分享的結果頁面，若要重新抽籤請回到首頁建立新任務。");
        navigate('/');
        return;
    }
    
    if (!task || !memberList) return;
    const members = memberList.split(',');
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(task.winnersCount, members.length));
    setWinners(selected);
  };

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
        <p className="text-morandi-text-muted mb-4">找不到任務資料...</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-morandi-midnight text-white rounded-full">回到首頁</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col text-[#2D2926]" style={{ "--task-color": task.color } as React.CSSProperties}>
      <div className="flex items-center p-4 pb-2 justify-between shrink-0 md:pt-8">
        <div onClick={() => navigate('/')} className="text-[#2D2926] flex size-12 shrink-0 items-center justify-start cursor-pointer hover:bg-stone-50 rounded-full pl-1">
          <span className="material-symbols-outlined">home</span>
        </div>
        <h2 className="text-[#2D2926] text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">
          {isShareMode ? '抽籤結果分享' : '抽籤結果'}
        </h2>
      </div>

      <main className="flex-1 flex flex-col items-center px-6 relative animate-fade-in w-full">
        <div className="w-full max-w-sm mt-4 mb-4">
          <div className="bg-white rounded-[1.25rem] p-5 border border-[#F0EBEB] flex items-center gap-4 card-shadow">
            <div className="w-12 h-12 bg-stone-50 rounded-[1.25rem] flex items-center justify-center" style={{ color: task.color }}>
              <span className="material-symbols-outlined text-2xl">{task.icon}</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-[10px] uppercase tracking-[0.1em] opacity-70" style={{ color: task.color }}>
                {isShareMode ? '來自好友的分享' : '當前任務'}
              </p>
              <h1 className="text-[#2D2926] text-lg font-bold leading-tight">{task.title}</h1>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm flex-1 flex flex-col justify-center gap-6 py-4">
          <div className="relative group">
            <div className="absolute inset-0 border-2 rounded-3xl scale-110 -z-0 animate-pulse" style={{ borderColor: `${task.color}1A` }}></div>
            <div 
              className="text-white p-8 rounded-[1.25rem] shadow-2xl relative z-10 flex flex-col items-center text-center transition-all duration-500" 
              style={{ background: `linear-gradient(135deg, ${task.color} 0%, ${task.color}CC 100%)`, boxShadow: `0 20px 40px -10px ${task.color}4D` }}
            >
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">emoji_events</span>
              </div>
              <p className="text-white/70 text-sm font-medium mb-2">
                {task.winnersCount > 1 ? `本次 ${task.winnersCount} 位中獎者` : '本次中獎者'}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {winners.map((w, idx) => (
                  <h3 key={idx} className={`${winners.length > 2 ? 'text-2xl' : 'text-4xl'} font-black tracking-wider drop-shadow-md`}>
                    {w}
                  </h3>
                ))}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs">
                <span className="material-symbols-outlined text-xs">schedule</span>
                <span>{isShareMode ? '歷史結果' : '剛剛即時同步'}</span>
              </div>
            </div>
          </div>
          
          {!isShareMode && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-morandi-text-muted text-sm font-medium">恭喜幸運兒！不滿意結果？</p>
            </div>
          )}
        </div>

        <div className="w-full max-w-sm py-8 space-y-4 shrink-0">
          {!isShareMode ? (
            <>
              <button 
                onClick={handleRedraw} 
                className="active:scale-[0.97] w-full text-white font-bold h-[64px] rounded-[1.25rem] transition-all flex flex-col items-center justify-center relative overflow-hidden group shadow-xl hover:brightness-105" 
                style={{ backgroundColor: task.color, boxShadow: `0 15px 30px -5px ${task.color}66` }}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">refresh</span>
                  <span className="tracking-widest text-lg">重新抽籤</span>
                </div>
                <span className="text-[10px] opacity-70 font-normal tracking-normal">即時更新中獎者</span>
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="active:scale-[0.97] bg-white border border-[#E5E0E0] text-morandi-text-muted font-bold h-[56px] rounded-[1.25rem] flex items-center justify-center gap-2 text-sm transition-all hover:bg-stone-50"
                >
                  <span className="material-symbols-outlined text-[18px]">ios_share</span>
                  <span className="tracking-widest">分享</span>
                </button>
                <button 
                  onClick={() => navigate('/')} 
                  className="active:scale-[0.97] font-bold h-[56px] rounded-[1.25rem] flex items-center justify-center gap-2 text-sm transition-all hover:brightness-95" 
                  style={{ backgroundColor: `${task.color}1A`, color: task.color }}
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span className="tracking-widest">完成</span>
                </button>
              </div>
            </>
          ) : (
            /* Share Mode Buttons */
            <div className="flex flex-col gap-3">
               <button 
                  onClick={() => navigate('/')} 
                  className="active:scale-[0.97] w-full text-white font-bold h-[64px] rounded-[1.25rem] transition-all flex flex-col items-center justify-center relative overflow-hidden group shadow-xl hover:brightness-105" 
                  style={{ backgroundColor: task.color, boxShadow: `0 15px 30px -5px ${task.color}66` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                    <span className="tracking-widest text-lg">我也要玩</span>
                  </div>
                  <span className="text-[10px] opacity-70 font-normal tracking-normal">建立我的抽籤任務</span>
                </button>
            </div>
          )}
        </div>
      </main>
      <div className="h-8 shrink-0"></div>
      
      <ShareModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={task}
        winners={winners} 
      />
    </div>
  );
};