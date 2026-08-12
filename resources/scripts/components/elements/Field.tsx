import React, { forwardRef } from 'react';
import { Field as FormikField, FieldProps } from 'formik';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import tw from 'twin.macro';

interface OwnProps {
    name: string;
    light?: boolean;
    label?: string;
    description?: string;
    icon?: React.ReactNode;
    append?: React.ReactNode;
    validate?: (value: any) => undefined | string | Promise<any>;
}

type Props = OwnProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'>;

const Field = forwardRef<HTMLInputElement, Props>(
    ({ id, name, light = false, label, description, validate, icon, append, ...props }, ref) => (
        <FormikField innerRef={ref} name={name} validate={validate}>
            {({ field, form: { errors, touched } }: FieldProps) => (
                <div>
                    {label && (
                        <Label htmlFor={id} isLight={light}>
                            {label}
                        </Label>
                    )}
                    <div css={tw`relative`}>
                        {icon && (
                            <span
                                css={tw`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400`}
                            >
                                {icon}
                            </span>
                        )}
                        <Input
                            id={id}
                            {...field}
                            {...props}
                            isLight={light}
                            hasError={!!(touched[field.name] && errors[field.name])}
                            style={{
                                paddingLeft: icon ? '2.5rem' : undefined,
                                paddingRight: append ? '2.5rem' : undefined,
                            }}
                        />
                        {append && <span css={tw`absolute right-2 top-1/2 -translate-y-1/2`}>{append}</span>}
                    </div>
                    {touched[field.name] && errors[field.name] ? (
                        <p className={'input-help error'}>
                            {(errors[field.name] as string).charAt(0).toUpperCase() +
                                (errors[field.name] as string).slice(1)}
                        </p>
                    ) : description ? (
                        <p className={'input-help'}>{description}</p>
                    ) : null}
                </div>
            )}
        </FormikField>
    )
);
Field.displayName = 'Field';

export default Field;
