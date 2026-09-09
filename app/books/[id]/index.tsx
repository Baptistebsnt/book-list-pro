import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function BookDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Fiche détaillée</Text>
      <Text>Identifiant : {id}</Text>
    </View>
  );
}
