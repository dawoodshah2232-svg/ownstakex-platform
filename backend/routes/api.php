<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BlogController;
use App\Http\Controllers\Api\V1\DeadlineController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\InboxController;
use App\Http\Controllers\Api\V1\InvestorController;
use App\Http\Controllers\Api\V1\PollController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\ReferralCommissionController;
use App\Http\Controllers\Api\V1\ReservationController;
use App\Http\Controllers\Api\V1\WaitlistController;
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

    // Projects page "notify me" for countries with no open project yet.
    Route::post('/waitlist', [WaitlistController::class, 'store'])->middleware('throttle:10,1');

    // Website forms: Contact page and "Submit a project".
    Route::post('/contact', [InboxController::class, 'contact'])->middleware('throttle:10,1');
    Route::post('/project-submissions', [InboxController::class, 'submitProject'])->middleware('throttle:5,1');

    /* ---------- authenticated (Sanctum) ---------- */
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::get('/investor/dashboard', [InvestorController::class, 'dashboard']);

        // Advanced CRM workflow: investor self-service ownership records.
        Route::get('/my/ownership', [InvestorController::class, 'ownership']);
        Route::get('/my/certificates/{certificate}', [InvestorController::class, 'certificate']);
        Route::get('/my/statements', [InvestorController::class, 'statements']);

        // Advanced CRM workflow: investor polls.
        Route::get('/polls', [PollController::class, 'index']);
        Route::post('/polls/{poll}/vote', [PollController::class, 'vote']);

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

            Route::get('/waitlist', [WaitlistController::class, 'index']);
            Route::get('/contact-messages', [InboxController::class, 'contactMessages']);
            Route::get('/project-submissions', [InboxController::class, 'projectSubmissions']);

            // Advanced CRM workflow: closing-deadline tracking.
            Route::get('/deadlines', [DeadlineController::class, 'index']);
            Route::post('/projects/{project}/extend-closing', [DeadlineController::class, 'extend']);

            // Advanced CRM workflow: referral commission pipeline.
            Route::get('/referral-commissions', [ReferralCommissionController::class, 'index']);
            Route::post('/referral-commissions/{commission}/approve', [ReferralCommissionController::class, 'approve']);
            Route::post('/referral-commissions/{commission}/mark-payable', [ReferralCommissionController::class, 'markPayable']);
            Route::post('/referral-commissions/{commission}/mark-paid', [ReferralCommissionController::class, 'markPaid']);
        });
    });
});
