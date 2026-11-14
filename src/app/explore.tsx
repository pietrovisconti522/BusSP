import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Substitua pelo IPv4 do seu computador
const SERVIDOR = "192.168.1.6";

type Linha = {
  codigo: string;
  nome: string;
};

const linhasExemplo: Linha[] = [
  { codigo: "875A-10", nome: "Linha de exemplo 875A" },
  { codigo: "875P-10", nome: "Linha de exemplo 875P" },
  { codigo: "8000-10", nome: "Linha de exemplo 8000" },
  { codigo: "702C-10", nome: "Linha de exemplo 702C" },
];

export default function Linhas() {
  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState<Linha[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [modo, setModo] = useState<"demo" | "api">("demo");
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    try {
      const dados = await AsyncStorage.getItem("favoritos");

      if (dados) {
        const lista = JSON.parse(dados);

        if (Array.isArray(lista)) {
          setFavoritos(
            lista.filter((item): item is string => typeof item === "string"),
          );
        }
      }
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os favoritos.");
    }
  }

  async function alternarFavorito(codigo: string) {
    const novos = favoritos.includes(codigo)
      ? favoritos.filter((item) => item !== codigo)
      : [...favoritos, codigo];

    try {
      await AsyncStorage.setItem("favoritos", JSON.stringify(novos));

      setFavoritos(novos);
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o favorito.");
    }
  }

  async function buscarLinhas() {
    const termo = pesquisa.trim();

    setMostrarFavoritos(false);

    if (!termo) {
      Alert.alert("Atenção", "Digite uma linha para pesquisar.");
      return;
    }

    if (modo === "demo") {
      const filtradas = linhasExemplo.filter((linha) =>
        `${linha.codigo} ${linha.nome}`
          .toLowerCase()
          .includes(termo.toLowerCase()),
      );

      setResultados(filtradas);
      return;
    }

    setCarregando(true);
    setResultados([]);

    try {
      const resposta = await fetch(
        `${SERVIDOR}/linhas?busca=${encodeURIComponent(termo)}`,
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro na API.");
      }

      if (!Array.isArray(dados)) {
        throw new Error("Resposta inválida da API.");
      }

      const linhas: Linha[] = dados.map((item) => ({
        codigo: `${item.lt}-${item.tl}`,
        nome: `${item.tp} / ${item.ts}`,
      }));

      setResultados(linhas);
    } catch (erro) {
      const mensagem =
        erro instanceof Error
          ? erro.message
          : "Não foi possível consultar a API.";

      Alert.alert("Erro na consulta", mensagem);
    } finally {
      setCarregando(false);
    }
  }

  const lista = mostrarFavoritos
    ? favoritos.map(
        (codigo) =>
          resultados.find((linha) => linha.codigo === codigo) || {
            codigo,
            nome: "Linha salva",
          },
      )
    : resultados;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Linhas de ônibus</Text>

      <Text style={styles.subtitulo}>Escolha o modo de pesquisa.</Text>

      <View style={styles.modos}>
        <TouchableOpacity
          style={[styles.botaoModo, modo === "demo" && styles.ativo]}
          onPress={() => {
            setModo("demo");
            setResultados([]);
            setMostrarFavoritos(false);
          }}
        >
          <Text style={styles.textoModo}>Demonstração</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoModo, modo === "api" && styles.ativo]}
          onPress={() => {
            setModo("api");
            setResultados([]);
            setMostrarFavoritos(false);
          }}
        >
          <Text style={styles.textoModo}>API SPTrans</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.aviso}>
        {modo === "demo"
          ? "Usando dados de exemplo."
          : "Consultando dados reais da SPTrans."}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o número da linha"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={buscarLinhas}
        disabled={carregando}
      >
        <Text style={styles.textoBotao}>Pesquisar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoFavoritos}
        onPress={() => setMostrarFavoritos(true)}
      >
        <Text style={styles.textoBotao}>
          Ver favoritos ({favoritos.length})
        </Text>
      </TouchableOpacity>

      <Text style={styles.secao}>
        {mostrarFavoritos ? "Meus favoritos" : "Resultados"}
      </Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#1565C0" />
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => item.codigo}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.textoLinha}>{item.codigo}</Text>

              <Text style={styles.descricao}>{item.nome}</Text>

              <TouchableOpacity onPress={() => alternarFavorito(item.codigo)}>
                <Text style={styles.favorito}>
                  {favoritos.includes(item.codigo)
                    ? "★ Remover favorito"
                    : "☆ Adicionar favorito"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.mensagem}>
              {mostrarFavoritos
                ? "Nenhum favorito salvo."
                : "Nenhuma linha encontrada."}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: 10,
  },
  subtitulo: {
    fontSize: 16,
    marginBottom: 15,
  },
  modos: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  botaoModo: {
    flex: 1,
    backgroundColor: "#78909C",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  ativo: {
    backgroundColor: "#1565C0",
  },
  textoModo: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  aviso: {
    color: "#555",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: "#1565C0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  botaoFavoritos: {
    backgroundColor: "#455A64",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
  },
  secao: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  textoLinha: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  descricao: {
    color: "#555",
    marginBottom: 15,
  },
  favorito: {
    color: "#1565C0",
    fontWeight: "bold",
  },
  mensagem: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
});
