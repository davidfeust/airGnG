import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles } from '../assets/styles/globalStyles';
import { onCall } from '../utils/GlobalFuncitions';
import { colors } from '../assets/styles/colors';
import { Card } from 'react-native-elements';

export default function MyStationCard({
    station,
    onDelete,
    onEdit,
    onGoToPublish,
    onGoToReservation,
}) {
    const { address, price, image, id, phone } = station;
    return (
        <View>
            <Card containerStyle={{ borderRadius: 15 }}>
                <Card.Title>{address}</Card.Title>
                <Card.Divider orientation='horizontal' />
                <Text>price: {price} nis</Text>

                <Card.Image
                    source={
                        image
                            ? { uri: image }
                            : require('../assets/defaults/default_image.png')
                    }
                />

                <View style={globalStyles.flex_container}>
                    {/* EDIT */}
                    {onEdit && (
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={() => onEdit(id)}
                        >
                            <MaterialCommunityIcons
                                name='pencil'
                                size={30}
                                color={colors.primary}
                            />
                            <Text style={styles.explain}>Edit</Text>
                        </TouchableOpacity>
                    )}

                    {/* DELETE */}
                    {onDelete && (
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={() => onDelete(id)}
                        >
                            <MaterialCommunityIcons
                                name='trash-can'
                                size={30}
                                color={colors.primary}
                            />
                            <Text style={styles.explain}>Delete</Text>
                        </TouchableOpacity>
                    )}

                    {/* PHONE // button to call the station owner */}
                    {phone && (
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={() => onCall(phone)}
                        >
                            <MaterialCommunityIcons
                                name='phone'
                                size={30}
                                color={colors.primary}
                            />
                            <Text style={styles.explain}>call the man</Text>
                        </TouchableOpacity>
                    )}

                    {/* PUBLISH */}
                    {onGoToPublish && (
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={onGoToPublish}
                        >
                            <MaterialCommunityIcons
                                name='clock'
                                size={30}
                                color={colors.primary}
                            />
                            <Text style={styles.explain}>Publish</Text>
                        </TouchableOpacity>
                    )}

                    {/* reservation */}
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={onGoToReservation}
                    >
                        <MaterialCommunityIcons
                            name='view-list'
                            size={30}
                            color={colors.primary}
                        />
                        <Text style={styles.explain}>Orders</Text>
                    </TouchableOpacity>
                </View>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        margin: 8,
        marginTop: 18,
        alignItems: 'center',
    },
    explain: {
        marginTop: 3,
        width: 70,
        textAlign: 'center',
    },
});
