import { PropsWithChildren } from 'react';

import { AppQueryClientProvider } from '@/lib/providers/app-query-client-provider';
import './globals.css';

const RootLayout = ({ children }: PropsWithChildren) => {
    return (
        <html lang="en">
            <body>
                <AppQueryClientProvider>{children}</AppQueryClientProvider>
            </body>
        </html>
    );
};

export default RootLayout;
