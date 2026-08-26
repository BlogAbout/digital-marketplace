<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Services\ExportService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ExportController extends Controller
{
    public function __construct(
        private readonly ExportService $exportService
    ) {}

    public function exportProducts(Request $request): Response
    {
        $path = $this->exportService->exportProducts($request->user());

        return response()->download($path)->deleteFileAfterSend();
    }

    public function exportOrders(Request $request): Response
    {
        $path = $this->exportService->exportOrders($request->user());

        return response()->download($path)->deleteFileAfterSend();
    }
}
