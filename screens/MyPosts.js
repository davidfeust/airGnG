import React, {useContext, useEffect, useState} from "react";
import {
    StyleSheet,
    Button,
    Text,
    ScrollView,
    ActivityIndicator,
    View, Alert
} from "react-native";
import StationCard from "../components/StationCard";
import {collection, deleteDoc, doc, getDocs} from "firebase/firestore";
import {db} from "../config/firebase";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import MyStationCard from "../components/MyStationCard";
import data from "bootstrap/js/src/dom/data";

/**
 * represents the page where a user can see the status of his post.
 * for now, its not posible that more than 1 user will subscribe per post,
 * but it might change...
 * @returns <ScrollView>
 */
export default function MyPosts() {
    const {user} = useContext(AuthenticatedUserContext);
    const [cards, setCards] = useState([]);

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
                        setCards(cards.filter((card)=>card.id !== id))
                        update()
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


    useEffect(() => {
        const getCards = async () => {
            const col = collection(db, "postedStation");
            const cards_col = await getDocs(col);
            // cards.forEach((card) => console.log(card.data()));
            setCards(cards_col.docs
                .map((doc) => {
                    let id = doc.id;
                    let data = doc.data()
                    return {id, ...data};
                })
                .filter((doc) => doc.owner_id === user.uid))
        };
        getCards();
    }, []);

    return (
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
                    />
                ))
            ) : (
                <ActivityIndicator size={"large"} color="blue"/>
            )}
            <Button title="press"/>
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    replaceMe: {alignItems: "center"},
});
