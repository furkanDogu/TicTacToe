import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerContainerStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      padding: 40,
      height: 300,
      width: 300,
      backgroundColor: 'white',
      marginBottom: 75
    },
    elementWithMargin: {
        marginBottom: 15
    },
    buttonStyle: {
      backgroundColor: '#00ADB5'
    },
    textStyle: {
      fontSize: 20
    },
  });

 export const barStyles = StyleSheet.create({
    elementStyle: {
      paddingTop: 20,
      alignItems: 'center',
      justifyContent: 'center'
    },
    containerStyle: {
          alignItems: 'center',
          justifyContent: 'center',
      },
      barStyle: {
          width: 315,
          height: 30,
          position: 'absolute',
          flexDirection: 'row'
      },
      innerBar: {
          position: 'absolute',
          backgroundColor: 'red',
          width: 157.5,
          left: 0,
          top: 0,
      },
      line: {
          flex: 0.5,
          borderLeftWidth: 0,
          borderRightWidth: 1,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderColor: 'black',
          backgroundColor: 'transparent'
      },
  });
