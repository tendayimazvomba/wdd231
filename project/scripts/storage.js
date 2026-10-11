
/******** Local Storage ********/

export function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error("Unable to save data:", error);
        return false;
    }
}

export function getData(key) {
    try {
        const storedData = localStorage.getItem(key);

        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.error("Unable to retrieve data:", error);
        return null;
    }
}

export function removeData(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Unable to remove data:", error);
    }
}
