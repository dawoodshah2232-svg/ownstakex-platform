<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    /**
     * Audience-aware listing: guests see investor-facing docs only when
     * explicitly requested; authenticated investors see all investor docs.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Document::with('project:id,name,code');

        if ($request->user()) {
            $query->where('audience', 'investors');
        } else {
            $query->where('audience', 'investors')->whereNotNull('project_id');
        }

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->integer('project_id'));
        }

        if ($request->filled('category')) {
            $query->where('category', $request->string('category'));
        }

        return response()->json($query->latest()->paginate($request->integer('per_page', 20)));
    }
}
