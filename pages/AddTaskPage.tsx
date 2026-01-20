import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../types';
import { THEME_COLORS, ICONS, CATEGORIES as INITIAL_CATEGORIES } from '../constants';

interface AddTaskPageProps {
  onSave: (task: Omit<Task, 'id' | 'winnersCount' | 'members'>) => void;
}

export const AddTaskPage: React.FC<AddTaskPageProps> = ({ onSave }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(THEME_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  
  // Local state for categories to allow adding new ones
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [category, setCategory] = useState(INITIAL_CATEGORIES[0]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // CSS variables for dynamic coloring
  const style = {
    "--theme-accent": selectedColor,
    "--theme-accent-soft": `${selectedColor}1A`
  } as React.CSSProperties;

  const handleSave = () => {
    onSave({ 
      title: title || '未命名任務', 
      icon: selectedIcon, 
      color: selectedColor, 
      category 
    });
    navigate('/');
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCat = newCategoryName.trim();
      if (!categories.includes(newCat)) {
        setCategories([...categories, newCat]);
      }
      setCategory(newCat);
    }
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  return (
    <div className="flex h-auto min-h-screen w-full flex-col bg-white" style={style}>
      <header className="flex flex-col gap-2 bg-white/90 ios-blur sticky top-0 z-20 px-6 py-4 md:pt-8">
        <div className="flex items-center h-10 justify-between">
          <button 
            onClick={() => navigate('/')} 
            className="text-morandi-charcoal active:opacity-50 transition-opacity hover:bg-stone-50 rounded-full p-2 -ml-2"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0", fontWeight: 300 }}>arrow_back_ios_new</span>
          </button>
        </div>
        <h1 className="text-morandi-text-dark tracking-tight text-3xl font-bold leading-tight">新增任務</h1>
      </header>
      
      <main className="flex-1 px-6 py-4 space-y-10 animate-fade-in pb-40">
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-bold tracking-[0.2em] uppercase px-1 text-[var(--theme-accent)]">任務名稱</label>
          <div className="relative">
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full h-14 bg-stone-50 border-stone-100 border-0 rounded-app-card px-5 text-morandi-text-dark placeholder:text-stone-300 focus:ring-1 focus:ring-[var(--theme-accent)]/20 outline-none transition-all shadow-sm" 
              placeholder="請輸入任務名稱..." 
              type="text"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--theme-accent)]">主題配色</label>
          </div>
          <div className="flex flex-wrap items-center justify-between bg-stone-50/50 p-5 rounded-app-card border border-stone-100/50 gap-2">
            {THEME_COLORS.map(c => (
              <button 
                key={c} 
                onClick={() => setSelectedColor(c)} 
                className={`relative flex items-center justify-center transition-all duration-300 w-7 h-7 rounded-full cursor-pointer ${selectedColor === c ? 'scale-125 ring-2 ring-offset-2 ring-stone-200' : ''}`}
                style={{ backgroundColor: c }}
              ></button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--theme-accent)]">代表圖示</label>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {ICONS.map(icon => (
              <button 
                key={icon} 
                onClick={() => setSelectedIcon(icon)} 
                className={`aspect-square flex items-center justify-center rounded-app-icon border border-stone-100 bg-stone-50/50 transition-all duration-200 ${selectedIcon === icon ? '!border-transparent !bg-[rgba(154,140,152,0.1)] scale-96' : ''}`}
              >
                <span className={`material-symbols-outlined text-2xl ${selectedIcon === icon ? 'text-morandi-plum icon-fill' : 'text-morandi-text-muted'}`}>
                  {icon}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-bold tracking-[0.2em] uppercase px-1 text-[var(--theme-accent)]">群組分類</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setCategory(cat)} 
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${category === cat ? 'text-white' : 'border border-stone-100 bg-stone-50 text-morandi-text-muted hover:bg-stone-100'}`} 
                style={category === cat ? { backgroundColor: selectedColor } : {}}
              >
                {cat}
              </button>
            ))}
            
            {isAddingCategory ? (
              <input
                autoFocus
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onBlur={handleAddCategory}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory();
                }}
                className="px-5 py-2.5 rounded-full text-sm font-medium border border-stone-100 bg-white text-morandi-text-dark outline-none min-w-[80px] focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-accent)]/20"
                placeholder="新分類..."
              />
            ) : (
              <button 
                onClick={() => setIsAddingCategory(true)}
                className="px-4 py-2.5 rounded-full text-sm font-medium border border-stone-100 bg-stone-50 text-morandi-text-muted hover:bg-stone-100 transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg leading-none" style={{ fontVariationSettings: "'FILL' 0" }}>add</span>
              </button>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-2xl z-30 flex flex-col items-center bg-white/60 ios-blur px-6 pt-6 pb-10 border-t border-stone-50">
        <button 
          onClick={handleSave} 
          className="w-full h-14 flex items-center justify-center gap-2 rounded-app-button text-white font-semibold text-[17px] tracking-widest shadow-lg transition-all active:scale-[0.98] hover:brightness-105" 
          style={{ backgroundColor: selectedColor, boxShadow: `0 10px 15px -3px ${selectedColor}4D` }}
        >
          <span>建立任務</span>
        </button>
      </div>
    </div>
  );
};