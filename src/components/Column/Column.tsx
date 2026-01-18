'use client';

import { Task, Status } from '@/types/task';
import TaskCard from '@/components/Task/TaskCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { useAutoAnimate } from '@formkit/auto-animate/react';

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
  // Make column a droppable target
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const [parent] = useAutoAnimate({ duration: 150 });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl bg-white p-4 shadow-sm transition-colors ${
        isOver ? 'bg-slate-50' : ''
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <span className="rounded-full bg-slate-200 px-2 text-sm">
          {tasks.length}
        </span>
      </div>

      {/* Task list */}

      
      <SortableContext
        items={tasks.map(task => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={parent} className="flex flex-1 flex-col gap-3">
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
      </SortableContext>
    </div>
  );
}
