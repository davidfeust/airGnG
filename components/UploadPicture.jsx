import React, { useState } from "react";
import { ActivityIndicator, View,StyleSheet } from "react-native";
import {db, storage} from "../config/firebase";
import { uploadImage} from "../utils/GlobalFuncitions";
import {doc, updateDoc} from "firebase/firestore";
import ImagePicker from "./ImagePicker";
import { colors } from "../assets/styles/colors";

const UploadPicture = ({ fullPath, imageStyle=null }) => {
  
  const [prossesing, setProcessing] = useState(false)
  const [currentImage,SetCurrentImage] = useState(null)
    async function onSave(image) {
        setProcessing(true);

       
        if (image !== currentImage) {
            // image changed
            if (!image) {
                const imgRef = ref(
                    storage,
                    fullPath
                );
                // Delete the file
                deleteObject(imgRef)
                    .then(() => {
                        // File deleted successfully
                    })
                    .catch((error) => {
                        // Uh-oh, an error occurred!
                        console.error(error);
                    });
            } else {
                const imageUrl = await uploadImage(
                    image,
                    fullPath
             
                    );
                    SetCurrentImage(imageUrl)
            }
        } else {
            SetCurrentImage(image);
        }

        const postRef = doc(db, fullPath);
        await updateDoc(postRef, {image: currentImage})
            .then(() => {
                setProcessing(false);
            
            })
            .catch(() => setProcessing(false));
    }
    return (
        <View style={imageStyle}>
            <ImagePicker
                image={currentImage}
                setImage={onSave}
                >
                </ImagePicker>
               <View style={styles.spinner}>
                {prossesing&&<ActivityIndicator   color={colors.primary}  size={'large'}/>}

               </View>

        </View>
    );
};

export default UploadPicture;

const styles=StyleSheet.create({
    spinner:{
        position:"absolute",
        alignSelf:"center",
        display:"flex",
        flex:1
    }
})
