import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'px-3 py-2.5 rounded-md border border-input bg-card text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm transition-all ' +
                className
            }
            ref={localRef}
        />
    );
});
