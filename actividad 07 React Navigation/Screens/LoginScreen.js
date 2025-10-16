import { Text, View, ScrollView, StyleSheet, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import { Audio } from 'expo-av';

export default LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}> Welcome </Text>

      <TextInput
        style={styles.inputBox}
        placeholder={'email'}
        value={email}
        onChangeText={setEmail}
        keyboardType={'email-address'}
      />

      <TextInput
        style={styles.inputBox}
        placeholder={'password'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        keyboardType={'default'}
      />

      <Button 
        title = "Login"
        onPress={ () => {
          navigation.navigate("Images")
        }}
      />

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    padding: 40,
    fontSize: 30,
    textAlign: 'center',
  },
  inputBox: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: 'gray',
    backgroundColor: '#EDE FEE',
    borderRadius: 5,
  },
});