import React, { useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { db, storage } from '../config/firebase';
import { uploadImage } from '../utils/GlobalFuncitions';
import { doc, updateDoc } from 'firebase/firestore';
import ImagePicker from './ImagePicker';
import { colors } from '../assets/styles/colors';
import { deleteObject, ref } from 'firebase/storage';

/**
 * @author RavidSaadia, achiyazigi
 * @param {Object} props
 * @param {string} props.fullPath full firebase storage path to store or delete the image
 * @param {function} props.onFinish onFinish will be called on:
 *      1. succesful upload (then image will be the correct url)
 *      2. deletion (then image will be null)
 * onFinish will not be called in case of an error
 * @param {(object|null)} [props.imageStyle=null] will be passed to the enclosing image View
 * @param {(string|null)} [props.defaultImage=null] first to be displayed
 */
const UploadPicture = ({
    fullPath,
    onFinish,
    imageStyle = null,
    defaultImage = null,
}) => {
    const [prossesing, setProcessing] = useState(false);
    const [currentImage, SetCurrentImage] = useState(defaultImage);
    async function onSave(image) {
        setProcessing(true);

        if (image !== currentImage) {
            // image changed
            if (!image) {
                console.log('deleting');
                const imgRef = ref(storage, fullPath);
                // Delete the file
                await deleteObject(imgRef)
                    .then(() => {
                        onFinish(null);
                        SetCurrentImage(null);
                    })
                    .catch((error) => {
                        // Uh-oh, an error occurred!
                        // console.log("ERR");
                        console.error(error);
                    });
            } else {
                await uploadImage(image, fullPath).then(
                    (url) => {
                    //    console.log("blabla");
                    SetCurrentImage(url);
                    onFinish && onFinish(url);
                }
                )
                ;
            }
        } else {
            // console.log("ELSE");
            SetCurrentImage(image);
            onFinish(image);
        }
        setProcessing(false);

        // const postRef = doc(db, fullPath);
        // updateDoc(postRef, { image: currentImage })
        //     .then(() => {
        //         onUploadFinish && onUploadFinish(currentImage);
        //         setProcessing(false);
        //     })
        //     .catch(() => setProcessing(false));
    }
    return (
        <View style={imageStyle}>
            <ImagePicker image={currentImage} setImage={onSave}></ImagePicker>
            <View style={styles.spinner}>
                {prossesing && (
                    <ActivityIndicator color={colors.primary} size={'large'} />
                )}
            </View>
        </View>
    );
};

export default UploadPicture;

const styles = StyleSheet.create({
    spinner: {
        position: 'absolute',
        alignSelf: 'center',
        display: 'flex',
        flex: 1,
    },
});
