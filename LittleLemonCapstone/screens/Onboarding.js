import { View, Text, StyleSheet, Image, SafeAreaView, TextInput, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';

const Onboarding = ({ updateOnboardingStatus }) => {
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
                <View style={styles.homeArea}>
                    <Text style={styles.mainTitle}>Little Lemon</Text>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={styles.subtityle}>Chicago</Text>
                            <Text style={styles.homeText}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                        </View>
                        <Image
                            source={require('../assets/Home.png')}
                            style={styles.homeImage}
                        />
                    </View>
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.mainText}>Name *</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                    <Text style={styles.mainText}>Email *</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
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
    homeArea: {
        height: 300,
        width: '100%',
        backgroundColor: '#495E57',
        marginTop: 10,
        padding: 15,
    },
    mainTitle: {
        color: '#F4CE14',
        fontSize: 50,
        fontWeight: 'bold',
    },
    subtityle: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    homeText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 400,
    },
    homeImage: {
        width: 140,
        height: 160,
        marginTop: 30,
        marginLeft: 'auto',
        borderRadius: 16,
    },
    formContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 30,
    },
    onboarding: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: '10%',
        marginBottom: '20%'
    },
    mainText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#545454',
    },
    textInput: {
        fontSize: 24,
        padding: 10,
        width: '100%',
        alignSelf: 'center',
        borderColor: '#495E57',
        borderWidth: 1,
        borderRadius: 16,
        marginVertical: 15,
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        height: '10%',
        marginTop: '10%',
    },
})

export default Onboarding;