import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import { EyeIcon, EyeOffIcon, LockClosedIcon, MailIcon } from '@heroicons/react/outline';

interface Values {
    username: string;
    password: string;
}

const iconStyle = { width: 18, height: 18 };

const LoginContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        login({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }

                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);

                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{ username: '', password: '' }}
            validationSchema={object().shape({
                username: string().required('A username or email must be provided.'),
                password: string().required('Please enter your account password.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer
                    title={'Welcome back'}
                    subtitle={'Sign in to continue to your servers.'}
                    css={tw`w-full flex`}
                >
                    <Field
                        type={'text'}
                        label={'Username or Email'}
                        name={'username'}
                        disabled={isSubmitting}
                        autoComplete={'username'}
                        spellCheck={false}
                        icon={<MailIcon style={iconStyle} />}
                    />
                    <div css={tw`mt-5`}>
                        <Field
                            type={showPassword ? 'text' : 'password'}
                            label={'Password'}
                            name={'password'}
                            disabled={isSubmitting}
                            autoComplete={'current-password'}
                            icon={<LockClosedIcon style={iconStyle} />}
                            append={
                                <button
                                    type={'button'}
                                    onClick={() => setShowPassword((value) => !value)}
                                    css={tw`inline-flex items-center justify-center p-2 rounded-lg text-neutral-400 hover:text-neutral-100 transition-colors duration-150 focus:outline-none`}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOffIcon style={iconStyle} /> : <EyeIcon style={iconStyle} />}
                                </button>
                            }
                        />
                    </div>
                    <div css={tw`mt-6`}>
                        <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                            Sign In
                        </Button>
                    </div>
                    {recaptchaEnabled && (
                        <Reaptcha
                            ref={ref}
                            size={'invisible'}
                            sitekey={siteKey || '_invalid_key'}
                            onVerify={(response) => {
                                setToken(response);
                                submitForm();
                            }}
                            onExpire={() => {
                                setSubmitting(false);
                                setToken('');
                            }}
                        />
                    )}
                    <div css={tw`mt-6 text-center`}>
                        <Link
                            to={'/auth/password'}
                            css={tw`text-xs text-neutral-500 tracking-wide no-underline uppercase hover:text-neutral-400`}
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div css={tw`mt-4 text-center`}>
                        <span css={tw`text-xs text-neutral-500 tracking-wide`}>Don&apos;t have an account? </span>
                        <Link
                            to={'/auth/register'}
                            css={tw`text-xs text-neutral-400 tracking-wide no-underline uppercase hover:text-neutral-100`}
                        >
                            Create one
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default LoginContainer;
