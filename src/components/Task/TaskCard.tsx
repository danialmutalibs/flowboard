import { Task } from '@/types/task';
// ...existing code...
interface ColumnTaskProps {
  title: string;
  priority: 'low' | 'medium' | 'high';
}

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

const priorityStyles = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

export function ColumnTask({ title, priority }: ColumnTaskProps) {
  return (
    <div className="rounded-lg border bg-white p-3 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium">{title}</h3>

        <span
          className={`rounded px-2 py-0.5 text-xs ${priorityStyles[priority]}`}
        >
          {priority}
        </span>
      </div>

      <div className="mt-2 flex gap-2">
        <button className="text-xs text-blue-600 hover:underline">
          Edit
        </button>
        <button className="text-xs text-red-600 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
}

export default function TaskCard({ task, onDelete }: TaskCardProps) {
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
        <button className="text-xs text-blue-600 hover:underline">
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="text-xs text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ...existing code...
interface ColumnProps { 
    title: string;
    tasks: {
        id: string;
        title: string;
        description?: string;
        status: 'todo' | 'in-progress' | 'done';
        priority: 'low' | 'medium' | 'high';
        createdAt: number;
    }[];
}