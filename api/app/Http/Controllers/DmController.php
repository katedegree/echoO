<?php

namespace App\Http\Controllers;

use App\Http\Requests\DmStoreRequest;
use App\Models\Message;
use App\Models\User;
use App\Responses\MutationResponse;
use App\Responses\QueryResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DmController extends Controller
{
    public function index(Request $request)
    {
        $me = $request->user();

        $messages = Message::where('sender_user_id', $me->id)
            ->orWhere('receiver_user_id', $me->id)
            ->latest()
            ->get();

        $grouped = $messages->groupBy(fn ($m) =>
            $m->sender_user_id == $me->id ? $m->receiver_user_id : $m->sender_user_id
        );

        $partners = User::whereIn('id', $grouped->keys())
            ->with('profile.iconMedia')
            ->get()
            ->keyBy('id');

        $readMessageIds = DB::table('message_reads')
            ->where('user_id', $me->id)
            ->pluck('message_id');

        $data = $grouped->map(function ($msgs, $partnerId) use ($me, $partners, $readMessageIds) {
            $latest = $msgs->first();
            $partner = $partners->get($partnerId);

            $unreadCount = $msgs
                ->where('sender_user_id', $partnerId)
                ->whereNotIn('id', $readMessageIds)
                ->count();

            return [
                'id' => $latest->id,
                'content' => $latest->content,
                'user' => [
                    'id' => (int) $partnerId,
                    'name' => $partner?->profile?->name,
                    'iconUrl' => $partner?->profile?->iconMedia?->url,
                ],
                'unreadCount' => $unreadCount,
            ];
        })->sortByDesc('id')->values();

        return QueryResponse::success($data)->json();
    }

    public function show(Request $request, $userId)
    {
        $me = $request->user();
        $limit = $request->input('limit', 20);
        $cursor = $request->input('cursor');

        $messages = Message::with('media')
            ->where(function ($q) use ($me, $userId) {
                $q->where('sender_user_id', $me->id)->where('receiver_user_id', $userId);
            })
            ->orWhere(function ($q) use ($me, $userId) {
                $q->where('sender_user_id', $userId)->where('receiver_user_id', $me->id);
            })
            ->when($cursor, fn ($q) => $q->where('id', '<', $cursor))
            ->orderByDesc('id')
            ->limit($limit)
            ->get();

        $data = $messages->map(fn ($m) => [
            'id' => $m->id,
            'content' => $m->content,
            'media' => $m->media->pluck('url')->toArray(),
            'isMe' => $m->sender_user_id == $me->id,
        ]);

        $nextCursor = $messages->count() === $limit ? $messages->last()->id : null;

        return QueryResponse::success($data)->with('cursor', $nextCursor)->json();
    }

    public function store(DmStoreRequest $request)
    {
        $me = $request->user();

        $message = Message::create([
            'sender_user_id' => $me->id,
            'receiver_user_id' => $request->receiverUserId,
            'content' => $request->content,
        ]);

        if ($request->mediaIds) {
            $message->media()->attach($request->mediaIds);
        }

        return MutationResponse::success('メッセージを送信しました。')->json(201);
    }

    public function read(Request $request, $userId)
    {
        $me = $request->user();

        $unreadIds = Message::where('sender_user_id', $userId)
            ->where('receiver_user_id', $me->id)
            ->whereNotIn('id', DB::table('message_reads')->where('user_id', $me->id)->pluck('message_id'))
            ->pluck('id');

        if ($unreadIds->isNotEmpty()) {
            $records = $unreadIds->map(fn ($id) => [
                'user_id' => $me->id,
                'message_id' => $id,
            ]);
            DB::table('message_reads')->insertOrIgnore($records->toArray());
        }

        return MutationResponse::success('既読にしました。')->json(200);
    }
}
