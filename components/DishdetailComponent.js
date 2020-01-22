import React, { Component } from 'react';
import {View, ScrollView, FlatList,Text,StyleSheet,Modal,Button } from 'react-native';
import { Card, Icon, Input, } from 'react-native-elements';
import {Rating,AirbnbRating  } from "react-native-ratings";
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite,postComment } from '../redux/ActionCreators';
const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment:(dishId,rating,author,comment)=>dispatch(postComment(dishId,rating,author,comment))
})
function RenderDish(props) {
    const dish = props.dish;
    console.log("this is Map State " , dish)
        if (dish != null) {
            return(
                <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                            <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                            />
                            <Icon
                            raised
                            reverse
                            type='font-awesome'
                            color="#512DA7"
                            name={"pencil"}
                            onPress={()=>props.toggleModal()}
                            ></Icon>
                    </View>
                </Card>
            );
        }
        else {
            return(<View></View>);
        }
}


function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating 
                startingValue={item.rating} 
                readonly
                imageSize={15}
                style={style.rating_bar}
                ></Rating>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class Dishdetail extends Component {
   
    constructor(props){
        super(props)
        this.state = {
            showModal: false,
            author:'',
            rating:1,
            comment:''
        }
    }
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment=(dishId,rating,author,comment)=> {
        this.props.postComment(dishId,rating,author,comment);
        this.toggleModal();
    }
    static navigatioOptions = {
        title:'Dish Details'
    }
    render(){
        const dishId = this.props.navigation.getParam('dishId','');
        console.log("This is Props For Dishes " , this.props.dishes.dishes[+dishId])
        return(
            <ScrollView >
               <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    toggleModal = {()=>this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    visible={this.state.showModal}
                    onDismiss={()=>this.toggleModal()}
                    onRequestClose={()=>this.toggleModal()}
                >
                    <View style={style.modal}>
                        <View>
                            <Rating
                            ratingCount={5}
                            imageSize={30}
                            startingValue={0}
                            showRating
                            onFinishRating={(rating)=>this.setState({rating:rating})}
                            >
                            </Rating>
                        </View>
                        <View style={style.input_grp}>
                            <View>
                                <Input
                                placeholder="Author"
                                leftIcon={
                                    <Icon
                                        name='user-o'
                                        type='font-awesome'
                                        size={20}
                                        marginRight={15}
                                    ></Icon>
                                }
                                onChangeText={(author)=>this.setState({author:author})}
                                ></Input>
                            </View>
                            <View>
                                <Input
                                placeholder="Comment"
                                leftIcon={
                                    <Icon
                                        name='comment-o'
                                        type='font-awesome'
                                        size={20}
                                        marginRight={14}
                                    ></Icon>
                                }
                                onChangeText={(comment)=>this.setState({comment:comment})}
                                ></Input>
                            </View>
                        </View>
                        <View style={style.btn_grp}>
                            <View>
                                <Button 
                                onPress = {() =>{this.toggleModal();this.handleComment(dishId,this.state.rating,this.state.author,this.state.comment)}}
                                color="#512DA7"
                                title="Submit" 
                                />
                            </View>
                            <View style={{marginTop:20}}>
                                <Button 
                                onPress = {() =>{this.toggleModal();}}
                                color="grey"
                                title="Close" 
                                />
                            </View>
                        </View>
                        
                    </View>

                </Modal>
            </ScrollView>
        );
    };
}
const style = StyleSheet.create({
    rating_bar:{
       alignItems:'flex-start'
    },
    modal:{
        margin: 20,
        justifyContent:'center'
    },
    input_grp:{
        marginTop:10
    },
    btn_grp:{
        marginTop:30
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);