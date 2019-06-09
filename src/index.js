import React from "react";
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';
import Moment from 'react-moment';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
class SearchBar extends React.Component {
  state = {
    userName: '',
    userid: '',
    data: '',
    getRes : '',
    isLoading : false
  }
 
  handleSubmit = async (event) => {
  
    event.preventDefault();
    this.setState({ isLoading: true })
    axios.get(`https://api.github.com/users/${this.state.userName}/gists`)
    .then(resp => {
      
      this.props.onSubmit(resp.data, this.state.isLoading );
      this.setState({ isLoading: false })
   
       this.setState({ userName: '' })
       
    },
    error => {
      this.setState({ isLoading: false })
     this.props.onSubmit(error.response.statusText);
    }
    
    )
  }
 

  render() {
  
    return ( 
      <div className="formContainer"> <form onSubmit={this.handleSubmit.bind(this)} >
      <input
        type="text" required
        placeholder="Enter Github username"
        value={this.state.userName || ''} 
        onChange={(event) => this.setState({ userName: event.target.value || '' })} 
      />
      <button>Submit</button>
    </form> 
       {this.state.isLoading ? (<Loader/>) : null}
      </div>
     
    );
  }
}
class Fork extends React.Component {
  constructor(props) {
    super(props);
    
  }
render(){

  return(<div>{this.props.forkvalue !== '' ? (<div><img src={this.props.forkvalue.avatar_url} alt="Avatar Img" width="50px" /><label>{this.props.forkvalue.login}</label></div>) : <div></div>}</div>)
}
}
class User extends React.Component {
  state = {dataContent : ''}
   state = {onClick : ''}
  constructor(props) {
    super(props);
    this.sendContent = this.sendContent.bind(this);
  }
  sendContent = (url, uname) => {
     fetch(url)
     .then(function (response) {
       if(response.ok){
         return response.text();
       }
       throw new Error('Error message.');
     })
     .then(function (data) {
      
       this.setState({ dataContent: data });
       this.props.getContent(this.state.dataContent, uname);
     }.bind(this))
     .catch(function (err) {
       console.log("failed to load ", url, err.message);
     });
   }
  render ()
  {
   console.log(this.props);

    this.checkval =  this.props.val;
    return (
      
    <div className="fullContainer"><div className="leftCon"><h2 onClick={() => this.sendContent(this.props.gflang.raw_url, this.props.gflang.filename)}>{this.props.gflang.filename}<span>{this.props.gflang.language}</span></h2>
      <p>Created at:  <Moment format="YYYY/MM/DD">{this.props.gistsvalue.created_at}</Moment></p></div>{this.props.forkval !== undefined ? (<ul>{this.props.forkval.map(fork => <li><Fork key="fork"  {...fork} /></li>  )}</ul>) : <div></div>}</div>
     
    )
  }
}

class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: false} 
    
  }
  render(){ 
  
      return(

        <div> <BounceLoader
        css={override}
        sizeUnit={"px"}
        size={40} 
        color={'#123abc'}
      /></div>
      )
   
    
    
  }
 
}

class CardList extends React.Component {
  state = {getCon : "", filename: "", isLoading : false}
  constructor(props) {
    super(props);
    this.getContent = this.getContent.bind(this);
    
  }
 
  getContent (val, filename)
  {
  
    this.setState({
      getCon: val,
      filename: filename
    });
  }

  render()
  {
   

      return (
        <div id="appendValue">   {this.props.folks === 'No Results' ?   (<div className="listval"><h2>No Results</h2></div>) : this.props.folks === 'No User Found' ? (<div className="listval"><h2>No User Found</h2></div>) : <div>{this.props.uval !== undefined ? (<div><h2>{this.props.uval.uname}</h2><img width="50px" src={this.props.uval.avatar}/></div>) : <h2></h2>}<ul className="listval" id="style-3">{this.props.folks.map(user => <li><User key="user" getContent={this.getContent}  {...user} /></li>  )}</ul>{this.state.getCon !== '' ? (<div className="codeFrame" id="style-3"><h2>{this.state.filename}</h2><SyntaxHighlighter language='javascript' style={docco}>{this.state.getCon}</SyntaxHighlighter></div>) : <div></div>}
      </div>  } </div>
      )
    
    
  }
}

class ListTable extends React.Component {
  state = {
    users: [],
    folks: [],
    fins:[],
    fval : []
  };

  handleSubmit1 = (cardInfo) => {
  
if(cardInfo !== 'Not Found'){
  if(cardInfo.length)
  {
   
   this.setState ({
     users : [],
     uname : '',
     avatar : '',
     folks : [],
     fval : []
   });
   this.setState(prevState => ({
     users: prevState.users.concat(cardInfo)
   }));
 
   Object.values(this.state.users).map((users) => {
   
     this.setState({
       uname: users.owner.login,
       avatar : users.owner.avatar_url
     
     });
     const glang = [];
     Object.values(users.files).map((lang) => {
       glang.push({glangvalue: lang, val: 'gists'})
     })
    
  
    
     let fin = []; 
     let uval = {};
     let val = [];
     let result = [];
     this.setState({ userId: users.id })
     axios.get(`https://api.github.com/gists/${this.state.userId}/forks`).then(response => {
     const finval = [];
         Object.values( response.data).map((forks) => {
         finval.push({forkvalue:forks.owner,val: 'fork'})
       
         })
         val.push({gistsvalue: users, val: 'gists', gflang : glang[0].glangvalue, forkval:finval})
         this.setState({ fins: finval, fval : val })
        
         result = this.state.fval;
         let fin = [...val, ...finval];
         let uval = {uname:this.state.uname, avatar:this.state.avatar};
         this.setState(prevState => ({
          folks: (prevState.folks.concat(result)),
          userval : uval
        }));
   
     })
   })
  }
 else{
   this.setState(prevState => ({
     folks: 'No Results'
   }));
 }
}
else{
  
  this.setState(prevState => ({
    folks: 'No User Found'
  }));
}
   
  }
  render() {
    return (
      <div className='listTable'>
        <SearchBar onSubmit={this.handleSubmit1} />
        <CardList folks={this.state.folks} uval={this.state.userval}  />
       
      </div>
    );
  }
}

export default ListTable;


ReactDOM.render(<ListTable />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
