import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity , FlatList, Modal, ActivityIndicator} from 'react-native';
import {AntDesign} from '@expo/vector-icons'
import colors from './Colors'
import tempData from './tempData'
import TodoList from './components/TodoList'
import AddListModal from './components/AddListModal'
import Fire from './Fire';

export default class App extends React.Component {

state ={
  addTodoVisible :false,
  lists:[],
  user: {},
  loading : true

}

componentDidMount(){
   firebase = new Fire((error, user)=>{
     if(error) {
       return alert('Oh no something went wrong')
     }
     
     firebase.getLists(lists=>{
       this.setState({lists, user}, ()=>{
         this.setState({loading:false});
       })
     })


     this.setState({user})
   });

}

componentWillUnmount(){
  firebase.detach();
}

toggleAddTodoModal(){
  this.setState({addTodoVisible:!this.state.addTodoVisible})
}

renderList = (list) =>{
  return <TodoList list={list} updateList={this.updateList}/>
};

addList =(list) =>{
  this.setState({lists:[...this.state.lists, {...list, id:this.state.lists.length+1, todos:[]} ]})
}

updateList = (list)=>{
this.setState({
  lists: this.state.lists.map(item=>{
     return item.id === list.id ? list : item 
  })
})
}

  render(){
    if(this.state.loading) {
      return (
        <View>
         <ActivityIndicator size="large" color={colors.grey}/>

        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Modal 
        animationType="slide" 
        visible={this.state.addTodoVisible} 
        onRequestClose={()=>this.state.toggleAddTodoModal()}>
          <AddListModal closeModal={()=>this.toggleAddTodoModal()} addList={this.addList}/>
        </Modal>
        <View>
          <Text>User : {this.state.user.uid}</Text>
        </View>
        <View style={{flexDirection:"row"}}>
             <Text style={styles.title}>
               App Dev Progress <Text style={{fontWeight:"300", fontSize:11, color:colors.lightGrey}}> | 進捗チェック</Text>
             </Text>
             <View style={styles.divider} />
        </View>
        
        <View style={{marginVertical:48}}>
        <TouchableOpacity style={styles.AddList} onPress={()=>this.toggleAddTodoModal()}>
         <AntDesign name="plus" size={18} color={colors.purple}/>
        </TouchableOpacity>

        <Text style={styles.add}>Add List</Text>
 
        </View>
     <View style={{height:275, paddingLeft:32}}>
         <FlatList 
         data={this.state.lists} 
         keyExtractor={item=> item.id.toString()} 
         keyboardShouldPersistTaps="always"
         horizontal={true}
         showsHorizontalScrollIndicator={false}
         renderItem={({item})=>
        (
         this.renderList(item) 
        )}
         />   

     </View>



      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider :{
    backgroundColor: colors.lightGrey,
    height:1,
    flex:1,
    alignSelf:'center'
  },
  title :{
    fontSize:22,
    fontWeight:'700',
    color:colors.black,
    paddingHorizontal:34
  },
  addList : {
    borderWidth:2,
    borderColor:colors.lightPurple,
    alignItems:"center",
    justifyContent:"center",
    padding:16,
   
    borderRadius:20
  },
  add :{
    color: colors.blue,
    fontWeight:"600",
    fontSize:14,
    marginTop:8,
    alignItems:"center",
    justifyContent:"center",
  }
});
