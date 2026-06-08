<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ResponseController extends Controller
{
    public function response(Request $request)
    {
        $validated = $request->validate([
            'review_id' => 'required|exists:reviews,id',
            'response' => 'required|string|max:1000',
            'response_name' => 'required|string|max:255',
        ]);

        Review::where('id', $validated['review_id'])->update([
            'response' => $validated['response'],
            'response_person' => $validated['response_name'],
        ]);

        return redirect()->back()->with('success', 'Response submitted successfully');
    }
}
