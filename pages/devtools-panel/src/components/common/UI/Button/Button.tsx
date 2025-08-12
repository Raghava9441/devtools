import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    className,
    children,
    ...props
}) => {


    const renderIcon = () => {
        if (loading) {
            return <span className="btn-spinner" />;
        }
        return icon;
    };

    return (
        <button
            className={[
                styles.btn,
                styles[`btn-${variant}`],
                styles[`btn-${size}`],
                loading && styles['btn-loading'],
                fullWidth && styles['btn-full-width'],
                icon && styles['btn-has-icon'],
                icon && iconPosition === 'right' && styles['btn-icon-right'],
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            disabled={disabled || loading}
            {...props}
        >
            {icon && iconPosition === 'left' && (
                <span className="btn-icon-container">
                    {renderIcon()}
                </span>
            )}

            <span className="btn-content">
                {children}
            </span>

            {icon && iconPosition === 'right' && (
                <span className="btn-icon-container">
                    {renderIcon()}
                </span>
            )}
        </button>
    );
};

export default Button;