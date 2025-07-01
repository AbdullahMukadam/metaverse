"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function RefreshHandler() {
    const searchParams = useSearchParams();

    //this is the refresh handler and it will handle the page refresh when user redirect from gamepage to dashboard
    useEffect(() => {
        const handleRefresh = () => {
            const refreshParam = searchParams.get('refresh');
            const refreshExecuted = window.sessionStorage.getItem('refresh-executed');

            if (refreshParam === 'true' && !refreshExecuted) {
                window.sessionStorage.setItem('refresh-executed', 'true');


                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);


                setTimeout(() => {
                    window.sessionStorage.removeItem('refresh-executed');
                    window.location.reload();
                }, 50);
            }
        };

        handleRefresh();
    });

    return null;
}

export default RefreshHandler;