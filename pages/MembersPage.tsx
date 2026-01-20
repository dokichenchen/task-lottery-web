import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Task, Member } from '../types';

interface MembersPageProps {
  tasks: Task[];
  onUpdateMembers: (taskId: string, members: string[]) => void;
}

export const MembersPage: React.FC<MembersPageProps> = ({ tasks, onUpdateMembers }) => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  
  const task = tasks.find(t => t.id === taskId);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMember, setNewMember] = useState('');

  // 每次雲端 task 資料變動時，同步本地名單（除非使用者正在輸入或修改，這裡簡單處理）
  useEffect(() => {
    if (task && task.members) {
      // 保留原本的選取狀態，若名單長度沒變的話
      setMembers(task.members.map(m => ({ name: m, checked: true })));
    }
  }, [task?.members]);

  const style = {
    "--task-accent": task?.color || '#9A8C98'
  } as React.CSSProperties;

  const handleToggle = (index: number) => {
    const updated = [...members];
    updated[index].checked = !updated[index].checked;
    setMembers(updated);
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setMembers(members.map(m => ({ ...m, checked })));
  };

  const addMember = () => {
    if (newMember.trim() && taskId) {
      const updatedNames = [...members.map(m => m.name), newMember.trim()];
      onUpdateMembers(taskId, updatedNames); // 立即推送到雲端
      setNewMember('');
    }
  };

  const deleteMember = (index: number) => {
    if (taskId) {
      const updatedNames = members.filter((_, i) => i !== index).map(m => m.name);
      onUpdateMembers(taskId, updatedNames); // 立即推送到雲端
    }
  };

  const startDraw = () => {
    if (!task || !taskId) return;
    const activeMembers = members.filter(m => m.checked).map(m => m.name);
    if (activeMembers.length === 0) {
      alert("請至少選擇一位成員參與抽籤");
      return;
    }
    navigate(`/result/${taskId}/${activeMembers.join(',')}`);
  };

  if (!task) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-6">
      <p className="text-morandi-text-muted mb-4">正在載入任務資料...</p>
      <button onClick={() => navigate('/')} className="px-6 py-2 bg-morandi-midnight text-white rounded-full">回到首頁</button>
    </div>
  );

  const checkedCount = members.filter(m => m.checked).length;

  return (
    <div className="bg-stone-50 min-h-screen flex flex-col text-morandi-text-muted" style={style}>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-border-light md:pt-4">
        <div className="flex items-center p-4 justify-between w-full">
          <button onClick={() => navigate('/')} className="text-morandi-charcoal size-10 flex items-center justify-center rounded-full hover:bg-stone-50 transition-colors">
            <span className="material-symbols-outlined !text-[22px]">arrow_back_ios_new</span>
          </button>
          <h2 className="text-morandi-text-dark text-lg font-bold flex-1 text-center pr-10">選擇抽籤成員</h2>
        </div>
      </header>

      <main className="flex-1 px-5 pb-40 w-full animate-fade-in">
        <div className="mt-6 mb-8 p-5 rounded-task-card bg-white border border-border-light shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm" style={{ backgroundColor: task.color }}>
              <span className="material-symbols-outlined !text-[30px]">{task.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="animate-pulse size-1.5 rounded-full" style={{ backgroundColor: task.color }}></span>
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] block" style={{ color: task.color }}>雲端同步中</span>
              </div>
              <h1 className="text-morandi-text-dark text-xl font-bold tracking-tight">{task.title}</h1>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <label className="text-morandi-text-dark text-[13px] font-bold mb-3 px-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined !text-[16px]">person_add</span>
            新增成員 (會同步給所有人)
          </label>
          <div className="flex items-stretch overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm focus-within:ring-2 focus-within:ring-[var(--task-accent)]/20 transition-all">
            <input 
              value={newMember} 
              onChange={e => setNewMember(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && addMember()} 
              className="flex-1 bg-transparent border-none h-14 px-5 text-morandi-text-dark outline-none" 
              placeholder="輸入成員姓名..." 
              type="text"
            />
            <button 
              onClick={addMember} 
              className="px-6 bg-white border-l border-border-light flex items-center justify-center hover:bg-stone-50 active:scale-95" 
              style={{ color: task.color }}
            >
              <span className="material-symbols-outlined font-bold">add_circle</span>
            </button>
          </div>
        </div>

        <div className="mb-3 px-1 flex items-center justify-between">
          <p className="text-morandi-text-dark text-sm font-bold">成員名單</p>
          <p className="text-morandi-text-muted text-[11px]">已選擇 {checkedCount}/{members.length} 位</p>
        </div>

        {members.length > 0 && (
          <div className="mb-4 bg-white rounded-2xl border border-border-light overflow-hidden">
            <label className="flex items-center gap-4 px-4 h-14 cursor-pointer hover:bg-stone-50 transition-colors">
              <input className="custom-checkbox" type="checkbox" checked={members.length > 0 && checkedCount === members.length} onChange={handleToggleAll}/>
              <span className="text-morandi-text-dark text-base font-bold">全選成員</span>
            </label>
          </div>
        )}

        <div className="space-y-3">
          {members.map((m, i) => (
            <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-border-light shadow-sm group">
              <label className="flex items-center gap-4 flex-1 cursor-pointer">
                <input checked={m.checked} onChange={() => handleToggle(i)} className="custom-checkbox" type="checkbox" />
                <span className={`text-base font-medium ${m.checked ? 'text-morandi-text-dark' : 'text-stone-300'}`}>{m.name}</span>
              </label>
              <button onClick={() => deleteMember(i)} className="text-delete-red/60 hover:text-delete-red size-10 flex items-center justify-center rounded-full transition-all">
                <span className="material-symbols-outlined !text-[22px]">delete</span>
              </button>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-2xl bg-white/90 backdrop-blur-lg border-t border-border-light z-30">
        <div className="p-5 pb-8">
          <button 
            onClick={startDraw} 
            disabled={checkedCount === 0}
            className={`w-full flex items-center justify-center rounded-[18px] h-14 px-5 transition-all text-white text-lg font-bold shadow-xl ${checkedCount === 0 ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:brightness-105 active:scale-[0.97]'}`}
            style={{ backgroundColor: task.color, boxShadow: `0 20px 25px -5px ${task.color}4D` }}
          >
            <span className="material-symbols-outlined mr-2">casino</span>
            <span>開始抽籤</span>
          </button>
        </div>
      </div>
    </div>
  );
};