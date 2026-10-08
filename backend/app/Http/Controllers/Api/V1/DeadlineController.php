<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Project;
use App\Support\DeadlineSeverity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeadlineController extends Controller
{
    /**
     * GET /api/v1/admin/deadlines
     * List projects with a closing_date set, with severity bands and extension history.
     */
    public function index(Request $request): JsonResponse
    {
        $projects = Project::whereNotNull('closing_date')
            ->orderBy('closing_date')
            ->get()
            ->map(function (Project $project) {
                $severity = DeadlineSeverity::band($project->closing_date);
                $history = $project->extension_history ?? [];

                return [
                    'id' => $project->id,
                    'code' => $project->code,
                    'name' => $project->name,
                    'closing_date' => $project->closing_date,
                    'closing_original_date' => $project->closing_original_date,
                    'days_left' => $severity['days_left'],
                    'severity' => [
                        'key' => $severity['key'],
                        'label' => $severity['label'],
                    ],
                    'extension_count' => count($history),
                    'extension_history' => $history,
                ];
            });

        return response()->json($projects);
    }

    /**
     * POST /api/v1/admin/projects/{project}/extend-closing
     * Push the closing date out by N days. The original date is preserved
     * the first time an extension happens; never overwritten afterwards.
     */
    public function extend(Request $request, Project $project): JsonResponse
    {
        $data = $request->validate([
            'days' => 'required|integer|min:1|max:90',
        ]);

        if ($project->closing_date === null) {
            return response()->json([
                'message' => 'This project has no closing date to extend.',
            ], 422);
        }

        if ($project->closing_original_date === null) {
            $project->closing_original_date = $project->closing_date;
        }

        $from = $project->closing_date->copy();
        $to = $from->copy()->addDays($data['days']);

        $history = $project->extension_history ?? [];
        $history[] = [
            'from' => $from->toDateTimeString(),
            'to' => $to->toDateTimeString(),
            'at' => now()->toDateTimeString(),
            'by' => $request->user()->name,
        ];

        $project->closing_date = $to;
        $project->extension_history = $history;
        $project->save();

        AuditLog::create([
            'actor_id' => $request->user()->id,
            'actor_role' => $request->user()->role,
            'action' => 'project.closing_extended',
            'detail' => "{$project->code} closing moved {$from->toDateTimeString()} → {$to->toDateTimeString()} (+{$data['days']}d)",
        ]);

        return response()->json($project->fresh()->append('deadline'));
    }
}
