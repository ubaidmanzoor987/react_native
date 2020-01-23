import React, { Component } from 'react';
import {View, ScrollView, FlatList,Text,StyleSheet,Modal,Button,Alert, PanResponder,  } from 'react-native';
import { Card, Icon, Input, } from 'react-native-elements';
import {Rating,AirbnbRating  } from "react-native-ratings";
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite,postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';
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
    
    handleViewRef = ref => this.view = ref; 
    
    console.log("this is Map State " , dish)
    
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }
    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if ( dx > 200 )
            return true;
        else
            return false;
    }
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant:()=>{
            this.view.rubberBand(1000)
                .then(endState=>console.log(endState.finished?'finished':'canceled'))
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
            {   
                    Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
            }
            if(recognizeComment(gestureState))
            {
                props.toggleModal();
            }
            return true;
        },
        
    });
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}>
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
                </Animatable.View>
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
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>    
            <Card title='Comments' >
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>    
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