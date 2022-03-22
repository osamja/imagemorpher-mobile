import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export function Title(){
    return (
        <View>
            <Text style={styles.title}>Face Morpher</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        marginTop: 70,
        fontSize: 35 ,
        color: 'whitesmoke',
    },
})