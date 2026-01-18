'use client';

import { Task } from '@/types/task';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task?: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onDelete, onEdit }: TaskCardProps) {
  if (!task) return null;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-lg border bg-white p-3 transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium">{task.title}</h3>
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
