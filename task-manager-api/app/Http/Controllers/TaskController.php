<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // Obtener todas las tareas
    public function index()
    {
        return response()->json(Task::orderBy('created_at', 'desc')->get(), 200);
    }

    // Guardar una nueva tarea
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,in_progress,completed',
            'priority' => 'in:low,medium,high',
        ]);

        $task = Task::create($validated);
        return response()->json($task, 201);
    }

    // Actualizar el estado o datos de una tarea (clave para arrastrar en el Kanban)
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'priority' => 'sometimes|required|in:low,medium,high',
        ]);

        $task->update($validated);
        return response()->json($task, 200);
    }

    // Eliminar una tarea
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully'], 200);
    }
}
