import React, {useContext, useRef, useState} from "react";
import {Dimensions, Keyboard, ScrollView, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {globalStyles} from "../assets/styles/globalStyles";
import Checkbox from "expo-checkbox";
import {db} from "../config/firebase";
import {addDoc, collection, updateDoc} from "firebase/firestore";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import {getStartAndEndTime, uploadImage} from "../utils/GlobalFuncitions";
import CustomDatePicker from "../components/CustomDatePicker";
import ImagePicker from "../components/ImagePicker";
import MyButton from "../components/MyButton";
import Autocomplete from "../components/Autocomplete";
import * as yup from "yup";
import {Formik} from 'formik';
import {colors} from "../assets/styles/colors"; // to manage forms. docs: https://formik.org/docs/api/formik

/**
 * create a page where the user fills a form
 * on submitting, the user returns to previouse screen,
 * and a listener uploads the data to fire base as js object
 * @returns <form>
 */

export default function PostStation(props) {
    const {user} = useContext(AuthenticatedUserContext);
    const googleAddress = useRef();
    const width = Dimensions.get('window').width;

    const formValues = {
        phone: '',
        name: '',
        price: '',
        shadowed: false,
        timeSlots: [getStartAndEndTime()],
        image: null,
        cords: null,
    };

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const formSchema = yup.object({
        phone: yup.string().required().matches(phoneRegExp, 'Phone number is not valid'),
        name: yup.string().min(2).required(),
        price: yup.number().required(),
        cords: yup.object().nullable()
            .test('notNull', 'address is a required field', (value) => value)
    });


    const [image, setImage] = useState(null);
    const [processing, setProcessing] = useState(false);


    async function onPost(values) {
        setProcessing(true);
        const {cords, image, name, phone, price, shadowed, timeSlots} = values;
        const filteredDates = timeSlots
            .filter((slot) => slot.start && slot.end)
            .map(slot => {
                return {start: slot.start, end: slot.end}
            });

        addDoc(collection(db, "postedStation"), {
            owner_id: user.uid,
            address: googleAddress.current.getAddressText(),
            price: price,
            shadowed: shadowed,
            name: name,
            phone: phone,
            date: filteredDates,
            cords: cords,
        })
            .then(async (docRef) => {
                if (image) {
                    const image_url = await uploadImage(image, docRef.id);
                    await updateDoc(docRef, {
                        image: image_url
                    }).then(() => {
                        props.navigation.pop();
                        setProcessing(false);
                    });
                } else {
                    props.navigation.pop();
                    setProcessing(false);
                }
            })
            .catch((e) => {
                setProcessing(false);
                console.error("Error adding document: ", e);
            });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View style={[globalStyles.container, {paddingTop: 60}]}>
                <Text style={globalStyles.title}>Station Details</Text>

                <Formik
                    initialValues={formValues}
                    onSubmit={values => onPost(values)}
                    validationSchema={formSchema}
                >
                    {
                        (formikProps) => {
                            return (
                                <View style={{width: '100%', alignItems: "center"}}>
                                    <Autocomplete reference={googleAddress}
                                                  setCords={(newVal) => formikProps.setFieldValue('cords', newVal)}/>
                                    <Text style={{color: colors.error}}>
                                        {//formikProps.touched.cords &&
                                            formikProps.errors.cords}
                                    </Text>

                                    <ScrollView keyboardShouldPersistTaps={'handled'}>
                                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                            <View style={[globalStyles.container, {width: width, paddingBottom: 170}]}>
                                                {/* Price field*/}
                                                <TextInput
                                                    style={globalStyles.text_input}
                                                    placeholder="Price per hour"
                                                    keyboardType={"number-pad"}
                                                    onChangeText={formikProps.handleChange('price')}
                                                    onBlur={formikProps.handleBlur('price')}
                                                    value={formikProps.values.price}
                                                />
                                                <Text style={{color: colors.error}}>
                                                    {formikProps.touched.price && formikProps.errors.price}
                                                </Text>

                                                {/* Time slots */}
                                                <CustomDatePicker
                                                    timeSlots={formikProps.values.timeSlots}
                                                    setTimeSlots={(newVal) => formikProps.setFieldValue('timeSlots', newVal)}/>

                                                <Text style={globalStyles.subTitle}>Contact Details</Text>

                                                {/* Name field */}
                                                <TextInput
                                                    style={globalStyles.text_input}
                                                    placeholder="Name"
                                                    onChangeText={formikProps.handleChange('name')}
                                                    onBlur={formikProps.handleBlur('name')}
                                                    value={formikProps.values.name}
                                                />
                                                <Text style={{color: colors.error}}>
                                                    {formikProps.touched.name && formikProps.errors.name}
                                                </Text>

                                                {/* Phone field */}
                                                <TextInput
                                                    style={globalStyles.text_input}
                                                    placeholder="Phone number"
                                                    keyboardType={"phone-pad"}
                                                    onChangeText={formikProps.handleChange('phone')}
                                                    onBlur={formikProps.handleBlur('phone')}
                                                    value={formikProps.values.phone}
                                                />
                                                <Text style={{color: colors.error}}>
                                                    {formikProps.touched.phone && formikProps.errors.phone}
                                                </Text>

                                                <ImagePicker image={image} setImage={setImage}/>

                                                {/* shadowed field */}
                                                <View style={globalStyles.flex_container}>
                                                    <Checkbox
                                                        style={globalStyles.checkbox}
                                                        value={formikProps.values.shadowed}
                                                        onValueChange={nextValue => formikProps.setFieldValue('shadowed', nextValue)}
                                                    />
                                                    <Text style={globalStyles.checkbox_label}>Shadowed parking
                                                                                              spot</Text>
                                                </View>

                                                {/* Submit */}
                                                <MyButton
                                                    text={'post'}
                                                    processing={processing}
                                                    onPress={formikProps.handleSubmit}
                                                    disabled={!(formikProps.isValid && formikProps.dirty)}
                                                />

                                            </View>
                                        </TouchableWithoutFeedback>
                                    </ScrollView>
                                </View>
                            );
                        }
                    }
                </Formik>
            </View>
        </TouchableWithoutFeedback>
    );
}
