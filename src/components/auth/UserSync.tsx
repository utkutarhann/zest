import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

export function UserSync() {
    const { user, isSignedIn } = useUser();

    useEffect(() => {
        const syncUser = async () => {
            if (isSignedIn && user) {
                try {
                    const email = user.primaryEmailAddress?.emailAddress;
                    if (!email) return;

                    await fetch(`${import.meta.env.VITE_API_URL}/api/users/sync`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: user.id,
                            email: email,
                        }),
                    });
                    console.log('User synced with backend');
                } catch (error) {
                    console.error('Failed to sync user:', error);
                }
            }
        };

        syncUser();
    }, [isSignedIn, user]);

    return null; // This component doesn't render anything
}
