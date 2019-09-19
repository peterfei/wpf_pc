import React, { PureComponent } from 'react'
import { PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NavigationActions, StackActions } from "react-navigation";
export default class Cell extends PureComponent {
    getState(state) {
        return state.replace("finished", "交易成功").replace("waitPayment", "等待付款").replace("canceled", "已取消").replace("waitComment", "交易成功")
    }

    constructor(props) {
        super(props)

    }

    toDetail(info) {

        // this.props.navigation.navigate("OrderDetail");
        //this.props.navigation.navigate('OrderDetail', {info: info})
    }


    render() {

        let info = this.props.info
        // alert(JSON.stringify(info))
        return (
            //<Text> {this.props.info.combo_name}</Text>
            <TouchableOpacity style={styles.container} onPress={() => {
                this.toDetail(info)
            }}>
                <View style={styles.rightContainer}>

                    <View style={styles.item1}>
                        <View style={styles.f1}>
                            <Text style={styles.createTime}>{info.create_time}</Text>
                        </View>
                        <View style={styles.f3}>
                            <Text style={[styles.h1, { textAlign: "center" }]}>数量</Text>
                        </View>
                        <View style={styles.f3}>
                            <Text style={[styles.h1, { textAlign: "center" }]}>应付金额</Text>
                        </View>
                        <View style={styles.f3}>
                            <Text style={[styles.h1, { textAlign: "center" }]}>状态</Text>
                        </View>
                    </View>


                    <View style={styles.item1}>

                        <View style={styles.f1}>
                            <Text style={styles.h1}>{info.combo_name}</Text>
                        </View>
                        <View style={styles.f3}>
                            <Text style={[styles.h1, { textAlign: "center" }]}>1</Text>
                        </View>
                        <View style={styles.f3}>
                            <Text style={styles.payPrice}>$&nbsp;&nbsp;{info.pay_price}</Text>
                        </View>
                        <View style={styles.f3}>
                            <View style={styles.oderstateStyle}>
                                <Text style={styles.ordState}>{this.getState(info.ord_state)}</Text>
                            </View>
                        </View>
                    </View>

                </View>

            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    item1: {
        flexDirection: 'row'
    },
    container: {
        flexDirection: 'row',
    },
    rightContainer: {
        flex: 1,
        height: 80,
        justifyContent: 'space-around',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: "#383838",
        paddingBottom: 5,
        paddingTop: 5,
    },
    h1: {
        fontSize: 15,
        fontWeight: 'bold',
        color: "white"
    },
    f1: {
        flex: 5,
        fontSize: 16,
        justifyContent: 'center'
    },
    f2: {
        flex: 2,
        fontSize: 16
    },
    f3: {
        flex: 1,
        fontSize: 16,
        justifyContent: 'center',
        alignItems:'center',
    },
    oderstateStyle:{
        backgroundColor: '#F47575',
        width:70,
        height:23,
        justifyContent:'center',
    },
    createTime: {
        textAlign: "left",
        color: 'white'
    },
    payPrice: {
        textAlign: 'center', color: "#F47575", fontWeight: "bold"
    },
    ordState: {
        textAlign: "center",
        color: 'white',
    }
})

