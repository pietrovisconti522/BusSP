import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const linhasExemplo = [
  "875A-10 - Aeroporto / Perdizes",
  "875P-10 - Metrô Barra Funda / Rio Pequeno",
  "8000-10 - Terminal Lapa / Praça Ramos",
  "702C-10 - Jardim Bonfiglioli / Metrô Belém",
];

export default function Linhas() {
  const [pesquisa, setPesquisa] = useState("");
  const [resultados, setResultados] = useState<string[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    try {
      const dados = await AsyncStorage.getItem("favoritos");

      if (dados !== null) {
        setFavoritos(JSON.parse(dados));
      }
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível carregar os favoritos.");
    }
  }

  async function alternarFavorito(linha: string) {
    try {
      let novosFavoritos;

      if (favoritos.includes(linha)) {
        novosFavoritos = favoritos.filter((item) => item !== linha);
      } else {
        novosFavoritos = [...favoritos, linha];
      }

      await AsyncStorage.setItem("favoritos", JSON.stringify(novosFavoritos));

      setFavoritos(novosFavoritos);
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível salvar o favorito.");
    }
  }

  function buscarLinhas() {
    setMostrarFavoritos(false);

    const filtradas = linhasExemplo.filter((linha) =>
      linha.toLowerCase().includes(pesquisa.trim().toLowerCase()),
    );

    setResultados(pesquisa.trim() ? filtradas : []);
  }

  const lista = mostrarFavoritos ? favoritos : resultados;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Linhas de ônibus</Text>

      <Text style={styles.subtitulo}>
        Pesquise uma linha ou consulte seus favoritos.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o número da linha"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <TouchableOpacity style={styles.botao} onPress={buscarLinhas}>
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

      <FlatList
        data={lista}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.textoLinha}>{item}</Text>

            <TouchableOpacity onPress={() => alternarFavorito(item)}>
              <Text style={styles.favorito}>
                {favoritos.includes(item)
                  ? "★ Remover favorito"
                  : "☆ Adicionar favorito"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.mensagem}>
            {mostrarFavoritos
              ? "Você ainda não tem favoritos."
              : "Nenhuma linha encontrada."}
          </Text>
        }
      />
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
    color: "#555",
    marginBottom: 20,
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
    fontSize: 16,
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
    fontSize: 16,
    marginBottom: 12,
  },
  favorito: {
    color: "#1565C0",
    fontWeight: "bold",
  },
  mensagem: {
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
});
