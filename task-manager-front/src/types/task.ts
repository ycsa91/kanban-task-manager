// Esta interfaz define exactamente la misma estructura que creamos en MySQL
export default interface Task {
  id: number;
  title: string;
  description: string | null; // Puede ser un texto o venir vacío (nullable)
  status: 'pending' | 'in_progress' | 'completed'; // Forzamos a que solo acepte estos tres strings
  priority: 'low' | 'medium' | 'high';
  created_at?: string;
  updated_at?: string;
}