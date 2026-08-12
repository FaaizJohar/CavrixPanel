import React from 'react';
import classNames from 'classnames';

const fieldLabel: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.35rem',
};

const labelText: React.CSSProperties = {
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    color: 'var(--pg-text-muted)',
};

const valueText: React.CSSProperties = {
    fontSize: '0.72rem',
    fontVariantNumeric: 'tabular-nums',
    color: 'var(--pg-accent-400)',
};

const controlShell: React.CSSProperties = {
    marginBottom: '0.9rem',
};

export const FieldLabel: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <div style={fieldLabel}>
        <span style={labelText}>{label}</span>
        {value !== undefined && <span style={valueText}>{value}</span>}
    </div>
);

interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ label, value, min, max, step = 1, unit = '', onChange }) => (
    <div style={controlShell}>
        <FieldLabel label={label} value={`${value}${unit}`} />
        <input
            type='range'
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            style={{
                width: '100%',
                color: 'var(--pg-accent-500)',
                height: '1.1rem',
                cursor: 'pointer',
            }}
        />
    </div>
);

interface ColorFieldProps {
    label: string;
    value: string;
    swatches?: string[];
    onChange: (value: string) => void;
}

export const ColorField: React.FC<ColorFieldProps> = ({ label, value, swatches = [], onChange }) => (
    <div style={controlShell}>
        <FieldLabel label={label} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label
                style={{
                    position: 'relative',
                    width: '2.2rem',
                    height: '2.2rem',
                    borderRadius: 'var(--pg-radius-sm)',
                    border: '1px solid var(--pg-border)',
                    overflow: 'hidden',
                    flex: 'none',
                    cursor: 'pointer',
                    background: value,
                }}
            >
                <input
                    type='color'
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    style={{
                        position: 'absolute',
                        inset: '-8px',
                        width: 'calc(100% + 16px)',
                        height: 'calc(100% + 16px)',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                    }}
                />
            </label>
            <input
                type='text'
                value={value}
                spellCheck={false}
                onChange={(event) => onChange(event.target.value)}
                style={{
                    width: '100%',
                    minWidth: 0,
                    background: 'rgb(var(--pg-n-600) / 0.6)',
                    border: '1px solid var(--pg-border)',
                    borderRadius: 'var(--pg-radius-sm)',
                    color: 'var(--pg-text)',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--pg-font-mono)',
                    outline: 'none',
                }}
            />
        </div>
        {swatches.length > 0 && (
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.45rem' }}>
                {swatches.map((swatch) => (
                    <button
                        key={swatch}
                        type='button'
                        aria-label={swatch}
                        onClick={() => onChange(swatch)}
                        className={classNames('ts-swatch', { active: value.toLowerCase() === swatch.toLowerCase() })}
                        style={{
                            width: '1.35rem',
                            height: '1.35rem',
                            borderRadius: '50%',
                            border: '1px solid var(--pg-border-strong)',
                            background: swatch,
                            cursor: 'pointer',
                            padding: 0,
                            outline:
                                value.toLowerCase() === swatch.toLowerCase()
                                    ? '2px solid var(--pg-accent-500)'
                                    : 'none',
                            outlineOffset: 1,
                        }}
                    />
                ))}
            </div>
        )}
    </div>
);

interface TextFieldProps {
    label: string;
    value: string;
    placeholder?: string;
    type?: 'text' | 'password';
    onChange: (value: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({ label, value, placeholder, type = 'text', onChange }) => (
    <div style={controlShell}>
        <FieldLabel label={label} />
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            style={{
                width: '100%',
                background: 'rgb(var(--pg-n-600) / 0.6)',
                border: '1px solid var(--pg-border)',
                borderRadius: 'var(--pg-radius-sm)',
                color: 'var(--pg-text)',
                padding: '0.4rem 0.5rem',
                fontSize: '0.8rem',
                outline: 'none',
            }}
        />
    </div>
);

interface TextAreaFieldProps {
    label: string;
    value: string;
    rows?: number;
    placeholder?: string;
    onChange: (value: string) => void;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, value, rows = 4, placeholder, onChange }) => (
    <div style={controlShell}>
        <FieldLabel label={label} />
        <textarea
            value={value}
            rows={rows}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            style={{
                width: '100%',
                resize: 'vertical',
                background: 'rgb(var(--pg-n-600) / 0.6)',
                border: '1px solid var(--pg-border)',
                borderRadius: 'var(--pg-radius-sm)',
                color: 'var(--pg-text)',
                padding: '0.4rem 0.5rem',
                fontSize: '0.78rem',
                fontFamily: 'var(--pg-font-mono)',
                lineHeight: 1.5,
                outline: 'none',
            }}
        />
    </div>
);

interface SelectFieldProps<T extends string> {
    label: string;
    value: T;
    options: Array<{ value: T; label: string }>;
    onChange: (value: T) => void;
}

export const SelectField = <T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) => (
    <div style={controlShell}>
        <FieldLabel label={label} />
        <select
            value={value}
            onChange={(event) => onChange(event.target.value as T)}
            style={{
                width: '100%',
                background: 'rgb(var(--pg-n-600) / 0.6)',
                border: '1px solid var(--pg-border)',
                borderRadius: 'var(--pg-radius-sm)',
                color: 'var(--pg-text)',
                padding: '0.4rem 0.5rem',
                fontSize: '0.8rem',
                outline: 'none',
            }}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

interface SegmentedProps<T extends string> {
    label: string;
    value: T;
    options: Array<{ value: T; label: string }>;
    onChange: (value: T) => void;
}

export const Segmented = <T extends string>({ label, value, options, onChange }: SegmentedProps<T>) => (
    <div style={controlShell}>
        <FieldLabel label={label} />
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.3rem',
            }}
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    type='button'
                    onClick={() => onChange(option.value)}
                    style={{
                        padding: '0.3rem 0.6rem',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        borderRadius: 'var(--pg-radius-sm)',
                        border: '1px solid var(--pg-border)',
                        color: option.value === value ? 'var(--pg-accent-text)' : 'var(--pg-text-muted)',
                        background: option.value === value ? 'var(--pg-accent-500)' : 'rgb(var(--pg-n-600) / 0.4)',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                    }}
                >
                    {option.label}
                </button>
            ))}
        </div>
    </div>
);

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => (
    <div
        style={{
            ...controlShell,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
        }}
    >
        <span style={labelText}>{label}</span>
        <button
            type='button'
            role='switch'
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            style={{
                position: 'relative',
                width: '2.3rem',
                height: '1.3rem',
                borderRadius: '9999px',
                border: '1px solid var(--pg-border-strong)',
                background: checked ? 'var(--pg-accent-500)' : 'rgb(var(--pg-n-600) / 0.7)',
                cursor: 'pointer',
                flex: 'none',
                transition: 'background 150ms ease',
            }}
        >
            <span
                style={{
                    position: 'absolute',
                    top: '0.15rem',
                    left: checked ? '1.15rem' : '0.15rem',
                    width: '0.85rem',
                    height: '0.85rem',
                    borderRadius: '50%',
                    background: '#ffffff',
                    transition: 'left 150ms ease',
                }}
            />
        </button>
    </div>
);

