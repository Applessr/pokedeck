import { navigate } from "expo-router/build/global-state/routing";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Pokemon {
  name: string;
  url: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

export const colorByType: Record<string, string> = {
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

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokempn();
  }, []);

  async function fetchPokempn() {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20");
      const data = await res.json();

      const detailedPokemon = await Promise.all(
        data.results.map(async (pokemon: Pokemon) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        })
      );

      setPokemons(detailedPokemon);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
    >
      {pokemons.map((pokemon) => (
        <Pressable
          key={pokemon.name}
          onPress={() => {
            navigate({ pathname: "/details", params: { name: pokemon.name } });
          }}
        >
          <View
            style={{
              // @ts-ignore
              backgroundColor: colorByType[pokemon.types[0].type.name] + 50,
              padding: 20,
              borderRadius: 20,
              alignItems: "center",
            }}
          >
            <Text style={styles.name}>{pokemon.name}</Text>
            <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Image
                source={{ uri: pokemon.image }}
                style={{ width: 150, height: 150 }}
              />
              <Image
                source={{ uri: pokemon.imageBack }}
                style={{ width: 150, height: 150 }}
              />
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
});
