import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ description, onPress, width, backgroundColor, borderColor, color }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.button, { width, backgroundColor, borderColor }]}
    >
      <Text style={[styles.text, {color}]}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Button;