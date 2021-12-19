import React, {useContext, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {globalStyles} from "../assets/styles/globalStyles";
import {Formik} from "formik";
import {colors} from "../assets/styles/colors";
import * as yup from "yup";
import MyButton from "../components/MyButton";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "../config/firebase";
import {AuthenticatedUserContext} from "../providers/AuthenticatedUserProvider";
import {MaterialCommunityIcons} from "@expo/vector-icons";

export default function UserDetails({navigation}) {

    const {user, setUser} = useContext(AuthenticatedUserContext);
    const [processing, setProcessing] = useState(false);

    const formValues = {
        name: '',
        phone: '',
    };

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const formSchema = yup.object({
        phone: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
        name: yup.string().min(2),
    });


    const onSave = async ({name, phone}) => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            phone: phone,
            name: name,
        }).then(() => {
            setUser({...user, phone, name})
            setProcessing(false);
            navigation.push('Home');
        }).catch(console.error);
    };

    return (
        <View style={globalStyles.container}>
            <Text style={[globalStyles.title, {marginTop: 80}]}>Let us know you!</Text>
            <Formik
                initialValues={formValues}
                onSubmit={values => onSave(values)}
                validationSchema={formSchema}
            >
                {
                    (formikProps) => (
                        <View style={{width: '100%', alignItems: "center", marginTop: 50}}>
                            {/*Name field*/}
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

                            {/*Phone field*/}
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

                            {/* Submit */}
                            <MyButton
                                text={'Submit'}
                                style={{marginTop: 120}}
                                processing={processing}
                                onPress={formikProps.handleSubmit}
                                disabled={!(formikProps.isValid && formikProps.dirty)}
                            />

                            {/* Skip */}
                            <TouchableOpacity
                                style={[globalStyles.flex_container, {marginTop: 10}]}
                                onPress={() => navigation.push('Home')}
                            >
                                <Text style={{fontSize: 18, color: colors.secondary}}>Skip for now  </Text>
                                <MaterialCommunityIcons name={'arrow-right-circle'} color={colors.secondary} size={24}/>
                            </TouchableOpacity>

                        </View>
                    )
                }
            </Formik>
        </View>
    );
}
