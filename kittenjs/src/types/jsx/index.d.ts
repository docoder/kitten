declare module JSX {
    import React from 'react'
    interface IntrinsicElements {
        app: React.ReactNode;
        page: React.ReactNode;
        table: React.ReactNode;
        form: React.ReactNode;
        layout: React.ReactNode;
        alert: React.ReactNode;
        loading: React.ReactNode;
    }
}
