import type Task  from '../types/task';

interface KanbanCardProps {
  task: Task;
  isUpdating: boolean;
  isDragged: boolean;
  onDragStart: (id: number) => void;
  onDelete: (id: number) => void;
  onMove: (id: number, currentStatus: Task['status']) => void;
  columnColor: string;
}

export default function KanbanCard({
  task,
  isUpdating,
  isDragged,
  onDragStart,
  onDelete,
  onMove,
}: KanbanCardProps) {
  
  // Asignamos colores de alerta según la prioridad
  const badgeColor = task.priority === 'high' ? 'bg-danger' : task.priority === 'medium' ? 'bg-warning text-dark' : 'bg-success';
  const borderColor = task.priority === 'high' ? 'border-danger' : task.priority === 'medium' ? 'border-warning' : 'border-success';

  return (
    <div 
      draggable={!isUpdating}
      onDragStart={() => onDragStart(task.id)} 
      className={`card shadow-sm ${borderColor} border-start border-4 mb-3`}
      style={{ 
        cursor: isUpdating ? 'not-allowed' : 'grab',
        opacity: isDragged ? 0.5 : isUpdating ? 0.4 : 1,
        filter: isUpdating ? 'grayscale(30%)' : 'none',
        transition: 'all 0.2s ease'
      }}
    >
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h5 className={`card-title m-0 fs-6 fw-bold ${isUpdating ? 'text-decoration-line-through text-muted' : ''}`}>
            {task.title}
          </h5>
          <span className={`badge ${badgeColor} text-uppercase`} style={{ fontSize: '10px' }}>
            {task.priority === 'high' ? 'Alta 🔴' : task.priority === 'medium' ? 'Media 🟡' : 'Baja 🟢'}
          </span>
        </div>

        <p className="card-text small text-secondary mb-3">{task.description}</p>
        
        {isUpdating && (
          <div className="text-muted small mb-2 italic">
            <span className="spinner-border spinner-border-sm text-secondary me-1" role="status"></span>
            Sincronizando...
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <button 
            onClick={() => onDelete(task.id)}
            disabled={isUpdating}
            className="btn btn-link btn-sm text-danger p-0 text-decoration-none"
          >
            Eliminar 🗑️
          </button>
          
          {task.status !== 'completed' && (
            <button 
              onClick={() => onMove(task.id, task.status)}
              disabled={isUpdating}
              className="btn btn-outline-secondary btn-sm px-2 py-0"
              style={{ fontSize: '12px' }}
            >
              Avanzar ➡️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}