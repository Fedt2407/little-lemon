import { View, Text, StyleSheet, Image, SafeAreaView, TextInput } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';

const Onboarding = () => {
    const navigation = useNavigation();

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
                    />
                    <Text style={styles.mainText}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your email"
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        description="Next"
                        onPress={() => navigation.navigate('Profile')}
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
        paddingVertical: '10%'
    },
    onboarding: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: '10%',
        marginBottom: '40%'
    },
    mainText: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    textInput: {
        fontSize: 30,
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