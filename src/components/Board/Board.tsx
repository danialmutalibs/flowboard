'use client';

import { useState, useMemo, use } from 'react';
import Column from '@/components/Column/Column';
import { Status, Task } from '@/types/task';
import Modal from '@/components/Modal/Modal';
import TaskCard from '@/components/Task/TaskCard';
import TaskForm from '@/components/Task/TaskForm';

const columns: { id: Status; title: string }[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];


export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Task 1',
      description: 'Description for Task 1',
      status: 'todo',
      priority: 'high',
      createdAt: Date.now(),
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description for Task 2',
      status: 'in-progress',
      priority: 'medium',
      createdAt: Date.now(),
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description for Task 3',
      status: 'done',
      priority: 'low',
      createdAt: Date.now(),
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const handleSaveTask = (task: Task) => {
  setTasks(prev => {
    const exists = prev.find(t => t.id === task.id);
    if (exists) {
      return prev.map(t => (t.id === task.id ? task : t));
    }
    return [...prev, task];
  });

  setModalOpen(false);
  setEditingTask(null);
};

<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
  <TaskForm
    initialTask={editingTask ?? undefined}
    onSubmit={handleSaveTask}
  />
</Modal>



  
  const tasksByStatus = useMemo(() => {
    return columns.reduce<Record<Status, Task[]>>((acc, col) => {
      acc[col.id] = tasks.filter(task => task.status === col.id);
      return acc;
    }, {} as Record<Status, Task[]>);
  }, [tasks]);

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {columns.map(column => (
        <Column
          key={column.id}
          title={column.title}
          status={column.id}
          tasks={tasksByStatus[column.id]}
          onDelete={(id: string) =>
            setTasks(prev => prev.filter(task => task.id !== id))
          }
        />
      ))}
    </section>
  )
}
