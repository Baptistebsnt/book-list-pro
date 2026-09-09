import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function BooksListRoute(){
    return (
    <View>
        <Text>  Liste des ouvrages </Text>
        <Link href="/books/1"> 
            Voir un ouvrage 
        </Link>
        <Link href="/books/new">
            Ajouter un ouvrage
        </Link>
    </View>
  );
}
