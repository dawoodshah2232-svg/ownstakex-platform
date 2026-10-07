<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reservations = $request->user()->reservations()
            ->with('project:id,code,name,slug,cover_image,status')
            ->latest()
            ->paginate($request->integer('per_page', 12));

        return response()->json($reservations);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'units' => 'required|integer|min:1',
        ]);

        $project = Project::findOrFail($data['project_id']);

        if ($project->status !== 'funding') {
            return response()->json(['message' => 'This project is not currently accepting reservations.'], 422);
        }

        if ($data['units'] < $project->min_units || $data['units'] > $project->max_units) {
            return response()->json([
                'message' => "Units must be between {$project->min_units} and {$project->max_units}.",
            ], 422);
        }

        if ($data['units'] > $project->availableUnits()) {
            return response()->json(['message' => 'Not enough units available.'], 422);
        }

        $reservation = Reservation::create([
            'user_id' => $request->user()->id,
            'project_id' => $project->id,
            'units' => $data['units'],
            'unit_price' => $project->unit_price,
            'status' => 'pending',
        ]);

        $project->increment('reserved', $data['units']);

        return response()->json($reservation->load('project:id,code,name,slug'), 201);
    }
}
