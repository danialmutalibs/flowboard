import TaskCard from '@/components/Task/TaskCard';
import { Status } from '@/types/task';

interface ColumnProps {
  title: string;
  status: Status;
  onDelete: (id:string) => void;
  tasks: {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    createdAt: number;
  }[];
}   
export default function Column({ title, tasks, onDelete, }: ColumnProps) {
  return (
    
  <div className="flex flex-col rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <span className="rounded-full bg-slate-200 px-2 text-sm">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {tasks.length === 0 && (
        <p className='text-sm text-slate-400'>
            No tasks available.
          </p>
        )}

         {tasks.map(task => (
          <TaskCard
          key={task.id}
          task={task}          
          onDelete={onDelete}
            />
          ))}
        </div>
    </div>
    );
}
