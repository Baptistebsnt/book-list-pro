import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function BookDetailsRoute() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View>
            <Text>Fiche détaillée</Text>
            <Text>Identifiant : {id}</Text>
            <Link
                href={{
                pathname: '/books/[id]/edit',
                params: { id },
                }}
            >
                Modifier cet ouvrage
            </Link>

            <Link href="/books">
                Retour à la liste
            </Link>
        </View>
    );
}
