import React from 'react';

type RootProps = {
    children: React.ReactNode;
};

export default function Root({ children }: RootProps): JSX.Element {
    return <>{children}</>;
}
