'use client';

import { Task } from '@/types/task';

interface TaskCardProps {
  task?: Task; // 👈 allow undefined defensively
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityStyles: Record<Task['priority'], string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

export default function TaskCard({
  task,
  onDelete,
  onEdit,
}: TaskCardProps) {
  // 🔥 HARD GUARD — prevents runtime crash
  if (!task) return null;

  return (
    <div className="rounded-lg border bg-white p-3 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium">{task.title}</h3>

        <span
          className={`rounded px-2 py-0.5 text-xs ${
            priorityStyles[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="mt-2 flex gap-3">
        <button
          onClick={() => onEdit(task)}
          className="text-xs text-blue-600 hover:underline"
          type="button"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="text-xs text-red-600 hover:underline"
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
