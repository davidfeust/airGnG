import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {pickImageCamera, pickImageLibrary} from "../utils/GlobalFuncitions";


export default function ImagePicker({image, setImage}) {

    return (
        <View>
            {image ?
                <View>
                    <Image source={{uri: image}} style={styles.container}/>
                    <TouchableOpacity style={styles.del} onPress={() => setImage(null)}>
                        <MaterialCommunityIcons name={'delete'} size={30} color={'black'}/>
                    </TouchableOpacity>
                </View>
                :
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => pickImageLibrary(setImage)}>
                        <MaterialCommunityIcons name={'image-plus'} size={50} color={'black'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImageCamera(setImage)}>
                        <MaterialCommunityIcons name={'camera-plus'} size={50} color={'black'}/>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#d0caca',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 60,
        alignItems: 'center',
        width: 280,
        height: 210,
        marginVertical: 10,
    },
    del: {
        position: 'absolute',
        bottom: 10,
        right: 0,
        margin: 3,
    }
});
