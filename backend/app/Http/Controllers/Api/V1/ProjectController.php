<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Project::with('images')->where('status', '!=', 'draft');

        if ($request->filled('category')) {
            $query->where('category', $request->string('category'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(fn ($q) => $q->where('name', 'like', $search)->orWhere('location', 'like', $search));
        }

        $projects = $query->latest()->paginate($request->integer('per_page', 12));

        $projects->getCollection()->transform(fn (Project $p) => $this->summarize($p));

        return response()->json($projects);
    }

    public function show(string $slug): JsonResponse
    {
        $project = Project::with(['images', 'documents', 'distributions'])
            ->where('slug', $slug)
            ->firstOrFail();

        $data = $this->summarize($project);
        $data['description'] = $project->description;
        $data['video_url'] = $project->video_url;
        $data['documents'] = $project->documents;
        $data['distributions'] = $project->distributions;

        return response()->json($data);
    }

    /** @return array<string, mixed> */
    private function summarize(Project $project): array
    {
        return [
            'id' => $project->id,
            'code' => $project->code,
            'name' => $project->name,
            'slug' => $project->slug,
            'category' => $project->category,
            'location' => $project->location,
            'tagline' => $project->tagline,
            'capital' => $project->capital,
            'units' => $project->units,
            'unit_price' => $project->unit_price,
            'min_units' => $project->min_units,
            'max_units' => $project->max_units,
            // Dual progress bars: allocated = reserved + funded, funded alone.
            'reserved' => $project->reserved,
            'funded' => $project->funded,
            'available_units' => $project->availableUnits(),
            'allocated_percent' => $project->allocatedPercent(),
            'status' => $project->status,
            'version' => $project->version,
            'campaign_ends' => $project->campaign_ends,
            'long_stop' => $project->long_stop,
            'operator' => $project->operator,
            'issuer' => $project->issuer,
            'cover_image' => $project->cover_image,
            'images' => $project->images,
        ];
    }
}
