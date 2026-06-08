<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\AdminAuditLog;
use Illuminate\Support\Facades\Storage;

class ReviewResponseController extends Controller
{
    public function updateReportStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,reviewing,resolved,dismissed',
        ]);

        $report = Report::findOrFail($id);
        $oldStatus = $report->status;

        $report->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        // Audit log
        AdminAuditLog::record('report', "Report status updated to {$validated['status']}", [
            'affected_user' => $report->reported_by ?? 'Unknown',
            'affected_id' => $report->id,
            'notes' => "Report ID {$report->id} status changed from {$oldStatus} to {$validated['status']}",
            'properties' => ['old_status' => $oldStatus, 'new_status' => $validated['status'], 'report_id' => $report->id],
        ]);

        return redirect()->back()->with('success', 'Report status updated successfully');
    }

    public function downloadReportEvidence(Request $request, Report $report, string $filename)
    {
        // URL decode the filename parameter if needed
        $filename = urldecode($filename);

        // Check if the evidence file exists in the report's evidence array
        $evidence = $report->evidence ?? [];
        $foundFile = null;

        foreach ($evidence as $evidenceItem) {
            if (is_string($evidenceItem) && ($evidenceItem === $filename || basename($evidenceItem) === $filename)) {
                $foundFile = $evidenceItem;
                break;
            }
        }

        if (!$foundFile) {
            abort(404, 'Evidence file not found');
        }

        // Construct the full path
        $filePath = 'report_files/' . basename($foundFile);

        // Check if file exists in storage
        if (!Storage::disk('public')->exists($filePath)) {
            abort(404, 'Evidence file not found on disk');
        }

        // Return the file for download
        return Storage::disk('public')->download($filePath, $filename);
    }
}
