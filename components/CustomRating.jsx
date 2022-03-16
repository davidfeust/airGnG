import { Formik } from 'formik';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
// import {Ratings} from './Ratings';
import { colors } from '../assets/styles/colors';
import { globalStyles } from '../assets/styles/globalStyles';
import CustomButton from './CustomButton';
import Ratings from './Ratings';

// 
const CustomRating = ({ onReview, ratingProps }) => {
    const [showComment, setShowComment] = useState(false);
    const [rating, setRating] = useState(0);
    const [switchRating, setSwitchRating] = useState(false);

    const onRating = (rating) => {
        setRating(rating);
        setShowComment(true);
    };
    return (
        <View style={styles.containerStyle}>
            {(switchRating || ratingProps?.isDisabled) ? (
              
              
            //   <Rating
            //         startingValue={ratingProps?.defaultRating}
            //         readonly
            //         imageSize={ratingProps?.size | 0}
            //         showRating={false}
            //     />
            <Ratings ratingProps={{
                defaultRating: ratingProps?.defaultRating,
                 size: ratingProps?.size | 0,
             }}/>

            ) : (
                <AirbnbRating
                    onFinishRating={onRating}
                    {...ratingProps}
                    showRating={false}
                />
            )}

            <Modal
                visible={showComment}
                onRequestClose={() => {
                    setShowComment(!showComment);
                    setRating(ratingProps?.defaultRating);
                }}
                style={{ height: 10 }}
                transparent
                animationType='slide'
            >
                <View style={styles.modalView}>
                    <Formik
                        initialValues={{ comment: '' }}
                        onSubmit={async ({ comment }) => {
                            await onReview(rating, comment);
                            setShowComment(false);
                            setSwitchRating(true);
                        }}
                    >
                        {(formikProps) => (
                            <View
                                style={{
                                    width: '100%',
                                }}
                            >
                                <TextInput
                                    placeholder='your comment...'
                                    style={[globalStyles.text_input]}
                                    onChangeText={formikProps.handleChange(
                                        'comment'
                                    )}
                                    onBlur={formikProps.handleBlur('comment')}
                                    value={formikProps.values.comment}
                                />
                                <CustomButton
                                    text='comment'
                                    onPress={formikProps.handleSubmit}
                                />
                            </View>
                        )}
                    </Formik>
                </View>
            </Modal>
        </View>
    );
};

export default CustomRating;

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        // position: 'absolute',
        // bottom: 20,
    },
});
