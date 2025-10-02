
import {StyleSheet, Text, View, Image, SectionList} from 'react-native';

const Cell = props => {
const randomNumber = Math.floor(Math.random()*100 + 50);
return(
<View style={styles.profContainer}>
<Image
style = {styles.profImage}
source={{uri:`https://picsum.photos/${randomNumber}`, width: 100, height: 100}}/>
<Text> Hello, I am {props.name}</Text>
</View>
);
};

/*
const Header = (props) => {
  return(
    <text style= {styles.Header}> {props.name} </text>
  )
}
*/

const DATA = [
  {
    title: "Profesores",
    data: [
      {id:1,name:"Mario"},
      {id:2,name:"Juan"},
      {id:3,name:"Manuel"},
      {id:4,name:"Jesus"},
      {id:5,name:"Alberto"},
      ]
  },
  {
    title: "Alumnos",
    data: [
      {id:6,name:"Ruben"},
      {id:7,name:"Ernesto"},
      {id:8,name:"Nick"},
      {id:9,name:"Jorge"},
      {id:10,name:"Antonio"},
      ]
  },
]


export default App = () => {
return (
<SectionList 
  sections = {DATA}
  renderItem = {({item}) => <Cell name={item.name}/>}
  renderSectionHeader = {({section: {title}}) => (
          <Text style={styles.Header}>{title}</Text>
        )}
  keyExtractor = {item => item.id}

/>

);
};

const styles = StyleSheet.create({
profContainer:{
flexDirection: 'row',
padding: 10,
margin: 10,
alignItems: 'center',
shadowColor: '#000000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.2,
shadowRadius: 2,
},
profImage:{
width: 50,
height: 50,
borderRadius: 25,
marginRight: 10,
},
Header:{
  fontSize: 24,
  fontWeight: 'bold',
  padding: 10,
},
});