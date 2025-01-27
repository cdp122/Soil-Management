class Api {
    constructor(baseURL) {
        this.api_url = baseURL;
    }

    async nuevaParcela(data) {
        try {
            const response = await fetch(`${this.api_url}/nuevaparcela`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            return { error: true, message: error.message };
        }
    }

    async nuevaMuestra(data){
        // TODO: Implementar el envio de muestras
        console.log("Enviando muestra...", data);
    }
}

// const urlLocal = "https://beb9-186-71-12-133.ngrok-free.app"
const urlServer = "https://soil-management-4-soft-utn.onrender.com"
const api = new Api(urlServer);

export default api;
