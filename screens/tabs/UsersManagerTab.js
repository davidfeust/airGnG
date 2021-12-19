import React, {useEffect, useState} from 'react';
import {Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getFromCol} from "../../utils/GlobalFuncitions";
import {collection, doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../config/firebase";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../../assets/styles/colors";


export default function UsersManagerTab() {
    function onBlock(uid) {
        return Alert.alert(
            "Are your sure?",
            "By pressing yes you confirm to block this user",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: async () => {

                        const userRef = doc(db, "users", uid);
                        await updateDoc(userRef, {
                            blocked: true
                        })

                            .then(() => {
                                console.log('Successfully blocked user');
                            })
                            .catch((error) => {
                                console.log('Error blocking user:', error);
                            });
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                },
            ]
        );
    }

    function onUnBlock(uid) {
        return Alert.alert(
            "Are your sure?",
            "By pressing yes you confirm to Unblock this user",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: async () => {

                        const userRef = doc(db, "users", uid);
                        await updateDoc(userRef, {
                            blocked: false
                        })

                            .then(() => {
                                console.log('Successfully unblocked user');
                            })
                            .catch((error) => {
                                console.log('Error unblocking user:', error);
                            });
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                },
            ]
        );
    }


    const [usersList, setUsersList] = useState(null);

    useEffect(() => {
        // listener of firebase DB, call getFromCol() in case the data has changed
        const unsubUsers = onSnapshot(
            collection(db, "users"),
            () => {
                getFromCol("users", setUsersList);
            }
        );
    }, []);

    const renderRow = ({item: {id, mail, name, blocked = false}}) => {
        return (
            <View style={styles.row}>
                <View>
                    <Text>{mail}</Text>
                    <Text>{name}</Text>
                </View>

                {/* block user icon */}
                <TouchableOpacity
                    style={styles.icon}
                    onPress={() => {
                        if (blocked) {
                            onUnBlock(id)
                        } else {
                            onBlock(id)
                        }
                    }

                    }
                >
                    <MaterialCommunityIcons
                        name={ blocked ? 'check-bold' : "block-helper"}
                        size={22}
                        color={colors.primary}
                    />
                </TouchableOpacity>


            </View>

        );
    };
    return (
        <SafeAreaView style={{marginTop: 50}}>
            {usersList &&
            <FlatList data={usersList} renderItem={renderRow}/>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 6,
        borderWidth: 1,
        padding: 10,
        paddingVertical: 15,
        marginHorizontal: 15,
        marginVertical: 5
    },
    icon: {
        marginHorizontal: 7
    }
});