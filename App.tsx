import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from './lib/firebase';
import { TaskListPage } from './pages/TaskListPage';
import { AddTaskPage } from './pages/AddTaskPage';
import { MembersPage } from './pages/MembersPage';
import { ResultPage } from './pages/ResultPage';
import { Task } from './types';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col md:max-w-2xl mx-auto overflow-x-hidden md:border-x border-stone-100 bg-white md:shadow-2xl shadow-stone-200/50 transition-all duration-300">
      {children}
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [globalMembers, setGlobalMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 即時監聽任務
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsubTasks = onSnapshot(q, (snapshot) => {
      const tasksArr = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksArr);
      setLoading(false);
    });

    // 即時監聽全域成員
    const unsubMembers = onSnapshot(doc(db, "app_settings", "global_members"), (docSnap) => {
      if (docSnap.exists()) {
        setGlobalMembers(docSnap.data().list || []);
      } else {
        // 若不存在則初始化一個空的名單
        setDoc(doc(db, "app_settings", "global_members"), { list: [] });
      }
    });

    return () => {
      unsubTasks();
      unsubMembers();
    };
  }, []);

  const handleAddTask = async (newTask: Omit<Task, 'id' | 'winnersCount' | 'members'>) => {
    try {
      await addDoc(collection(db, "tasks"), {
        ...newTask,
        winnersCount: 1,
        members: globalMembers,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Firebase Error:", e);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (e) {
      console.error("Firebase Error:", e);
    }
  };

  const handleUpdateWinners = async (id: string, delta: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      await updateDoc(doc(db, "tasks", id), {
        winnersCount: Math.max(1, (task.winnersCount || 1) + delta)
      });
    } catch (e) {
      console.error("Firebase Error:", e);
    }
  };

  const handleUpdateMembers = async (taskId: string, newMembers: string[]) => {
    try {
      // 1. 更新全域成員，讓下一個新任務可以直接讀取
      await setDoc(doc(db, "app_settings", "global_members"), { list: newMembers });
      // 2. 更新特定任務的成員（確保該任務抽籤時有名單）
      await updateDoc(doc(db, "tasks", taskId), {
        members: newMembers
      });
    } catch (e) {
      console.error("Firebase Error:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-morandi-plum border-t-transparent shadow-sm"></div>
          <p className="text-morandi-text-muted font-bold tracking-widest text-sm animate-pulse">正在同步雲端任務...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<TaskListPage tasks={tasks} onDeleteTask={handleDeleteTask} onUpdateWinners={handleUpdateWinners} />} />
          <Route path="/add-task" element={<AddTaskPage onSave={handleAddTask} />} />
          <Route path="/members/:taskId" element={<MembersPage tasks={tasks} onUpdateMembers={handleUpdateMembers} />} />
          <Route path="/result/:taskId/:memberList" element={<ResultPage tasks={tasks} />} />
          <Route path="/share" element={<ResultPage tasks={[]} />} />
        </Routes>
      </LayoutWrapper>
    </HashRouter>
  );
}