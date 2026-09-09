import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NewBookRoute() {
    return (
        <View>
            <Text>Ajouter un ouvrage</Text>
            <Link href="/books">
                Annuler et revenir à la liste
            </Link>
        </View>
  );
}
