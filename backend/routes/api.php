<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BlogController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\InvestorController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\ReservationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    /* ---------- public ---------- */
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{slug}', [ProjectController::class, 'show']);

    Route::get('/documents', [DocumentController::class, 'index']);

    Route::get('/blog', [BlogController::class, 'index']);
    Route::get('/blog/{slug}', [BlogController::class, 'show']);

    /* ---------- authenticated (Sanctum) ---------- */
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::get('/investor/dashboard', [InvestorController::class, 'dashboard']);

        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::post('/reservations', [ReservationController::class, 'store']);

        /* ---------- admin only ---------- */
        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::get('/users', [AdminController::class, 'users']);
            Route::patch('/users/{user}', [AdminController::class, 'updateUser']);

            Route::get('/projects', [AdminController::class, 'projects']);
            Route::post('/projects', [AdminController::class, 'storeProject']);
            Route::patch('/projects/{project}', [AdminController::class, 'updateProject']);
            Route::delete('/projects/{project}', [AdminController::class, 'destroyProject']);

            Route::get('/documents', [AdminController::class, 'documents']);
            Route::post('/documents', [AdminController::class, 'storeDocument']);
            Route::patch('/documents/{document}', [AdminController::class, 'updateDocument']);
            Route::delete('/documents/{document}', [AdminController::class, 'destroyDocument']);

            Route::get('/announcements', [AdminController::class, 'announcements']);
            Route::post('/announcements', [AdminController::class, 'storeAnnouncement']);
            Route::patch('/announcements/{announcement}', [AdminController::class, 'updateAnnouncement']);
            Route::delete('/announcements/{announcement}', [AdminController::class, 'destroyAnnouncement']);

            Route::get('/audit-logs', [AdminController::class, 'auditLogs']);
        });
    });
});
