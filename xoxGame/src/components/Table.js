import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';

const Table = (props) => {
    const { containerStyle, rowStyle, squareStyle } = styles;

    const { clickedToSquare, getSquareValue } = props;

    // shows the icon according to value in table. if it's 1 show play icon else show the pause icon.
    const bringIcon = (x, y) => {
        const iconValue = getSquareValue({ x, y });
        switch (iconValue) {
            case 1: return <Icon type="font-awesome" name="play" color={'green'} size={60} />;
            case -1: return <Icon type="font-awesome" name="pause" color={'red'} size={60} />;
            default : return null;
        }
    };
    return (
        <View style={containerStyle}>
            <View style={rowStyle}>
                <TouchableWithoutFeedback onPressIn={() => clickedToSquare({ x: 0, y: 0 })}>
                    <View style={[squareStyle, { borderWidth: 0, borderRightWidth: 3 }]}>{bringIcon(0, 0)}</View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPressIn={() => clickedToSquare({ x: 0, y: 1 })}>
                    <View style={[squareStyle, { borderWidth: 0 }]}>{bringIcon(0, 1)}</View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPressIn={() => clickedToSquare({ x: 0, y: 2 })}>
                    <View style={[squareStyle, { borderWidth: 0, borderLeftWidth: 3 }]}>{bringIcon(0, 2)}</View>
                </TouchableWithoutFeedback>
            </View>
            <View style={rowStyle}>
                <TouchableWithoutFeedback onPressIn={() => clickedToSquare({ x: 1, y: 0 })}>
                    <View style={[squareStyle, { borderLeftWidth: 0, borderBottomWidth: 0 }]}>{bringIcon(1, 0)}</View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPressIn={() => clickedToSquare({ x: 1, y: 1 })}>
                    <View style={[squareStyle, { borderWidth: 0, borderTopWidth: 3 }]}>{bringIcon(1, 1)}</View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPressIn={() => clickedToSquare({ x: 1, y: 2 })}>
                    <View style={[squareStyle, { borderRightWidth: 0, borderBottomWidth: 0 }]}>{bringIcon(1, 2)}</View>
                </TouchableWithoutFeedback>
            </View>
            <View style={rowStyle}>
                <TouchableWithoutFeedback onPressIn={() => clickedToSquare({ x: 2, y: 0 })}>
                    <View style={[squareStyle, { borderLeftWidth: 0, borderBottomWidth: 0 }]}>{bringIcon(2, 0)}</View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPressIn={() => clickedToSquare({ x: 2, y: 1 })}>
                    <View style={[squareStyle, { borderBottomWidth: 0, borderRightWidth: 0, borderLeftWidth: 0 }]}>{bringIcon(2, 1)}</View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPressIn={() => clickedToSquare({ x: 2, y: 2 })}>
                    <View style={[squareStyle, { borderRightWidth: 0, borderBottomWidth: 0 }]}>{bringIcon(2, 2)}</View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    rowStyle: {
        flexDirection: 'row'
    },
    squareStyle: {
        width: 105,
        height: 105,
        borderColor: 'black',
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Table;
