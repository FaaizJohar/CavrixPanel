<?php

namespace Pterodactyl\Http\Requests\Auth;

use Pterodactyl\Models\User;
use Pterodactyl\Rules\Username;
use Pterodactyl\Rules\UserEmail;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorized(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'between:1,191', 'unique:users,username', new Username()],
            'email' => ['required', 'email', 'between:1,191', 'unique:users,email', new UserEmail()],
            'first_name' => 'required|string|between:1,191',
            'last_name' => 'required|string|between:1,191',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function attributes(): array
    {
        return [
            'username' => 'Username',
            'email' => 'Email Address',
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'password' => 'Password',
        ];
    }

    public function validated($key = null, $default = null): array
    {
        $data = parent::validated();

        return array_merge($data, [
            'name_first' => $data['first_name'],
            'name_last' => $data['last_name'],
            'root_admin' => false,
        ]);
    }
}
