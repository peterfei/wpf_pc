import React, { Component } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Loading from "../common/Loading";


export default class SearchBone extends Component {

    static navigationOptions = {
        header: null
    };


    constructor(props) {
        super(props);
        this.state = {
            keyboardHeight: 0.01,
            isPublic: true,
            content: "",
            dataList: [],
            keyList: [],
            searchResult: [],
            searchTitle: "",
            data: this.props.searchData,
            fixData: this.props.searchData,
        }
    }


    // 遍历解析Json
    parseJson(jsonObj, arr) {
        // 循环所有键
        for (var key in jsonObj) {
            //如果对象类型为object类型且数组长度大于0 或者 是对象 ，继续递归解析
            var element = jsonObj[key];
            if (element.children.length > 0 && typeof (element) == "object") {
                this.parseJson(element.children, arr);
            } else { //不是对象或数组、直接输出
                arr.push(element.smName)
            }

        }
    }

    clickMenu(menuObj) {

        if (menuObj.children.length > 0) {
            menuObj.isOpen = menuObj.isOpen ? false : true
            this.setState({})
        } else {
            this.clickKey(menuObj);
        }


    }

    /**
     * 点击搜索结果
     */
    clickKey(obj) {

        this.props.clickItem();
        this.props.sendMsgToUnity("modelList", obj.smName);

    }

    async componentDidMount() {

    }



    clickItemAll(menuObj) {

        let arr = [];
        this.props.clickItem();
        this.parseJson(menuObj.children, arr)
        let str = arr.join(',');
        console.log(str);

        this.props.sendMsgToUnity("modelList", str);

    }

    //搜索联想产生列表产品
    async queryKey(value) {
        let arr = []
        this.setState({
            searchTitle: "查询中..."
        })
        if (value.trim() == '') {
            this.setState({
                data: this.state.fixData,
                searchTitle: "",
            })
        } else {

            this.searchData(this.state.fixData, value, arr);

            if (arr.length == 0) {
                this.setState({
                    searchTitle: " " + value + " 没有找到结果,换个关键字试试",
                    searchResult: arr,
                    data: arr,
                })
            } else {
                this.setState({
                    searchTitle: "",
                    searchResult: arr,
                    data: arr,
                })
            }
        }


    }

    searchData(jsonObj, str, arr) {
        // 循环所有键
        for (var key in jsonObj) {
            //如果对象类型为object类型且数组长度大于0 或者 是对象 ，继续递归解析
            var element = jsonObj[key];
            if (element.children.length == 0) {

                if (element.name.indexOf(str) != -1) {
                    arr.push(element)
                }
            }
            this.searchData(element.children, str, arr);

        }

    }

    generateMenu(menuObj) {

        let vdom = [];

        if (menuObj instanceof Array) {
            let list = [];
            for (var item of menuObj) {
                list.push(this.generateMenu(item));
            }
            vdom.push(
                <View key="single">
                    {list}
                </View>
            );
        } else {
            let icon = null;
            let openIcon = null;
            if (menuObj.children.length > 0) {
                icon = <TouchableOpacity
                    style={{ alignItems: 'center' }}
                    onPress={() => {
                        this.clickItemAll(menuObj)
                    }}>
                    <Image
                        source={require('../img/unity/quanxuan.png')}
                        style={{
                            width: 50,
                            height: 50,
                            alignSelf: 'center', justifyContent: "center"
                        }} />
                    <Text style={{ fontSize: 38, color: "#969696", }}>选择显示</Text>
                </TouchableOpacity>

                openIcon =
                    <Image
                        source={menuObj.isOpen ? require('../img/unity/jian.png') : require('../img/unity/jia.png')}
                        style={{
                            width: 60,
                            height: 60,
                            alignSelf: 'center', justifyContent: "center"
                        }} />;

            }

            vdom.push(
                <View style={{ paddingLeft: 60, }}>
                    <View style={{ flexDirection: "row", }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.clickMenu(menuObj)
                            }}
                            style={{
                                flex: 4,
                                height: 100,
                                justifyContent: "center",
                                borderBottomColor: "#454545",
                                borderBottomWidth: 1
                            }}>
                            <View style={{ flexDirection: "row", }}>
                                <View style={{ flex: 1,justifyContent: "center", }}>
                                    {openIcon}
                                </View>
                                <View style={{ flex: 6,justifyContent: "center", }}>
                                    <Text style={{ color: "#bababa" }}>
                                        {menuObj.name}
                                        <Text style={{
                                            color: "#d5d5d5",
                                            fontSize: 38
                                        }}>  {menuObj.enName}</Text>
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    {icon}
                                </View>
                            </View>
                        </TouchableOpacity>


                    </View>

                    {menuObj.isOpen ? this.generateMenu(menuObj.children) : null}
                </View>
            );

        }
        return vdom;
    }

    render() {
        let closeSearch =
            <View style={{ flexDirection: 'row', height: 140, marginTop: 60 }}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.closeSearch()
                    }}
                    style={{ flex: 1, justifyContent: "center", }}>

                    <Image
                        source={require('../img/unity/search-back.png')}
                        style={{
                            width: 60,
                            height: 60,
                            alignSelf: 'center', justifyContent: "center"
                        }} />
                </TouchableOpacity>
                <View style={{ flex: 4, justifyContent: "center", marginRight: 40 }}>
                    <TextInput ref="textInput"
                        onChangeText={(value) => {
                            this.queryKey(value);
                        }}
                        selectionColor={'#FFF'}
                        enablesReturnKeyAutomatically={true}
                        underlineColorAndroid="transparent"
                        placeholderTextColor={"#878787"}
                        placeholder="请输入结构名称"
                        maxLength={25}
                        /*  autoFocus={true}*/
                        /*defaultValue={'1'}*/
                        style={styles.textInput} />
                </View>
                {/* <TouchableOpacity
                    onPress={() => {
                        this.props.closeSearch()

                    }}
                    style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{color: "#EE0000", fontWeight: 'bold', fontSize: size(27)}}>取消</Text>
                </TouchableOpacity>*/}
            </View>
            ;
        return (
            <View style={styles.parent}>
                {/*搜索*/}
                <View style={{
                    position: 'absolute',
                    bottom: 0.01,
                    top: 0,
                    backgroundColor: "rgba(32,32,32,0.5)",
                    left: 0,
                    right: 0
                }}>
                    {closeSearch}
                    <View>
                        <Text style={{
                            color: "#adadad",
                            justifyContent: "center",
                            alignSelf: "center"
                        }}>{this.state.searchTitle}</Text>
                    </View>

                    <ScrollView style={{ paddingRight: 50 }}
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps={'always'}
                    >
                        <View>
                            {this.generateMenu(this.state.data)}
                        </View>
                    </ScrollView>


                </View>
                <Loading
                    ref={r => {
                        this.Loading = r;
                    }}
                    hudHidden={false}
                />
            </View>
        );
    }


}
const styles = StyleSheet.create({
    parent: {
        flex: 1,
        width: '100%', backgroundColor: "rgba(0,0,0,1)",
    },
    textInput: {
        color: '#ffffff',
        width: '100%',
        height: 95,
        paddingTop:20,
        fontSize: 46,
        backgroundColor: "#525252",
        borderRadius: 30
    },
});
