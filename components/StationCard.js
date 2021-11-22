import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";
import { Card } from "react-native-elements";
import { CheckBox } from "react-native-elements/dist/checkbox/CheckBox";
/**
 * this component contains all the station data
 * (owner, date, location, price, available? ect.)
 * @returns <div>
 */
export default function StationCard({owner, address, date, price, image}) {
  const [isAvailable, setIsAvailable] = useState(true)
  const OnOrder = (e)=>{
    setIsAvailable(!isAvailable)
    const to_push = {
      owner:owner,
      address:address,
      date:date,
      price:price,
      image:image
    }
    console.log(to_push)
  }

  return (
    <Card style={styles.replaceMe}>
      <Card.Title>{owner}</Card.Title>
      <Card.Divider orientation='horizontal'/>
      <Text>{date}</Text>
      <Text>{address}</Text>
      <Text>price: {price} nis</Text>
      {/* <Card.Image source={{uri:{image}}}></Card.Image> */}
      <CheckBox className='check' title="available" checked={isAvailable}>
        available
      </CheckBox>
      <Button title="order" onPress={OnOrder}></Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  replaceMe: {
    alignItems: "center",
    textAlign: "center",
    display:'flex'
  },
  centerText:{
    textAlign: "center",
  }
});
