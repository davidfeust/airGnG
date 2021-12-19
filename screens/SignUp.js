import React, {useState} from "react";
import {auth, db} from "../config/firebase";
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View,} from "react-native";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {globalStyles} from "../assets/styles/globalStyles";
import MyButton from "../components/MyButton";
import {Formik} from "formik";
import * as yup from "yup";
import {colors} from "../assets/styles/colors"; // to manage forms. docs: https://formik.org/docs/api/formik
import {doc, setDoc} from "firebase/firestore";

/**
 * create a page where the user fills a form
 * on submitting, the user returns to the login screen,
 * and the data get uploaded to firebase after validation.
 * if the data is valid, a new user should be registered to the app.
 * ask for email, password, stationId, stationLocation ect.
 * @returns <form>
 */

export default function SignUp() {
    const [showPass, setShowPass] = useState(true);
    const [processing, setProcessing] = useState(false);

    const formValues = {
        email: "",
        password: "",
        passwordRepeat: "",
    };

    const formSchema = yup.object({
        email: yup.string().email().required(),
        password: yup.string().required().min(6),
        passwordRepeat: yup
            .string()
            .required("repeat password is a required field")
            .equals([yup.ref("password"), null], "passwords does not match"),
    });

    function handlerSingUp(email, password) {
        //    firebase
        setProcessing(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                setDoc(doc(db, 'users', user.uid), {
                    mail: user.email,
                    orders: []
                }).then(() => {})
                setProcessing(false);
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
                setProcessing(false);
            });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={[globalStyles.title, styles.title]}>Sing Up</Text>

                <Formik
                    initialValues={formValues}
                    validationSchema={formSchema}
                    onSubmit={(values) =>
                        handlerSingUp(values.email, values.password)
                    }
                >
                    {(formikProps) => (
                        <View style={{width: "100%", alignItems: "center"}}>
                            {/* Email field */}
                            <TextInput
                                style={[
                                    globalStyles.text_input,
                                    {marginTop: 20},
                                ]}
                                placeholder="Insert email"
                                autoCompleteType={"email"}
                                keyboardType={"email-address"}
                                onChangeText={formikProps.handleChange("email")}
                                onBlur={formikProps.handleBlur("email")}
                                value={formikProps.values.email}
                            />
                            <Text style={{color: colors.error}}>
                                {formikProps.touched.email &&
                                formikProps.errors.email}
                            </Text>

                            {/* Password 1 field */}
                            <View
                                style={[
                                    globalStyles.text_input,
                                    {
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    },
                                ]}
                            >
                                <View style={{flex: 10}}>
                                    <TextInput
                                        placeholder="Insert password"
                                        secureTextEntry={showPass}
                                        autoCompleteType={"password"}
                                        onChangeText={formikProps.handleChange(
                                            "password"
                                        )}
                                        onBlur={formikProps.handleBlur(
                                            "password"
                                        )}
                                        value={formikProps.values.password}
                                    />
                                </View>
                                <View style={{flex: 1}}>
                                    <TouchableOpacity
                                        onPress={() => setShowPass(!showPass)}
                                    >
                                        <MaterialCommunityIcons
                                            name={showPass ? "eye-off" : "eye"}
                                            color={"gray"}
                                            size={18}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={{color: colors.error}}>
                                {formikProps.touched.password &&
                                formikProps.errors.password}
                            </Text>

                            {/* Password 2 field */}
                            <TextInput
                                style={globalStyles.text_input}
                                placeholder="Repeat password"
                                secureTextEntry={showPass}
                                onChangeText={formikProps.handleChange(
                                    "passwordRepeat"
                                )}
                                onBlur={formikProps.handleBlur(
                                    "passwordRepeat"
                                )}
                                value={formikProps.values.passwordRepeat}
                            />
                            <Text style={{color: colors.error}}>
                                {formikProps.touched.passwordRepeat &&
                                formikProps.errors.passwordRepeat}
                            </Text>

                            <MyButton
                                text={"Sign Up"}
                                style={{marginTop: 60}}
                                processing={processing}
                                onPress={formikProps.handleSubmit}
                                disabled={
                                    !(formikProps.isValid && formikProps.dirty)
                                }
                            />
                        </View>
                    )}
                </Formik>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    title: {
        marginTop: "30%",
        marginBottom: "20%",
    },
});
