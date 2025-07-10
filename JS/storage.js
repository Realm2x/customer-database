const STORAGE_KEY = "clients_app_data";

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const initialClient = async (clients) => {
    const existingData = await getLocalClients();
    if (existingData.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    }
    return clients;
};

// Сохранение клиента
export const saveLocalClient = async (obj) => {
    try {
        const clients = await getLocalClients();
        const newClient = {
            ...obj,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        clients.push(newClient);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
        return newClient;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Получение всех клиентов
export const getLocalClients = async () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.log(error);
        return [];
    }
};

// Поиск клиента по ID
export const searchLocalClient = async (id) => {
    try {
        const clients = await getLocalClients();
        return clients.find((client) => client.id === id);
    } catch (error) {
        console.log(error);
        return null;
    }
};

// Обновление клиента
export const patchLocalClient = async (obj, id) => {
    try {
        const clients = await getLocalClients();
        const index = clients.findIndex((client) => client.id === id);

        if (index !== -1) {
            clients[index] = {
                ...clients[index],
                ...obj,
                updatedAt: new Date().toISOString(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
            return clients[index];
        }
        throw new Error("Клиент не найден");
    } catch (error) {
        console.error("Ошибка обновления:", error);
        throw error;
    }
};

// Удаление клиента
export const deleteLocalClient = async (id) => {
    try {
        let clients = await getLocalClients();
        clients = clients.filter((client) => client.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
        return { success: true };
    } catch (error) {
        console.log(error);
        throw error;
    }
};
