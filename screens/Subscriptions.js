import React, {useContext, useEffect, useState} from "react";
import {ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {collection, query,where, deleteDoc, doc, getDocs} from "firebase/firestore";
import {db} from "../config/firebase";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import MyStationCard from "../components/MyStationCard";
import {MaterialCommunityIcons} from "@expo/vector-icons";
/**
 * represents all the subscribed stations.
 * (a subscribed station is a station that the user picked from SubscribeStation.js)
 * @returns <ScrollView>
 */
export default function Subscribtions({navigation}) {
  const {user} = useContext(AuthenticatedUserContext);
  const [cards, setCards] = useState([]);
  const onEdit = (id) => {
    // navigation.push('EditMyStation', {id: id}) //check what doing
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
                  await deleteDoc(doc(db, 'Subscribtions', id));
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
  const col = query(collection(db, "Subscribtions"),where('subscriptor_id', '==' , user.uid) );
  const cards_col = await getDocs(col);
  setCards(cards_col.docs
      .map((doc) => {
          let id = doc.id;
          let data = doc.data()
          return {id, ...data};
      }))
};

useEffect(() => {
  navigation.addListener('focus', getCards)
}, []);

  return(  <View>
  <TouchableOpacity style={styles.plus} onPress={() => navigation.push('Subscribtions')}>
      <MaterialCommunityIcons name={'plus'} color={'gray'} size={18}/>
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
              />
          ))
      ) : (
          <ActivityIndicator size={"large"} color="blue"/>
      )}

  </ScrollView>
</View>
    );

}

const styles2 = StyleSheet.create({
  replaceMe: { alignItems: "center" },
});

const styles = StyleSheet.create({
  replaceMe: {alignItems: "center"},
  plus: {
      backgroundColor: 'blue',
      borderRadius: 50,
      height: 50,
      width: 50,
      alignContent: 'center',
      justifyContent: 'center'
  }
});

