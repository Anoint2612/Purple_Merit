import React from 'react';

const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary', // primary, secondary, danger, success, icon
    disabled = false,
    className = '',
    title,
    icon: Icon
}) => {
    const getButtonClass = () => {
        switch (variant) {
            case 'primary': return 'btn-primary';
            case 'secondary': return 'btn-secondary';
            case 'danger': return 'btn-danger'; // Note: check if btn-danger is a button style or text style in CSS
            case 'success': return 'btn-success';
            case 'icon': return 'btn-icon';
            default: return 'btn-primary';
        }
    };

    // In the CSS, btn-danger and btn-success seem to be text colors for actions, 
    // but let's assume we might want them as full buttons too. 
    // If variant is 'danger-filled' we might need custom style or update CSS.
    // For now, mapping to existing classes.

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${getButtonClass()} ${className}`}
            title={title}
        >
            {Icon && <Icon size={20} style={{ marginRight: children ? '0.5rem' : 0 }} />}
            {children}
        </button>
    );
};

export default Button;
