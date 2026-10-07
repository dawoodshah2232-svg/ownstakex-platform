<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BlogPost::whereNotNull('published_at')
            ->where('published_at', '<=', now());

        if ($request->filled('tag')) {
            $query->where('tag', $request->string('tag'));
        }

        if ($request->filled('search')) {
            $search = '%'.$request->string('search').'%';
            $query->where(fn ($q) => $q->where('title', 'like', $search)->orWhere('excerpt', 'like', $search));
        }

        return response()->json(
            $query->latest('published_at')->paginate($request->integer('per_page', 12))
        );
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::where('slug', $slug)
            ->whereNotNull('published_at')
            ->firstOrFail();

        return response()->json($post);
    }
}
