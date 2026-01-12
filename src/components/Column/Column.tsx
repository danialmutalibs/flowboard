'use client';

import { Task, Status } from '@/types/task';
import TaskCard from '@/components/Task/TaskCard';

interface ColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function Column({
  title,
  status,
  tasks,
  onDelete,
  onEdit,
}: ColumnProps) {
  return (
    <div className="flex flex-col rounded-xl bg-white p-4 shadow-sm">
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <span className="rounded-full bg-slate-200 px-2 text-sm">
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="flex flex-1 flex-col gap-3">
        {tasks.length === 0 && (
          <p className="text-sm text-slate-400">No tasks yet</p>
        )}

        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
