<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        // API endpoints should return 401, not redirect
        if ($request->expectsJson()) {
            return null;
        }
        
        // For web routes, redirect to login (but we're API only)
        return null;
    }
}
