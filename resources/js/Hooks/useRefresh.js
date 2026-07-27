import { useState } from 'react';
import { router } from '@inertiajs/react';

export function useRefresh(only) {
    const [refreshing, setRefreshing] = useState(false);

    const refresh = () => {
        if (refreshing) return;
        setRefreshing(true);

        const opts = { onFinish: () => setRefreshing(false) };

        if (Array.isArray(only) && only.length) {
            opts.only = only;
        }

        router.reload(opts);
    };

    return [refreshing, refresh];
}