import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getFromCol} from "../../utils/GlobalFuncitions";
import {collection, doc, onSnapshot, updateDoc} from "firebase/firestore";
import {db} from "../../config/firebase";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../../assets/styles/colors";
import {SearchBar} from "react-native-elements";


export default function UsersManagerTab() {

    const [usersList, setUsersList] = useState([]);
    const [arrayHolder, setArrayHolder] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // listener of firebase DB, call getFromCol() in case the data has changed
        const unsubUsers = onSnapshot(
            collection(db, "users"),
            () => {
                getFromCol("users", setUsersList)
                    .then((res) => {
                        const filter = res.filter((item) => item['admin'] === undefined);
                        setUsersList(filter);
                        setArrayHolder(filter);
                        setIsLoading(false);
                    });
            }
        );
    }, []);

    const blockChanged = (uid, toBlock) => {
        return Alert.alert(
            "Are your sure?",
            'By pressing yes you confirm to' + (!toBlock ? 'un' : '') + ' block this user',
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: async () => {
                        const userRef = doc(db, "users", uid);
                        await updateDoc(userRef, {
                            blocked: toBlock
                        })
                            .then(() => {
                            })
                            .catch((error) => {
                                console.log('Error blocking / un-blocking user:', error);
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

    const searchFilterFunction = (text) => {
        //passing the inserted text in textinput
        const newData = arrayHolder.filter(function (item) {
            //applying filter for the inserted text in search bar
            const mailText = item.mail ? item.mail.toUpperCase() : ''.toUpperCase();
            const nameText = item.name ? item.name.toUpperCase() : ''.toUpperCase();
            const itemData = mailText + nameText;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        setUsersList(newData);
        setSearch(text);
    }


    const renderRow = ({item: {id, mail, name, blocked = false}}) => {
        return (
            <View style={styles.row}>
                <View style={{flexDirection: 'row'}}>
                    <MaterialCommunityIcons name={'account'} size={30} style={styles.icon}/>
                    <View>
                        <Text>{name}</Text>
                        <Text style={{fontWeight: 'bold', fontSize: 16}}>{mail}</Text>
                    </View>
                </View>
                {/* block user icon */}
                <TouchableOpacity
                    style={styles.icon}
                    onPress={() => {
                        if (blocked) {
                            blockChanged(id, false);
                        } else {
                            blockChanged(id, true);
                        }
                    }}
                >
                    <MaterialCommunityIcons
                        name={blocked ? 'check-bold' : "block-helper"}
                        size={22}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            </View>

        );
    };


    if (isLoading) {
        // Loading View while data is loading
        return (
            <View style={{flex: 1, paddingTop: 20}}>
                <ActivityIndicator/>
            </View>
        );
    }
    return (
        <SafeAreaView style={{marginTop: 10, marginBottom: 65}}>
            <SearchBar
                round
                searchIcon={{size: 24}}
                onChangeText={text => searchFilterFunction(text)}
                onClear={() => searchFilterFunction('')}
                placeholder="Search User Here..."
                value={search}
                inputContainerStyle={{backgroundColor: 'white', borderWidth: 1}}

            />
            {usersList &&
            <FlatList data={usersList}
                      renderItem={renderRow}
                      enableEmptySections={true}
            />}
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
        marginHorizontal: 7,
        justifyContent: 'center',
        alignSelf: 'center',
    }
});
