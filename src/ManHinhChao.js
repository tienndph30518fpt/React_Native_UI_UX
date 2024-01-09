import { StyleSheet, Text, View , Image} from 'react-native'
import React from 'react'

const ManHinhChao = ({ navigation }) => {
    
    const timer = setTimeout(() => {
        navigation.navigate("home");
    }, 3000);
  return (
    <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
      <Image source={require("../assets/fpt.png")}/>
    </View>
  )
}

export default ManHinhChao

const styles = StyleSheet.create({})