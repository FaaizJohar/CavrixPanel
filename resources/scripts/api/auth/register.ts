import http from '@/api/http';

export interface RegisterData {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirmation: string;
    recaptchaData?: string | null;
}

export interface RegisterResponse {
    intended?: string;
}

export default (data: RegisterData): Promise<RegisterResponse> => {
    return new Promise((resolve, reject) => {
        http.get('/sanctum/csrf-cookie')
            .then(() =>
                http.post('/auth/register', {
                    username: data.username,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                    'g-recaptcha-response': data.recaptchaData,
                })
            )
            .then((response) => {
                if (!(response.data instanceof Object)) {
                    return reject(new Error('An error occurred while processing the registration request.'));
                }

                return resolve({
                    intended: response.data.data.intended || undefined,
                });
            })
            .catch(reject);
    });
};
