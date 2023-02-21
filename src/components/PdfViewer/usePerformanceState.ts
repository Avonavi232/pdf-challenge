import { useMemo, useState } from 'react';

export const usePerformanceState = () => {
    const [ _loadTime, setLoadTime ] = useState<any | null>(null);

    const loadTime = useMemo(() => _loadTime ? `${Math.round(_loadTime)}ms` : null, [ _loadTime ]);

    return { loadTime, setLoadTime }
}
