<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo($request)
    {
        if (!$request->expectsJson()) {
            return route('Unauthorized');
        }
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]  ...$guards
     * @return mixed
     */
    public function handle($request, Closure $next, ...$guards)
    {
        $this->authenticate($request, $guards);

        $user = $request->user();

        if ($user && $user->role === 'regular') {
            $guard = 'regular';
        } elseif ($user && $user->role === 'manager') {
            $guard = 'manager';
        } elseif ($user && $user->role === 'admin') {
            $guard = 'admin';
        }

        if (!$guard) {
            $guard = config('auth.defaults.guard');
        }

        auth()->shouldUse($guard);

        return $next($request);
    }
}
