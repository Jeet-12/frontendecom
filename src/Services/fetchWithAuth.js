export const handleUnauthorized = () => {
    localStorage.clear();
    window.location.href = '/login';
};

export const fetchWithAuth = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        return response;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};
