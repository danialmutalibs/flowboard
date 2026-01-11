'use client';

import { useState, useMemo } from 'react';
import Column from '@/components/Column/Column';
import { Status, Task } from '@/types/task';

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
