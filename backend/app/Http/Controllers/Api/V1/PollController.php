<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Poll;
use App\Models\PollVote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PollController extends Controller
{
    /**
     * GET /api/v1/polls
     * Open polls for projects the authenticated user has invested in.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $projectIds = $user->investments()->pluck('project_id')->unique();

        $polls = Poll::whereIn('project_id', $projectIds)
            ->where(function ($q) {
                $q->whereNull('closes_at')->orWhere('closes_at', '>', now());
            })
            ->with(['project:id,code,name', 'votes'])
            ->get()
            ->map(function (Poll $poll) use ($user) {
                return [
                    'id' => $poll->id,
                    'project' => [
                        'code' => $poll->project?->code,
                        'name' => $poll->project?->name,
                    ],
                    'question' => $poll->question,
                    'options' => $poll->options,
                    'closes_at' => $poll->closes_at,
                    'my_vote' => $poll->votes->firstWhere('user_id', $user->id)?->option_index,
                    'votes_count' => $poll->votesPerOption(),
                ];
            });

        return response()->json($polls);
    }

    /**
     * POST /api/v1/polls/{poll}/vote
     */
    public function vote(Request $request, Poll $poll): JsonResponse
    {
        if (! $poll->isOpen()) {
            return response()->json(['message' => 'This poll has closed.'], 422);
        }

        $data = $request->validate([
            'option_index' => 'required|integer|min:0',
        ]);

        $options = $poll->options ?? [];
        if (! array_key_exists($data['option_index'], $options)) {
            return response()->json([
                'message' => 'The selected option is not valid for this poll.',
            ], 422);
        }

        $existing = PollVote::where('poll_id', $poll->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already voted in this poll.',
            ], 409);
        }

        $vote = PollVote::create([
            'poll_id' => $poll->id,
            'user_id' => $request->user()->id,
            'option_index' => $data['option_index'],
        ]);

        return response()->json($vote, 201);
    }
}
