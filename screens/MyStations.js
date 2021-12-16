import React, {useContext, useEffect, useState} from "react";
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
import {deleteDoc, doc} from "firebase/firestore";
import {db} from "../config/firebase";
import MyStationCard from "../components/MyStationCard";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../assets/styles/colors";
import {publicStationsContext} from "../navigation/PublicStationsProvider";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import {deleteObject, getStorage, ref} from "@firebase/storage";
import {globalStyles} from "../assets/styles/globalStyles";
import MyButton from "../components/MyButton";

/**
 * represents the page where a user can see the status of his post.
 * for now, its not posible that more than 1 user will subscribe per post,
 * but it might change...
 * @returns <ScrollView>
 */
export default function MyStations({navigation}) {
    const {user} = useContext(AuthenticatedUserContext);
    const {stations} = useContext(publicStationsContext);
    const [myStations, setMyStations] = useState([])

    useEffect(() => {
        setMyStations(stations.filter(({owner_id}) => owner_id === user.uid));
    }, [stations])

    const onEdit = (id) => {
        navigation.push("EditMyStation", {station_id: id}); // push to the navigation EditMyStation() component' so we could go back
    };

    const onDelete = (id) => {
        return Alert.alert(
            "Are your sure?",
            "By pressing yes you confirm to remove this station permanently",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: async () => {
                        await deleteDoc(doc(db, "stations", id));

                        const storgae = getStorage();
                        deleteObject(ref(storgae, id + ".jpg")).catch(() => {
                        })
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                },
            ]
        );
    };

    if (myStations.length !== 0) {
        return (
            <View>
                <TouchableOpacity
                    style={styles.plus}
                    onPress={() => navigation.push("AddNewStation")}
                >
                    <MaterialCommunityIcons
                        style={{textAlign: "center"}}
                        name={"plus"}
                        color={"black"}
                        size={26}
                    />
                </TouchableOpacity>

                <ScrollView>
                    {
                        myStations.map(({name, address, price, image, date, id}) => (
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
                                onGoToPublish={() => navigation.push("PublishStation", {station_id: id})}
                            />
                        ))
                    }
                </ScrollView>
            </View>
        );
    } else {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Text style={globalStyles.subTitle}>No Stations yet...</Text>
                <MyButton text={'Add Station'} onPress={() => navigation.navigate('AddNewStation')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    plus: {
        backgroundColor: colors.primary,
        alignContent: "center",
        justifyContent: "center",
        width: 55,
        height: 55,
        borderRadius: 30,
        position: "absolute",
        bottom: 15,
        right: 15,
        zIndex: 2,
    },
});