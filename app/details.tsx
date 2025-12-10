import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

// 🎨 สีของแต่ละประเภท
const colorByType: Record<string, string> = {
  grass: "#84C484",
  fire: "#C48484",
  water: "#84A4C4",
  bug: "#A4C484",
  normal: "#C4A484",
  electric: "#E8D984",
  ice: "#A4D8E8",
  fighting: "#C46C6C",
  poison: "#A484C4",
  ground: "#D8C484",
  flying: "#A4C4D8",
  psychic: "#D884C4",
  rock: "#C4B484",
  ghost: "#8C84C4",
  dragon: "#8470C4",
  dark: "#84746C",
  steel: "#A4A4B4",
  fairy: "#E8C4E8",
};

export default function Details() {
  const { name } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemonByName(name as string);
  }, [name]);

  async function fetchPokemonByName(name: string) {
    try {
      setLoading(true);

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();

      setPokemon(data);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ⛔ ยังไม่มีข้อมูล → return loading
  if (loading || !pokemon) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 🎨 ใช้ type ตัวที่ 2 ถ้ามี → ไม่งั้นตัวแรก
  const bgType =
    pokemon.types[1]?.type?.name ?? pokemon.types[0].type.name;

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
        paddingBottom: 35
      }}
    >
      {/* TITLE */}
      <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>

      {/* IMAGE CARD */}
      <View
        style={{
          backgroundColor: colorByType[bgType] + "50",
          padding: 20,
          borderRadius: 20,
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: pokemon.sprites.front_default }}
          style={styles.image}
        />
        <Image
          source={{ uri: pokemon.sprites.back_default }}
          style={styles.image}
        />
      </View>

      {/* BASIC INFO */}
      <Text>Height: {pokemon.height}</Text>
      <Text>Weight: {pokemon.weight}</Text>

      {/* TYPES */}
      <Text style={styles.section}>Types:</Text>
      {pokemon.types.map((t: any) => (
        <Text key={t.slot}>• {t.type.name}</Text>
      ))}

      {/* STATS */}
      <Text style={styles.section}>Stats:</Text>
      {pokemon.stats.map((s: any) => (
        <Text key={s.stat.name}>
          {s.stat.name}: {s.base_stat}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  section: {
    fontWeight: "bold",
    marginTop: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
});
