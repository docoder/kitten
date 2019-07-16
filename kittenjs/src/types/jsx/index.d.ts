declare module JSX {
    import React from 'react'
    interface IntrinsicElements {
        k_app: React.ReactNode;
        k_page: React.ReactNode;
        k_table: React.ReactNode;
        k_form: React.ReactNode;
        k_layout: React.ReactNode;
        k_alert: React.ReactNode;
        k_loading: React.ReactNode;
        k_button: React.ReactNode;
        k_modal: React.ReactNode;
    }
}
