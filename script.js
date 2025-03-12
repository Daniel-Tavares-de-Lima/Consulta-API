// Inicializando o mapa com uma visão padrão
const map = L.map("map").setView([-23.55052, -46.633308], 5);

// Camada do OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker;

// Função para buscar localização via API do backend
async function searchLocation() {
    const searchTerm = document.getElementById("search").value.trim();

    if (!searchTerm) {
        alert("Por favor, digite um local!");
        return;
    }

    try {
        // Faz a requisição para o backend Node.js
        const response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (data.error) {
            alert("Local não encontrado!");
            return;
        }

        // Remove marcador anterior (se existir)
        if (marker) {
            map.removeLayer(marker);
        }

        // Adiciona novo marcador no mapa
        marker = L.marker([data.lat, data.lon]).addTo(map)
            .bindPopup(`<b>${data.name}</b>`)
            .openPopup();

        // Centraliza o mapa na nova posição
        map.setView([data.lat, data.lon], 12);

        // Atualiza a exibição das informações
        document.getElementById("info-title").innerText = data.name;
        document.getElementById("info-description").innerText = `Latitude: ${data.lat}, Longitude: ${data.lon}`;
        document.getElementById("info").classList.remove("hidden");

    } catch (error) {
        console.error("Erro ao buscar o local:", error);
        alert("Erro ao buscar dados do local.");
    }
}

// Adiciona evento ao botão de busca
document.getElementById("searchBtn").addEventListener("click", searchLocation);
