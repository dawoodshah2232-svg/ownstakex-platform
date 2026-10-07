<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\AuditLog;
use App\Models\Document;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /* ---------------- users ---------------- */

    public function users(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(fn ($q) => $q->where('name', 'like', $search)->orWhere('email', 'like', $search));
        }

        if ($request->filled('role')) {
            $query->where('role', $request->string('role'));
        }

        return response()->json($query->latest()->paginate($request->integer('per_page', 20)));
    }

    public function updateUser(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:100',
            'kyc_status' => 'sometimes|in:pending,approved,rejected',
            'role' => 'sometimes|in:investor,admin',
        ]);

        $user->update($data);
        $this->audit($request, 'user.updated', "{$user->email}");

        return response()->json($user);
    }

    /* ---------------- projects ---------------- */

    public function projects(Request $request): JsonResponse
    {
        return response()->json(
            Project::withCount(['reservations', 'investments'])->latest()
                ->paginate($request->integer('per_page', 20))
        );
    }

    public function storeProject(Request $request): JsonResponse
    {
        $data = $this->validateProject($request);
        $data['slug'] = Str::slug($data['name']).'-'.Str::lower(Str::random(6));

        $project = Project::create($data);
        $this->syncMedia($request, $project);
        $this->audit($request, 'project.created', "{$project->code} · {$project->name}");

        return response()->json($project->load(['images', 'documents']), 201);
    }

    public function updateProject(Request $request, Project $project): JsonResponse
    {
        $project->update($this->validateProject($request, $project->id));
        $this->syncMedia($request, $project);
        $this->audit($request, 'project.updated', "{$project->code} · {$project->name}");

        return response()->json($project->load(['images', 'documents']));
    }

    public function destroyProject(Request $request, Project $project): JsonResponse
    {
        $this->audit($request, 'project.deleted', "{$project->code} · {$project->name}");
        $project->delete();

        return response()->json(['message' => 'Project deleted.']);
    }

    /**
     * Attach cover/gallery images, video and documents to a project.
     *
     * @return array<string, mixed>
     */
    private function validateProject(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'code' => 'required|string|max:50|unique:projects,code'.($ignoreId ? ",{$ignoreId}" : ''),
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'location' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'capital' => 'required|numeric|min:0',
            'units' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'min_units' => 'integer|min:1',
            'max_units' => 'integer|min:1',
            'status' => 'in:draft,evaluation,funding,closing,operating',
            'version' => 'nullable|string|max:20',
            'campaign_ends' => 'nullable|date',
            'long_stop' => 'nullable|date',
            'operator' => 'nullable|string|max:255',
            'issuer' => 'nullable|string|max:255',
            'cover_image' => 'nullable|string|max:2048',
            'video_url' => 'nullable|string|max:2048',
        ]);
    }

    private function syncMedia(Request $request, Project $project): void
    {
        if ($request->has('images') && is_array($request->input('images'))) {
            $project->images()->delete();
            foreach (array_values($request->input('images')) as $i => $url) {
                if (! is_string($url) || $url === '') {
                    continue;
                }
                ProjectImage::create(['project_id' => $project->id, 'url' => $url, 'sort_order' => $i]);
            }
        }

        if ($request->has('documents') && is_array($request->input('documents'))) {
            foreach ($request->input('documents') as $doc) {
                if (! is_array($doc) || empty($doc['title']) || empty($doc['file_url'])) {
                    continue;
                }
                Document::create([
                    'title' => $doc['title'],
                    'category' => $doc['category'] ?? 'Offering',
                    'file_url' => $doc['file_url'],
                    'file_size' => $doc['file_size'] ?? null,
                    'mime' => $doc['mime'] ?? 'application/pdf',
                    'audience' => $doc['audience'] ?? 'investors',
                    'project_id' => $project->id,
                    'version' => $doc['version'] ?? null,
                ]);
            }
        }
    }

    /* ---------------- documents ---------------- */

    public function documents(Request $request): JsonResponse
    {
        return response()->json(
            Document::with('project:id,name,code')->latest()
                ->paginate($request->integer('per_page', 20))
        );
    }

    public function storeDocument(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'file_url' => 'required|string|max:2048',
            'file_size' => 'nullable|string|max:50',
            'mime' => 'nullable|string|max:100',
            'audience' => 'in:investors,internal',
            'project_id' => 'nullable|exists:projects,id',
            'version' => 'nullable|string|max:30',
        ]);

        $document = Document::create($data);
        $this->audit($request, 'document.created', $document->title);

        return response()->json($document, 201);
    }

    public function updateDocument(Request $request, Document $document): JsonResponse
    {
        $document->update($request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:100',
            'file_url' => 'sometimes|string|max:2048',
            'file_size' => 'nullable|string|max:50',
            'mime' => 'nullable|string|max:100',
            'audience' => 'sometimes|in:investors,internal',
            'project_id' => 'nullable|exists:projects,id',
            'version' => 'nullable|string|max:30',
        ]));
        $this->audit($request, 'document.updated', $document->title);

        return response()->json($document);
    }

    public function destroyDocument(Request $request, Document $document): JsonResponse
    {
        $this->audit($request, 'document.deleted', $document->title);
        $document->delete();

        return response()->json(['message' => 'Document deleted.']);
    }

    /* ---------------- announcements ---------------- */

    public function announcements(): JsonResponse
    {
        return response()->json(Announcement::latest()->paginate(20));
    }

    public function storeAnnouncement(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'audience' => 'nullable|string|max:30',
            'published_at' => 'nullable|date',
        ]);

        $announcement = Announcement::create($data);
        $this->audit($request, 'announcement.created', $announcement->title);

        return response()->json($announcement, 201);
    }

    public function updateAnnouncement(Request $request, Announcement $announcement): JsonResponse
    {
        $announcement->update($request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'audience' => 'nullable|string|max:30',
            'published_at' => 'nullable|date',
        ]));
        $this->audit($request, 'announcement.updated', $announcement->title);

        return response()->json($announcement);
    }

    public function destroyAnnouncement(Request $request, Announcement $announcement): JsonResponse
    {
        $this->audit($request, 'announcement.deleted', $announcement->title);
        $announcement->delete();

        return response()->json(['message' => 'Announcement deleted.']);
    }

    /* ---------------- audit log ---------------- */

    public function auditLogs(Request $request): JsonResponse
    {
        return response()->json(AuditLog::latest()->paginate($request->integer('per_page', 50)));
    }

    private function audit(Request $request, string $action, ?string $detail = null): void
    {
        AuditLog::create([
            'actor_id' => $request->user()->id,
            'actor_role' => $request->user()->role,
            'action' => $action,
            'detail' => $detail,
        ]);
    }
}
