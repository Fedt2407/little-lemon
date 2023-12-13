import { View, Text, StyleSheet, Image, SafeAreaView, TextInput, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';

const Onboarding = ({updateOnboardingStatus}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const saveData = async () => {
        try {
            await AsyncStorage.setItem('name', name);
            await AsyncStorage.setItem('email', email);
            updateOnboardingStatus(true);
        } catch (error) {
            console.error('Errore nel salvataggio dei dati:', error);
        }
    };

    const onboardingCompleted = () => {
        if (name === '' || email === '') {
            Alert.alert(
                'Error',
                'Please fill in all fields',
                [
                    { text: 'OK' }
                ],
                { cancelable: false }
            )
        } else {
            saveData();
        }
    };

    useFocusEffect(
        useCallback(() => {
            const getData = async () => {
                try {
                    const savedName = await AsyncStorage.getItem('name');
                    const savedEmail = await AsyncStorage.getItem('email');
                    if (savedName !== null && savedEmail !== null) {
                        setName(savedName);
                        setEmail(savedEmail);
                    } else {
                        setName('');
                        setEmail('');
                    }
                } catch (error) {
                    console.log(error, 'error');
                }
            }
            getData();
        }, [])
    );

    return (
        <View style={styles.continer}>
            <SafeAreaView>
                <View style={styles.header}>
                    <Image
                        source={require('../assets/Logo.png')}
                        style={styles.logo}
                    />
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.onboarding}>Let us get to know you</Text>
                    <Text style={styles.mainText}>First Name</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                    <Text style={styles.mainText}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        description="Next"
                        onPress={onboardingCompleted}
                        width={'40%'}
                        backgroundColor="#dedede"
                        borderColor="#dedede"
                        color="#000000"
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    continer: {
        width: '100%',
        height: '100%',
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%',
    },
    logo: {
        width: '90%',
        height: '80%',
        resizeMode: 'contain',
    },
    formContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dedede',
        paddingVertical: '10%',
    },
    onboarding: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: '10%',
        marginBottom: '20%'
    },
    mainText: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    textInput: {
        fontSize: 24,
        padding: 10,
        width: '80%',
        alignSelf: 'center',
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 16,
        marginVertical: 15,
    },
    buttonContainer: {
        width: '90%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        height: '10%',
        marginTop: '5%',
    },
})

export default Onboarding;