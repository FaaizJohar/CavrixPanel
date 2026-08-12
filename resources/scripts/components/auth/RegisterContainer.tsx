import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import register from '@/api/auth/register';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, ref as yupRef, string } from 'yup';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import { EyeIcon, EyeOffIcon, LockClosedIcon, MailIcon, UserIcon } from '@heroicons/react/outline';

interface Values {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirmation: string;
}

const iconStyle = { width: 18, height: 18 };

const RegisterContainer: React.FC = () => {
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

        register({ ...values, recaptchaData: token })
            .then((response) => {
                // @ts-expect-error this is valid
                window.location = response.intended || '/';
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
            initialValues={{
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                password: '',
                password_confirmation: '',
            }}
            validationSchema={object().shape({
                username: string()
                    .matches(
                        /^[a-z0-9]([\w.-]+)[a-z0-9]$/,
                        'Usernames must start and end with alpha-numeric characters and contain only letters, numbers, dashes, underscores, and periods.'
                    )
                    .required('A username must be provided.'),
                email: string()
                    .email('A valid email address must be provided.')
                    .required('A valid email address must be provided.'),
                first_name: string().required('Please enter your first name.'),
                last_name: string().required('Please enter your last name.'),
                password: string()
                    .min(8, 'Your password must be at least 8 characters long.')
                    .required('Please enter a password.'),
                password_confirmation: string()
                    .required('Please confirm your password.')
                    // @ts-expect-error this is valid
                    .oneOf([yupRef('password'), null], 'Your passwords do not match.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer
                    title={'Create your account'}
                    subtitle={'Join the panel and get started in minutes.'}
                    css={tw`w-full flex`}
                >
                    <Field
                        type={'text'}
                        label={'Username'}
                        name={'username'}
                        disabled={isSubmitting}
                        autoComplete={'username'}
                        spellCheck={false}
                        icon={<UserIcon style={iconStyle} />}
                    />
                    <div css={tw`mt-5`}>
                        <Field
                            type={'email'}
                            label={'Email'}
                            name={'email'}
                            disabled={isSubmitting}
                            autoComplete={'email'}
                            spellCheck={false}
                            icon={<MailIcon style={iconStyle} />}
                        />
                    </div>
                    <div css={tw`mt-5 grid grid-cols-2 gap-3`}>
                        <Field
                            type={'text'}
                            label={'First Name'}
                            name={'first_name'}
                            disabled={isSubmitting}
                            autoComplete={'given-name'}
                            spellCheck={false}
                        />
                        <Field
                            type={'text'}
                            label={'Last Name'}
                            name={'last_name'}
                            disabled={isSubmitting}
                            autoComplete={'family-name'}
                            spellCheck={false}
                        />
                    </div>
                    <div css={tw`mt-5`}>
                        <Field
                            type={showPassword ? 'text' : 'password'}
                            label={'Password'}
                            name={'password'}
                            disabled={isSubmitting}
                            autoComplete={'new-password'}
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
                    <div css={tw`mt-5`}>
                        <Field
                            type={showPassword ? 'text' : 'password'}
                            label={'Confirm Password'}
                            name={'password_confirmation'}
                            disabled={isSubmitting}
                            autoComplete={'new-password'}
                            icon={<LockClosedIcon style={iconStyle} />}
                        />
                    </div>
                    <div css={tw`mt-6`}>
                        <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                            Create Account
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
                        <span css={tw`text-xs text-neutral-500 tracking-wide`}>Already have an account? </span>
                        <Link
                            to={'/auth/login'}
                            css={tw`text-xs text-neutral-400 tracking-wide no-underline uppercase hover:text-neutral-100`}
                        >
                            Sign In
                        </Link>
                    </div>
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default RegisterContainer;
