import { useState } from "react";
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

import MapView, { Marker } from "react-native-maps";

type Onibus = {
  id: number;
  prefixo: string;
  linha: string;
  latitude: number;
  longitude: number;
};

// IMPORTANTE: mantenha o IP que já funcionou no seu projeto
const SERVIDOR = "http://192.168.1.6:3000";

export default function Posicoes() {
  const [linha, setLinha] = useState("");
  const [onibus, setOnibus] = useState<Onibus[]>([]);
  const [carregando, setCarregando] = useState(false);

  async function consultar() {
    if (!linha.trim()) {
      Alert.alert("Atenção", "Digite uma linha.");
      return;
    }

    setCarregando(true);
    setOnibus([]);

    try {
      const resposta = await fetch(
        `${SERVIDOR}/posicoes-demo?linha=${encodeURIComponent(linha.trim())}`,
      );

      if (!resposta.ok) {
        throw new Error("Erro na consulta");
      }

      const dados = await resposta.json();
      setOnibus(dados);
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Localização dos ônibus</Text>

      <Text style={styles.aviso}>Dados simulados para demonstração.</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a linha. Ex: 8000"
        value={linha}
        onChangeText={setLinha}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={consultar}
        disabled={carregando}
      >
        <Text style={styles.textoBotao}>
          {carregando ? "Consultando..." : "Consultar ônibus"}
        </Text>
      </TouchableOpacity>

      {carregando ? (
        <ActivityIndicator size="large" color="#1565C0" />
      ) : (
        <>
          <MapView
            style={styles.mapa}
            initialRegion={{
              latitude: -23.5505,
              longitude: -46.6333,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }}
          >
            {onibus.map((item) => (
              <Marker
                key={item.id}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={`Ônibus ${item.prefixo}`}
                description={`Linha ${item.linha}`}
              />
            ))}
          </MapView>

          <FlatList
            data={onibus}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.nome}>Ônibus {item.prefixo}</Text>
                <Text>Linha: {item.linha}</Text>
                <Text>Latitude: {item.latitude}</Text>
                <Text>Longitude: {item.longitude}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: 10,
  },
  aviso: {
    color: "#666",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: "#1565C0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  textoBotao: {
    color: "#FFF",
    fontWeight: "bold",
  },
  mapa: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  nome: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: 5,
  },
});
