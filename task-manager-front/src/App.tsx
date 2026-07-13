import { useEffect, useState } from 'react';
import { taskService } from './services/taskService';
import TaskForm from './components/TaskForm';
import KanbanColumn from './components/KanbanColumn';
import type Task  from './types/task';


function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [updatingTaskIds, setUpdatingTaskIds] = useState<number[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setErrorMessage(null);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Error cargando tareas:", error);
      setErrorMessage("No se pudieron cargar las tareas. Por favor, verifica el servidor Backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (title: string, priority: Task['priority']) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const newTask = await taskService.create({
        title,
        description: 'Nueva tarea creada desde el Frontend',
        status: 'pending',
        priority
      });

      setTasks([newTask, ...tasks]);
    } catch (error) {
      console.error("Error creando tarea:", error);
      setErrorMessage("No se pudo guardar la tarea. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveTask = async (id: number, currentStatus: Task['status']) => {
    let nextStatus: Task['status'] = 'pending';
    if (currentStatus === 'pending') nextStatus = 'in_progress';
    else if (currentStatus === 'in_progress') nextStatus = 'completed';
    else return;

    try {
      setUpdatingTaskIds(prev => [...prev, id]);
      setErrorMessage(null);

      const updated = await taskService.update(id, { status: nextStatus });
      setTasks(tasks.map(t => t.id === id ? updated : t));
    } catch (error) {
      console.error("Error al mover la tarea:", error);
      setErrorMessage("No se pudo avanzar la tarea. Inténtalo de nuevo.");
    } finally {
      setUpdatingTaskIds(prev => prev.filter(taskId => taskId !== id));
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
    try {
      await taskService.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error eliminando tarea:", error);
      setErrorMessage("No se pudo eliminar la tarea correctamente.");
    }
  };

  const handleDragStart = (id: number) => {
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (status: Task['status']) => {
    if (draggedTaskId === null) return;
    
    const taskIdToUpdate = draggedTaskId;
    setDraggedTaskId(null);

    try {
      setUpdatingTaskIds(prev => [...prev, taskIdToUpdate]);
      setErrorMessage(null);

      const updated = await taskService.update(taskIdToUpdate, { status });
      setTasks(tasks.map(t => t.id === taskIdToUpdate ? updated : t));
    } catch (error) {
      console.error("Error al mover la tarea con drag and drop:", error);
      setErrorMessage("No se pudo guardar la nueva posición de la tarea.");
    } finally {
      setUpdatingTaskIds(prev => prev.filter(id => id !== taskIdToUpdate));
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const columns: { id: Task['status']; title: string; color: string }[] = [
    { id: 'pending', title: 'Por Hacer 📌', color: '#ffffff' },
    { id: 'in_progress', title: 'En Progreso ⚡', color: '#ffffff' },
    { id: 'completed', title: 'Completado ✅', color: '#ffffff' }
  ];

  return (
    <div className="container py-5" style={{ maxWidth: '1200px' }}>
      <header className="mb-4">
        <h1 className="display-5 fw-bold text-dark">Kanban Board 🚀</h1>
        
        <TaskForm onCreateTask={handleCreateTask} isSubmitting={isSubmitting} />

        {errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            <strong>⚠️ Error:</strong> {errorMessage}
            <button type="button" className="btn-close" onClick={() => setErrorMessage(null)}></button>
          </div>
        )}
      </header>

      <div className="row g-4">
        {columns.map(column => (
          <div key={column.id} className="col-md-4">
            <KanbanColumn 
              columnId={column.id}
              title={column.title}
              color={column.color}
              tasks={tasks.filter(task => task.status === column.id)}
              draggedTaskId={draggedTaskId}
              updatingTaskIds={updatingTaskIds}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;