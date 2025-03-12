const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Importa Axios para fazer requisições HTTP

const app = express();
const PORT = 3000;

app.use(cors());

// Rota para buscar locais na API do OpenStreetMap (Nominatim)
app.get("/search", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Parâmetro 'query' é obrigatório" });
    }

    try {
        // Faz a requisição à API do OpenStreetMap
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: query,
                format: "json",
                limit: 1
            }
        });

        // Se não encontrar resultados, retorna erro
        if (response.data.length === 0) {
            return res.status(404).json({ error: "Local não encontrado" });
        }

        // Pega o primeiro resultado da busca
        const location = response.data[0];
        res.json({
            name: location.display_name,
            lat: location.lat,
            lon: location.lon
        });

    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar o local" });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
