import React, { Component } from 'react';
import { Image, View, StyleSheet, Text, Modal, Platform } from 'react-native';
import { Button } from 'native-base';
import { NameModal, CountdownModal } from '../components/Modals';


class HomeScreen extends Component {

  constructor() {
    super();
    this.state = {
      nameModalVisible: false,
      namePlayerOne: '',
      namePlayerTwo: '',
      countdownModalVisible: false
    };
    this.withFriendPressed = this.withFriendPressed.bind(this);
    this.setNames = this.setNames.bind(this);
    this.setModalNameVisb = this.setModalNameVisb.bind(this);
    this.getNames = this.getNames.bind(this);
    this.clearNames = this.clearNames.bind(this);
    this.withPhonePressed = this.withPhonePressed.bind(this);
    this.setCDModelVisb = this.setCDModelVisb.bind(this);
  }

  setNames(text, playerName) {
    this.setState({ [playerName]: text });
  }

  setModalNameVisb(visibility) {
    this.setState({ nameModalVisible: visibility });
    console.log('evet');
  }

  getNames() {
    return { namePlayerOne: this.state.namePlayerOne, namePlayerTwo: this.state.namePlayerTwo }; 
  }
  
  setCDModelVisb(visibility) {
    this.setState({ countdownModalVisible: visibility });
  }

  withFriendPressed() {
    this.setModalNameVisb(true);
  }

  checkNames() {
    return this.state.namePlayerOne !== '' && this.state.namePlayerTwo !== '';
  }

  clearNames() {
    this.setState({ namePlayerOne: '', namePlayerTwo: '' });
  }

  withPhonePressed() {
    this.setCDModelVisb(true);
  }
  
  render() {
    const { containerStyle, LogoTextStyle, imageStyle, buttonStyle } = styles;
    return (
        <View style={containerStyle}>
            <Modal
            animationType="none"
            transparent
            visible={this.state.nameModalVisible}
            onRequestClose={() => {
              this.setModalNameVisb(false);
            }}
            >
              <NameModal
              setNames={this.setNames}
              checkNames={this.checkNames()}
              navigation={this.props.navigation}
              setModalNameVisb={this.setModalNameVisb}
              getNames={this.getNames}
              clearNames={this.clearNames}
              />
            </Modal>
            
            <Modal
            animationType="none"
            transparent
            visible={this.state.countdownModalVisible}
            onRequestClose={() => {
              this.setCDModelVisb(false);
            }}
            >
              <CountdownModal
              setCDModelVisb={this.setCDModelVisb}
              navigation={this.props.navigation} 
              />
            </Modal>

            <Image
            style={imageStyle}
            source={require('../media/images/xoxLogoSmall.png')}
            />

            <Text style={LogoTextStyle}>PLAY / PAUSE</Text>

            <Button
            onPress={this.withFriendPressed}
            style={buttonStyle} block light
            >
              <Text>Arkadaşınla Oyna</Text>
            </Button>

            <Button style={buttonStyle} onPress={this.withPhonePressed} block light><Text>Telefona Karşı Oyna</Text></Button>

            <Button style={buttonStyle} onPress={() => this.props.navigation.navigate('NetworkGame')} block light><Text>Ağ Üzerinden Oyna</Text></Button>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: '#222831'
    },
    // choosing fontFamily based on platform.
    LogoTextStyle: {
      color: '#EEEEEE',
      ...Platform.select({
        ios: {
          fontFamily: 'AmericanTypewriter-Condensed'
        },
        android: {
          fontFamily: 'sans-serif-medium'
        },
      }),
      fontSize: 30,
      marginBottom: 30
    },
    imageStyle: {
      marginTop: 100,
      marginBottom: 10,
    },
    buttonStyle: {
       marginHorizontal: 50,
       marginBottom: 30,
       backgroundColor: '#EEEEEE',
    },
    

});

export default HomeScreen;
