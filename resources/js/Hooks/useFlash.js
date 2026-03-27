import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

/**
 * Reads Inertia flash props and fires a callback once per navigation.
 *
 * @param {(flash: { success, error, emailSent, listing }) => void} callback
 */
export function useFlash(callback) {
    const { flash } = usePage().props;
    const prev = useRef(null);

    useEffect(() => {
        // Only fire when flash actually changes (Inertia re-renders on every visit)
        const key = JSON.stringify(flash);
        if (key !== prev.current && (flash.success || flash.error)) {
            prev.current = key;
            callback(flash);
        }
    }, [flash]);

    return flash;
}