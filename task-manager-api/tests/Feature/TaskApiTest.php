<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    /**
     * RefreshDatabase ejecuta las migraciones antes de cada prueba
     * en una base de datos aislada en memoria y la limpia al terminar.
     */
    use RefreshDatabase;

    public function test_can_list_all_tasks(): void
    {
        // 1. Arrange (Preparar escenario): Creamos 2 tareas en la BD de prueba
        Task::create([
            'title' => 'Configurar Docker Compose',
            'description' => 'Conectar MySQL, Laravel y React',
            'status' => 'completed',
            'priority' => 'high',
        ]);

        Task::create([
            'title' => 'Configurar GitHub Actions',
            'description' => 'Crear pipeline de CI/CD',
            'status' => 'in_progress',
            'priority' => 'medium',
        ]);

        // 2. Act (Ejecutar acción): Llamamos al endpoint GET /api/tasks
        $response = $this->getJson('/api/tasks');

        // 3. Assert (Verificar resultado): Código 200 y que vengan las 2 tareas
        $response->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['title' => 'Configurar Docker Compose'])
            ->assertJsonFragment(['title' => 'Configurar GitHub Actions']);
    }

    public function test_can_create_a_new_task(): void
    {
        $payload = [
            'title' => 'Escribir tests de integración',
            'description' => 'Probar el CRUD completo de la API',
            'status' => 'pending',
            'priority' => 'high',
        ];

        $response = $this->postJson('/api/tasks', $payload);

        // Verificamos respuesta HTTP 201 (Created) y que exista realmente en la tabla 'tasks'
        $response->assertStatus(201)
            ->assertJsonFragment(['title' => 'Escribir tests de integración']);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Escribir tests de integración',
            'status' => 'pending',
            'priority' => 'high',
        ]);
    }

    public function test_cannot_create_task_with_invalid_data(): void
    {
        // Enviamos un título vacío y un estado que no existe en las reglas de validación
        $invalidPayload = [
            'title' => '',
            'status' => 'estado_inventado',
            'priority' => 'prioridad_invalida',
        ];

        $response = $this->postJson('/api/tasks', $invalidPayload);

        // Laravel debe rechazar la petición con código 422 (Unprocessable Content)
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'status', 'priority']);
    }

    public function test_can_update_task_status_when_dragging_card(): void
    {
        $task = Task::create([
            'title' => 'Mover tarjeta en el Kanban',
            'status' => 'pending',
            'priority' => 'medium',
        ]);

        // Simulamos el Drag & Drop hacia la columna "in_progress"
        $response = $this->putJson("/api/tasks/{$task->id}", [
            'status' => 'in_progress',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['status' => 'in_progress']);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_can_delete_a_task(): void
    {
        $task = Task::create([
            'title' => 'Tarea temporal para borrar',
            'status' => 'pending',
            'priority' => 'low',
        ]);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Task deleted successfully']);

        // Confirmamos que el registro ya no existe en la base de datos
        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }
}
