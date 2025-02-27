import { PropsWithChildren } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { AppQueryClientProvider } from '@/lib/providers/app-query-client-provider';
import { Toaster } from '@/lib/components/ui/sonner';
import './globals.css';

const RootLayout = ({ children }: PropsWithChildren) => {
    return (
        <html lang="en">
            <body>
                <AppQueryClientProvider>{children}</AppQueryClientProvider>
                <Toaster />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
};

export default RootLayout;
