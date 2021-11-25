import React, {useContext, useEffect, useState} from "react";
import {ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {collection, query,where, deleteDoc, doc, getDocs} from "firebase/firestore";
import {db} from "../config/firebase";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import MyStationCard from "../components/MyStationCard";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../assets/styles/colors";

/**
 * represents the page where a user can see the status of his post.
 * for now, its not posible that more than 1 user will subscribe per post,
 * but it might change...
 * @returns <ScrollView>
 */
export default function MyPosts({navigation}) {
    const {user} = useContext(AuthenticatedUserContext);
    const [cards, setCards] = useState([]);

    const onEdit = (id) => {
        navigation.push('EditMyStation', {id: id}) // push to the navigation EditMyStation() component' so we could go back
    }

    const onDelete = (id) => {
        console.log()
        return Alert.alert("Are your sure?",
            "Are you sure you want to remove this beautiful box?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: async () => {
                        console.log('Yes');
                        console.log(id)
                        await deleteDoc(doc(db, 'postedStation', id));
                        setCards(cards.filter((card) => card.id !== id))
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                },
            ]
        )
    }
    const getCards = async () => {
        const col = query(collection(db, "postedStation"),where('owner_id', '==' , user.uid) );
        const cards_col = await getDocs(col);
        setCards(cards_col.docs
            .map((doc) => {
                let id = doc.id;
                let data = doc.data()
                return {id, ...data};
            }))
    };

    useEffect(() => {
        navigation.addListener('focus', getCards) //whene we 'focus' the Subscriptions tab, getCards() is called
    }, []);

    return (
        <View>
            <TouchableOpacity style={styles.plus} onPress={() => navigation.push('PostStation')}>
                <MaterialCommunityIcons style={{textAlign:'center',}} name={'plus'} color={'black'} size={26}/>
            </TouchableOpacity>

            <ScrollView>
                {cards !== [] ? (
                    cards.map(({name, address, price, image, date, id}) => (
                        <MyStationCard
                            owner={name}
                            address={address}
                            price={price}
                            image={image}
                            date={date}
                            id={id}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            key={id}
                        />
                    ))
                ) : (
                    <ActivityIndicator size={"large"} color="blue"/>
                )}

            </ScrollView>
        </View>
    );

}

const styles = StyleSheet.create({
    replaceMe: {alignItems: "center"},
    plus: {
        backgroundColor: colors.primary,
        alignContent: 'center',
        justifyContent: 'center',
        width: 55,
        height: 55,
        borderRadius: 30,
        position: 'absolute',
        bottom: 15,
        right: 15,
        zIndex: 2
    }
});
