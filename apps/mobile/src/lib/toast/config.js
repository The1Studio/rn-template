import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP } from '@repo/ui';
import InfoIcon from '../../icons/InfoIcon';
import CloseIcon from '../../icons/CloseIcon';
import SuccessIcon from '../../icons/SuccessIcon';
export const toastConfig = {
  success: (props) => {
    return (
      <View>
        <View style={[styles.baseContainer, { backgroundColor: '#34B368' }]}>
          <SuccessIcon size={16} color="#fff" />
          <Text style={styles.baseMessage}>{props.text1}</Text>
          <TouchableOpacity
            onPress={props.props.hidePress}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
          >
            <CloseIcon color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
  error: (props) => (
    <View>
      <View style={[styles.baseContainer, { backgroundColor: '#DC4446' }]}>
        <InfoIcon size={16} />
        <Text style={styles.baseMessage}>{props.text1}</Text>
        <TouchableOpacity
          onPress={props.props.hidePress}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <CloseIcon color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  ),
  info: (props) => (
    <View>
      <View style={[styles.baseContainer, { backgroundColor: '#c4c4c4' }]}>
        <InfoIcon size={16} />
        <Text style={styles.baseMessage}>{props.text1}</Text>
        <TouchableOpacity
          onPress={props.props.hidePress}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <CloseIcon color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  baseContainer: {
    width: '100%',
    maxWidth: widthPercentageToDP(90),
    paddingVertical: 8,
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  baseMessage: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
    flex: 1,
    textAlign: 'left',
  },
});
