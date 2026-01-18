'use client';

import { useEffect, useState } from 'react';
import { Task, Status, Priority } from '@/types/task';
import { v4 as uuid } from 'uuid';

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (task: Task) => void;
}

export default function TaskForm({ initialTask, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('todo');

  // 🔥 IMPORTANT: sync state when editing changes
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
    } else {
      setTitle('');
      setPriority('medium');
      setStatus('todo');
    }
  }, [initialTask]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onSubmit({
      id: initialTask?.id ?? uuid(),
      title,
      status,
      priority,
      createdAt: initialTask?.createdAt ?? Date.now(),
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        {initialTask ? 'Edit Task' : 'Add Task'}
      </h2>

      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <select
        className="w-full rounded border px-3 py-2"
        value={priority}
        onChange={e => setPriority(e.target.value as Priority)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        className="w-full rounded border px-3 py-2"
        value={status}
        onChange={e => setStatus(e.target.value as Status)}
      >
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <button
        onClick={handleSubmit}
        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
        type="button"
      >
        Save
      </button>
    </div>
  );
}
