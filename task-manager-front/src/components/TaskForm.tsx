import { useState } from 'react';
import type Task  from '../types/task';

interface TaskFormProps {
  onCreateTask: (title: string, priority: Task['priority']) => Promise<void>;
  isSubmitting: boolean;
}

export default function TaskForm({ onCreateTask, isSubmitting }: TaskFormProps) {
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    await onCreateTask(newTitle, newPriority);
    setNewTitle('');
    setNewPriority('medium');
  };

  const isButtonDisabled = !newTitle.trim() || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="row g-2 my-4 align-items-center">
      <div className="col-md-7">
        <input 
          type="text" 
          className="form-control form-control-lg"
          placeholder="Escribe el título de una nueva tarea..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      </div>
      
      <div className="col-md-3">
        <select
          className="form-select form-control-lg"
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
        >
          <option value="low">Baja 🟢</option>
          <option value="medium">Media 🟡</option>
          <option value="high">Alta 🔴</option>
        </select>
      </div>

      <div className="col-md-2 d-grid">
        <button 
          type="submit" 
          disabled={isButtonDisabled}
          title={!newTitle.trim() ? "Por favor, escribe el título" : "Añadir tarea al tablero"}
          className={`btn btn-lg ${isButtonDisabled ? 'btn-secondary' : 'btn-primary'} fw-bold`}
        >
          {isSubmitting ? 'Guardando...' : 'Añadir'}
        </button>
      </div>
    </form>
  );
}