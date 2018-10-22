import React from 'react';
import { View, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Button, Item, Input } from 'native-base';
import { Icon } from 'react-native-elements';
import { modalStyles } from '../commons/CommonStyles';

const { containerStyle, innerContainerStyle, buttonStyle, elementWithMargin, textStyle } = modalStyles;

// this modal inner design will be used while getting names in home screen.
export const NameModal = (props) => {
  const checkNames = () => {
    const parameters = { ...props.getNames() };
    parameters.clearNames = props.clearNames;
    // if names are given then pass them to game screen. We also validate the inputs here, if they are null or undefined we don't navigate.
    if (props.checkNames) {
      props.navigation.navigate('GameScreen', parameters);
      props.setModalNameVisb(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={containerStyle}>
        <View style={[innerContainerStyle, { marginTop: 150 }]}>
          <Item style={elementWithMargin} rounded>
            <Input style={{ fontSize: 15, textAlign: 'center' }} onChangeText={(text) => props.setNames(text, 'namePlayerOne')} placeholder="1. Oyuncu Adını Giriniz" />
          </Item>
          <Item style={elementWithMargin} rounded>
            <Input style={{ fontSize: 15, textAlign: 'center' }} onChangeText={(text) => props.setNames(text, 'namePlayerTwo')}placeholder="2. Oyuncu Adını Giriniz" />
          </Item>
          <Button block rounded style={[buttonStyle, elementWithMargin]} onPress={() => checkNames()}><Text>Başla</Text></Button>
          <Button block rounded style={buttonStyle} onPress={() => props.setModalNameVisb(false)}><Text>İptal</Text></Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// this modal inner design will be used to announce the result of games.
export class ResultModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        iconName: null,
        iconColor: null,
        askedOne: null,
      };
      this.iconName = null;
      this.iconColor = null;
    }
    bringWinnerIcon() {
    // if winner.no === 3 means that there is no winner, show the equal symbol. We only use no=3 while 'playing with phone' option.
    if (this.props.winner.no === 3) {
      this.iconName = 'ban';
      this.iconColor = 'yellow';
    } else {
      this.iconName = this.props.winner.no === 1 ? 'play' : 'pause';
      this.iconColor = this.props.winner.no === 1 ? 'green' : 'red';
    }
    return <Icon type="font-awesome" size={60} name={this.iconName} color={this.iconColor} />;
  }
    restartClicked() {
      // this control checks if the game is network game or not. Because we pass askedOne parameter in network game. 
      if (this.props.askedOne !== undefined) {
         // we are emiting a request to the server with that function.
        if (this.props.askedOne) {
            //  if opponent of current player clicked restart, current player will see 'rakip yeniden oynaya bastı' opponent will se 'rakip bekleniyor'
            this.props.handshakeDone();
          } else {
            this.props.restartGame();
        }
      } else {
        this.props.clearTable();
        this.props.changeModalVisibility(false);
      } 
  }
  renderPlayerWaiting() { 
    if (this.props.askedOne !== undefined) { // if this game is multiplayer then we must show some message when a player clicked play again.
      if (this.props.askedOne) { // if current user is asked one for a new game then 
        return (
          <Text>Rakip yeniden oynaya bastı !</Text>
        );
      }
      if (this.props.askedOne !== null) { // if askedOne is not true then there are 2 options left it's null or false
        return (
          <Text>Rakip bekleniyor..</Text>
        );
      }
    }
  }
    render() {
      return (
        <View style={containerStyle}>
          <View style={innerContainerStyle}>
            {this.bringWinnerIcon()}
            {this.renderPlayerWaiting()}
            <Text style={[elementWithMargin, textStyle]}>{this.state.iconColor === "yellow" ? '' : 'Kazanan'}</Text>
            <Text style={[elementWithMargin, textStyle]}>{this.props.winner.name}</Text>
            <Button block rounded style={[buttonStyle, elementWithMargin]} onPress={() => this.restartClicked()}><Text>Yeniden oyna</Text></Button>
            <Button block rounded style={buttonStyle} onPress={() => this.props.navigation.goBack()}><Text>Menüye dön</Text></Button>
          </View>
        </View>
      );
  }
} 


export class CountdownModal extends React.Component {
  
    constructor() {
      super();
      this.state = { count: 3 };
    }
    
    componentDidMount() {
      // create an interval once the component is mounted.
      // interval will call the increase method in every 1 sec.
      this.interval = setInterval(() => this.increaseCounter(), 1000);
    }
    
    componentDidUpdate() {
      // once count gets value of 0, we will make the modal invisible and show the game area.
      if (this.state.count === 0) {
        this.props.setCDModelVisb(false);
        this.props.navigation.navigate('AloneGame');
      }
    }
    componentWillUnmount() {
      // clearing the interval while component is going away.
      clearInterval(this.interval);
    }
    increaseCounter() {
      this.setState({ count: this.state.count - 1 });
    }
    countingNumber = () => {
      return (
        <Text>{this.state.count}</Text>
      );
    };
  render() {
    return (
      <View style={containerStyle}>
        <View style={[innerContainerStyle, { marginTop: 150 }]}>
          <Text style={[elementWithMargin, textStyle]}>Geri sayım başlasın</Text>
          {this.countingNumber()}
        </View>
      </View>
    );
  }
}

