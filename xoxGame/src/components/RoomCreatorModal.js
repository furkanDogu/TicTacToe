import React from 'react';
import { View, Text } from 'react-native';
import { Item, Input, Button } from 'native-base';
import { modalStyles } from '../commons/CommonStyles';

const { containerStyle, innerContainerStyle, elementWithMargin, buttonStyle } = modalStyles;

// this modal inner design will be used to count down to start play with phone mode.
class RoomCreatorModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomNumber: null,
            joiningRoomNo: null
        };
    }
    //This method will be called once user presses 'Oda yarat' button. Then it will randomly create 2 digit number.
    createRoomNumber() {
        const firstDigit = parseInt((Math.random() * 8) + 1);
        const secondDigit = parseInt((Math.random() * 8) + 1);
        const roomNumber = "" + firstDigit + secondDigit;
        this.setState({ roomNumber }, () => {
            this.props.setRoomNumber(roomNumber);
        });
    }
    
    //Setting joininRoomNo state of the parent as soon as user presses 'Odaya Katıl' button.
    joinRoom() {
        if (this.state.joiningRoomNo) {
            this.props.setJoiningRoomNo(this.state.joiningRoomNo);
        }
    }
    // responsible for showing the created room number on the secreen.
    renderRoomNumber() {
        if (this.state.roomNumber) {
            return (
                <View style={[elementWithMargin, { alignItems: 'center' }]}>
                    <Text style={{ fontSize: 20 }}>{this.state.roomNumber}</Text>
                    <Text>Diğer oyuncu için bekleniyor..</Text>
                </View>
            );
        } 
        // if room is not created yet, just show the usual components.
        return (
            <Item style={elementWithMargin} rounded>
                        <Input
                        onChangeText={(joiningRoomNo) => this.setState({ joiningRoomNo })}
                        style={{ fontSize: 15, textAlign: 'center' }} 
                        placeholder={'Oda numarası gir'}
                        />
            </Item>
        );
    }
    render() {
        return (
            <View style={containerStyle}>
                <View style={innerContainerStyle}>
                    {this.renderRoomNumber()}
                    <Button block rounded style={[buttonStyle, elementWithMargin]} onPress={() => this.joinRoom()}><Text>Odaya katıl</Text></Button>
                    <Button block rounded style={buttonStyle} onPress={() => this.createRoomNumber()}><Text>Oda yarat</Text></Button>
                </View>
            </View>
        );
    }
}

export default RoomCreatorModal;
