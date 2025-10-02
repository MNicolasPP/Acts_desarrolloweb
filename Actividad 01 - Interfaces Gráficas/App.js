import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';


const Professor = props => {
  const randomNumber = Math.floor(Math.random()*100+50);
  return(
    <View style = {style.profContainer}>
      <Image 
      style = {style.profImage} 
      source = {{uri: `https://picsum.photos/${randomNumber}`, width:100, height:100}}/>
      <Text> Hello, I am {props.name} </Text>
    </View>
  )
}

export default function App() {
  return(
    <ScrollView>
      <Professor name="Ruben" />
      <Professor name="Jorge" />
      <Professor name="Felipe" />
      <Professor name="Ruben" />
      <Professor name="Jorge" />
      <Professor name="Felipe" />
      <Professor name="Ruben" />
      <Professor name="Jorge" />
      <Professor name="Felipe" />
      <Professor name="Ruben" />
      <Professor name="Jorge" />
      <Professor name="Felipe" />
    </ScrollView>
  )
}

const style = StyleSheet.create({
  profContainer: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    alignItems: 'center',
    shadowOffset: {width:0,height:2},
    shadowOpacity: 0.2,
    shadowRadius: 25,
  },
  profImage: {
    width : 50,
    height: 50,
    borderRadius:25,
  }
});