interface MediaFieldProps {
    label: string;
    value: string;
    accept?: string;
    uploading?: boolean;
    onSelect: (file: File) => void;
    onClear?: () => void;
    hint?: string;
}

export const MediaField: React.FC<MediaFieldProps> = ({
    label,
    value,
    accept = 'image/png,image/jpeg,image/webp,image/avif,image/svg+xml,video/mp4,video/webm',
    uploading,
    onSelect,
    onClear,
    hint,
}) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div style={controlShell}>
            <FieldLabel label={label} />
            <input
                ref={inputRef}
                type='file'
                accept={accept}
                style={{ display: 'none' }}
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onSelect(file);
                    event.target.value = '';
                }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                    type='button'
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    style={{
                        padding: '0.4rem 0.7rem',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        borderRadius: 'var(--pg-radius-sm)',
                        border: '1px solid var(--pg-border-strong)',
                        color: 'var(--pg-text)',
                        background: 'rgb(var(--pg-n-600) / 0.6)',
                        cursor: 'pointer',
                        flex: 'none',
                    }}
                >
                    {uploading ? 'Uploading…' : value ? 'Replace' : 'Upload'}
                </button>
                {value && (
                    <>
                        {value.startsWith('data:image') ? (
                            <img
                                src={value}
                                alt=''
                                style={{
                                    height: '2.2rem',
                                    maxWidth: '4rem',
                                    objectFit: 'contain',
                                    borderRadius: 'var(--pg-radius-sm)',
                                    border: '1px solid var(--pg-border)',
                                    background: 'rgb(var(--pg-n-800))',
                                }}
                            />
                        ) : value.startsWith('data:video') || /\.(mp4|webm)(\?|$)/i.test(value) ? (
                            <video
                                src={value}
                                muted
                                style={{
                                    height: '2.2rem',
                                    maxWidth: '4rem',
                                    borderRadius: 'var(--pg-radius-sm)',
                                    border: '1px solid var(--pg-border)',
                                }}
                            />
                        ) : (
                            <span
                                style={{
                                    fontSize: '0.72rem',
                                    color: 'var(--pg-text-muted)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '9rem',
                                }}
                            >
                                {value}
                            </span>
                        )}
                        {onClear && (
                            <button
                                type='button'
                                onClick={onClear}
                                aria-label='Clear'
                                style={{
                                    padding: '0.2rem 0.4rem',
                                    fontSize: '0.68rem',
                                    borderRadius: 'var(--pg-radius-sm)',
                                    border: '1px solid var(--pg-border)',
                                    color: 'var(--pg-text-muted)',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    flex: 'none',
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </>
                )}
            </div>
            {hint && <p style={{ margin: '0.35rem 0 0', fontSize: '0.7rem', color: 'var(--pg-text-faint)' }}>{hint}</p>}
        </div>
    );
};

interface EditorSectionProps {
    title: string;
    hint?: string;
    children: React.ReactNode;
}

export const EditorSection: React.FC<EditorSectionProps> = ({ title, hint, children }) => (
    <div
        style={{
            padding: '1rem 1.1rem',
            borderBottom: '1px solid var(--pg-border)',
        }}
    >
        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--pg-text)' }}>{title}</p>
        {hint && (
            <p style={{ margin: '0.2rem 0 0.8rem', fontSize: '0.72rem', color: 'var(--pg-text-faint)' }}>{hint}</p>
        )}
        {!hint && <div style={{ height: '0.8rem' }} />}
        {children}
    </div>
);
