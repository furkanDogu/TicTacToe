import React from 'react';
import { StyleSheet, View } from 'react-native';
import Router from './src/Router';


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Router />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
