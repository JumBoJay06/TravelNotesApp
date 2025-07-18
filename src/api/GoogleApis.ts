const Maps_API_KEY = process.env.EXPO_PUBLIC_Maps_API_KEY;

export const fetchGoogleApi = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${Maps_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
    };