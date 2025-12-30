import React from 'react';

const Input = React.forwardRef(({
    label,
    type = 'text',
    name,
    icon: Icon,
    error,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`input-group ${className}`}>
            {label && <label htmlFor={name}>{label}</label>}
            <div className="input-wrapper">
                {Icon && <Icon className="input-icon" size={20} />}
                <input
                    ref={ref}
                    type={type}
                    id={name}
                    name={name}
                    className={error ? 'input-error' : ''}
                    style={Icon ? {} : { paddingLeft: '1rem' }}
                    {...props}
                />
            </div>
            {error && <span className="error-msg">{error}</span>}
        </div>
    );
});

export default Input;
