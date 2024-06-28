// NotificationProvider.js
import { useState, useCallback } from "react";
import { Snackbar, Alert, Slide } from "@mui/material";
import NotificationContext from "./NotificationContext";

const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "info", // 'success', 'error', 'warning'
    });

    const showNotification = useCallback((message, severity = "info") => {
        setNotification({
            open: true,
            message,
            severity,
        });
    }, []);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setNotification((prev) => ({ ...prev, open: false }));
    };

    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                TransitionComponent={Slide}>
                <Alert
                    onClose={handleClose}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: "100%" }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
