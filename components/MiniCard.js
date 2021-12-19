import React, {useRef} from "react";
import {Image, Text, View} from "react-native";

export default function MiniCard({
                                     owner,
                                     address,
                                     price,
                                     image,
                                     id,
                                     style,
                                 }) {
    const card = useRef();

    return (
        <View
            style={style}
            ref={card.current}
        >

            <View>
                <Image
                    source={
                        image
                            ? {uri: image}
                            : require("../assets/defaults/default_image.png")
                    }
                    style={{width: 100, height: 100}}
                />
            </View>
            <View
                style={{
                    flexDirection: "column",
                    marginLeft: 10,
                    flex: 1,
                }}
            >
                <Text style={{flexWrap: "wrap"}}>{address}</Text>
                <Text>{owner}         {price} nis</Text>
                <Text></Text>

            </View>

        </View>
    );
}
