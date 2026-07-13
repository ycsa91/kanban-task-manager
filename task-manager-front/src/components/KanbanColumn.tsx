import type Task  from '../types/task';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  columnId: Task['status'];
  title: string;
  color: string;
  tasks: Task[];
  draggedTaskId: number | null;
  updatingTaskIds: number[];
  onDragStart: (id: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (status: Task['status']) => void;
  onDeleteTask: (id: number) => void;
  onMoveTask: (id: number, currentStatus: Task['status']) => void;
}

export default function KanbanColumn({
  columnId,
  title,
  color,
  tasks,
  draggedTaskId,
  updatingTaskIds,
  onDragStart,
  onDragOver,
  onDrop,
  onDeleteTask,
  onMoveTask
}: KanbanColumnProps) {
  return (
    <div 
      onDragOver={onDragOver}
      onDrop={() => onDrop(columnId)}
      className="bg-light p-3 rounded-3 shadow-sm border"
      style={{ 
        minHeight: '500px',
        borderStyle: draggedTaskId ? 'dashed !important' : 'solid',
        borderColor: draggedTaskId ? '#6c757d' : '#dee2e6',
        transition: 'all 0.2s ease'
      }}
    >
      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
        <h5 className="m-0 fw-bold text-dark">{title}</h5>
        <span className="badge bg-secondary rounded-pill">{tasks.length}</span>
      </div>
      
      <div className="d-flex flex-column gap-1">
        {tasks.map(task => (
          <KanbanCard 
            key={task.id}
            task={task}
            columnColor={color}
            isDragged={draggedTaskId === task.id}
            isUpdating={updatingTaskIds.includes(task.id)}
            onDragStart={onDragStart}
            onDelete={onDeleteTask}
            onMove={onMoveTask}
          />
        ))}
      </div>
    </div>
  );
}