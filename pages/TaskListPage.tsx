import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../types';

interface TaskListPageProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onUpdateWinners: (id: string, delta: number) => void;
}

export const TaskListPage: React.FC<TaskListPageProps> = ({ tasks, onDeleteTask, onUpdateWinners }) => {
  const navigate = useNavigate();

  return (
    <>
      <header className="flex flex-col gap-2 bg-white/90 ios-blur sticky top-0 z-20 p-6 pb-4 md:pt-8 transition-all">
        <div className="flex items-center h-12 justify-between gap-3">
          <div className="text-morandi-charcoal flex size-10 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined text-2xl">grid_view</span>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <h1 className="text-morandi-text-dark tracking-tight text-3xl font-bold leading-tight">任務列表</h1>
          {tasks.length > 0 && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-morandi-plum font-bold tracking-wider uppercase">Cloud Sync</span>
              <span className="text-xs text-morandi-plum-deep font-medium mb-1">即時同步中</span>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 px-6 py-4 flex flex-col">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-stone-200">assignment_add</span>
            </div>
            <h3 className="text-xl font-bold text-morandi-text-dark mb-2">尚無雲端任務</h3>
            <p className="text-sm text-morandi-text-muted px-10 leading-relaxed max-w-xs mx-auto">
              目前雲端資料庫沒有任何任務，點擊下方按鈕建立第一個多人同步任務吧！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-24">
            {tasks.map((task, index) => (
              <div 
                key={task.id} 
                className={`relative flex flex-col gap-5 rounded-app-card bg-white p-6 card-shadow border transition-all hover:translate-y-[-2px] hover:shadow-lg h-full ${index === 0 ? 'border-2 border-morandi-slate/10' : 'border-stone-100'}`}
              >
                {index === 0 && (
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-morandi-midnight rounded-full shadow-lg shadow-morandi-midnight/20">
                    <span className="text-[10px] text-white font-bold tracking-wider">最新動態</span>
                  </div>
                )}
                
                <button 
                  onClick={() => onDeleteTask(task.id)} 
                  className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-white text-morandi-plum hover:text-white hover:bg-delete-red transition-all active:scale-90 border border-stone-100 shadow-sm z-10"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0" }}>delete</span>
                </button>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1 pr-10">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: task.color }}>{task.category}</span>
                    <h2 className="text-morandi-text-dark text-xl font-bold leading-tight break-words">{task.title}</h2>
                  </div>
                  <div 
                    className="w-14 h-14 rounded-app-icon flex items-center justify-center shrink-0 border" 
                    style={{ backgroundColor: `${task.color}1A`, borderColor: `${task.color}1A` }}
                  >
                    <span className="material-symbols-outlined text-3xl" style={{ color: task.color }}>{task.icon}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stone-50 pt-5 mt-auto">
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex items-center justify-center rounded-lg shrink-0 size-8 border" 
                      style={{ backgroundColor: `${task.color}0D`, borderColor: `${task.color}1A` }}
                    >
                      <span className="material-symbols-outlined text-lg" style={{ color: task.color, fontVariationSettings: "'FILL' 0" }}>group</span>
                    </div>
                    <span className="text-morandi-charcoal font-medium text-sm">中獎人數</span>
                  </div>
                  <div className="flex items-center gap-3 text-morandi-text-dark">
                    <button 
                      onClick={() => onUpdateWinners(task.id, -1)} 
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-50 border border-stone-100 hover:bg-stone-100 transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-bold">{task.winnersCount}</span>
                    <button 
                      onClick={() => onUpdateWinners(task.id, 1)} 
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-50 border border-stone-100 hover:bg-stone-100 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/members/${task.id}`)} 
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-app-button text-white font-bold transition-all hover:brightness-95 active:scale-[0.98]" 
                  style={{ backgroundColor: task.color }}
                >
                  <span className="material-symbols-outlined text-xl">person_add</span>
                  <span>選擇抽籤成員</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full md:max-w-2xl pointer-events-none z-30 flex justify-center px-6">
        <button 
          onClick={() => navigate('/add-task')} 
          className="pointer-events-auto flex h-14 w-full max-w-[200px] items-center justify-center gap-3 rounded-full bg-morandi-midnight text-white shadow-[0_15px_30px_rgba(44,62,80,0.3)] active:scale-95 transition-all border border-white/10 hover:bg-morandi-midnight/90"
        >
          <span className="material-symbols-outlined text-2xl">add_circle</span>
          <span className="font-bold text-lg tracking-wide">新增任務</span>
        </button>
      </div>
    </>
  );
};