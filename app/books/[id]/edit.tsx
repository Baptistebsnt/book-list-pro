import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function EditBookRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
        <Text>Modifier un ouvrage</Text>
        <Text>Identifiant : {id}</Text>
        <Link
            href={{
                pathname: '/books/[id]',
                params: { id },
            }}
        >
            Annuler et revenir à la fiche
        </Link>
    </View>
  );
}
