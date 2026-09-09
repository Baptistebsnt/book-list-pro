import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function EditBookRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Modifier un ouvrage</Text>
      <Text>Identifiant : {id}</Text>
    </View>
  );
}
