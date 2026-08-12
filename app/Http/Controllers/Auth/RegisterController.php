<?php

namespace Pterodactyl\Http\Controllers\Auth;

use Pterodactyl\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\View\View;
use Pterodactyl\Services\Users\UserCreationService;
use Pterodactyl\Http\Requests\Auth\RegisterRequest;

class RegisterController extends AbstractLoginController
{
    /**
     * RegisterController constructor.
     */
    public function __construct(private UserCreationService $creationService)
    {
        parent::__construct();
    }

    /**
     * Render the registration view. React will take over and turn the area
     * into an SPA.
     */
    public function index(): View
    {
        return view('templates/auth.core');
    }

    /**
     * Handle a registration request to the application. The user is created
     * and immediately logged in.
     *
     * @throws \Throwable
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->creationService->handle($request->validated());

        return $this->sendLoginResponse($user, $request);
    }
}
