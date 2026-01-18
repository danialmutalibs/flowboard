'use client';

import { Task } from '@/types/task';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task?: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({
  task,
  onDelete,
  onEdit,
}: TaskCardProps) {
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
      className="rounded-lg border bg-white p-3 shadow-sm"
    >
      {/* HEADER + DRAG HANDLE */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">{task.title}</h3>

        {/* 👇 DRAG HANDLE (ONLY THIS DRAGS) */}
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab select-none text-slate-400 active:cursor-grabbing"
          title="Drag"
        >
          ⠿
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="text-xs text-blue-600 hover:underline"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="text-xs text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
