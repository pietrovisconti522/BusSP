import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>BusSP</Text>

      <Text style={styles.subtitulo}>
        Seu aplicativo de ônibus de São Paulo
      </Text>

      <Text style={styles.descricao}>
        Consulte linhas de ônibus e acompanhe informações do transporte público.
      </Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push("/explore")}
      >
        <Text style={styles.textoBotao}>Pesquisar linhas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  titulo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#1565C0",
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  descricao: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },

  botao: {
    backgroundColor: "#1565C0",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },

  textoBotao: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
