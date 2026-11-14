require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const API = "https://api.olhovivo.sptrans.com.br/v2.1";

app.get("/linhas", async (req, res) => {
  try {
    const pesquisa = String(req.query.busca || "").trim();

    if (!pesquisa) {
      return res.status(400).json({
        erro: "Digite uma linha para pesquisar.",
      });
    }

    const token = process.env.SPTRANS_TOKEN;

    if (!token) {
      return res.status(500).json({
        erro: "Token não configurado.",
      });
    }

    // Autenticação na SPTrans
    const login = await fetch(
      `${API}/Login/Autenticar?token=${encodeURIComponent(token)}`,
      { method: "POST" },
    );

    const respostaLogin = await login.text();

    console.log("Status da SPTrans:", login.status);
    console.log("Autenticação:", respostaLogin);

    if (!login.ok || respostaLogin.trim().toLowerCase() !== "true") {
      return res.status(502).json({
        erro: "Falha na autenticação da SPTrans.",
      });
    }

    // Recupera o cookie da sessão autenticada
    const cookies = login.headers.getSetCookie();
    const sessao = cookies.map((cookie) => cookie.split(";")[0]).join("; ");

    // Pesquisa linhas reais
    const resposta = await fetch(
      `${API}/Linha/Buscar?termosBusca=${encodeURIComponent(pesquisa)}`,
      {
        headers: {
          Cookie: sessao,
        },
      },
    );

    if (!resposta.ok) {
      throw new Error("Falha na consulta de linhas.");
    }

    const linhas = await resposta.json();

    res.json(linhas);
  } catch (erro) {
    console.error("Erro na consulta:", erro.message);

    res.status(500).json({
      erro: "Não foi possível consultar a SPTrans.",
    });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor BusSP iniciado na porta 3000");
});
