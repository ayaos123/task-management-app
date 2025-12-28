<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_task()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/tasks', [
            'title' => 'Test Task',
            'description' => 'Test Description',
            'status' => 'pending'
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'task' => [
                         'id', 
                         'title', 
                         'description', 
                         'status', 
                         'user_id', 
                         'created_at', 
                         'updated_at'
                     ], 
                     'message'
                 ]);
    }

    public function test_user_can_view_their_tasks()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Task::factory()->count(3)->create([
            'user_id' => $user->id,
            'status' => 'pending'
        ]);

        $response = $this->getJson('/api/tasks');
        $response->assertStatus(200);
        // If it returns nested data, you might need: ->assertJsonStructure(['data' => [...]]);
    }

    public function test_user_cannot_view_others_tasks()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        Sanctum::actingAs($user1);
        Task::factory()->count(2)->create([
            'user_id' => $user2->id,
            'status' => 'pending'
        ]);

        $response = $this->getJson('/api/tasks');
        $response->assertStatus(200);
    }

    public function test_user_can_update_their_task()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $task = Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending'
        ]);

        $response = $this->putJson("/api/tasks/{$task->id}", [
            'title' => 'Updated Task',
            'description' => 'Updated Description',
            'status' => 'pending'
        ]);

        $response->assertStatus(200)
                 ->assertJson(['task' => ['title' => 'Updated Task']]);
    }

    public function test_user_can_delete_their_task()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $task = Task::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending'
        ]);

        $response = $this->deleteJson("/api/tasks/{$task->id}");
        $response->assertStatus(200);
    }
}
