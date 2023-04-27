import './App.css';
import {Container} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import {Route} from 'react-router-dom';
import Home from './pages/Home';
import CalendarView from './pages/CalendarView';
import BalanceView from './pages/BalanceView';
import LoanView from './pages/LoanView';
import LoginForm from './pages/LoginForm';

let tokenBool = false;

export function AuthenticateUser(){
  
  const [currentToken, setCurrentToken] = useState([]);

  
  //check if token exists. If there is no token, user is not logged in.
  //Take user to login page if not logged in.
  if(sessionStorage.getItem("Token")==null&&window.location.href!=="http://localhost:3000/login"){
    window.location.replace("http://localhost:3000/login")
  }
  //get token from account repository and confirm it matches token assigned to session storage by login page of current user after logging in.

  useEffect(() => {
    if(sessionStorage.getItem("Token")!=null){
      const APItoken = "http://localhost:8080/"+sessionStorage.getItem("CurrentUser")+"/account";
      const abortController = new AbortController()
      const fetchToken = () => {
        fetch(APItoken, {signal: abortController.signal})
        .then((res) => res.json())
        .then((res) => {setCurrentToken(res)})
        .catch(error => {
          if (error.name === 'AbortError') return 
          throw error
        })    
      return () => {abortController.abort()}
      }
      fetchToken()
      tokenBool =true;
    }
  },[])

  //if token is invalid redirect to login.
  //token is set in useEffect. This doesn't take affect until after useEffect is over.
  //This means check of token must happen outside useEffect otherwise token is null inside useEffect.
  //useEffect appears to be called last so the check is called before setting token which means it's always true.
  //So I set a bool to prevent it from getting checked until after token is set and useEffect is finished.
  if(tokenBool === true && currentToken['token']!==sessionStorage.getItem("Token")&&window.location.href!=="http://localhost:3000/login"){
    tokenBool=false;
    window.location.replace("http://localhost:3000/login")
  }
}
let dateCheck = new Date();
let todayCheck = dateCheck.getDate();
//check if it is the beginning of the month then update monthlyStartingBalance.
const updateBeginMonth = () =>{
  if(todayCheck === 1){
    sessionStorage.setItem('monthlyStartingBalance', sessionStorage.getItem('monthlyStartingBalance'))

    const updateBeginMonth = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/monthlystartingbalance/"+sessionStorage.getItem('balance')
    const abortController = new AbortController()
    fetch(updateBeginMonth, {
      signal: abortController.signal,
       method: "PATCH",
       headers: {
         "Content-Type": "application/json"
        },
       }).then((res) => res.json())
       .catch(error => {
        if (error.name === 'AbortError') return 
        throw error
      })    
    return () => {abortController.abort()}
  }
}

function App() {
  tokenBool = false;
  AuthenticateUser()
  
  useEffect(()=>{
    updateBeginMonth()
  },[])


  return  ( 
    <div> 
      <Container>
        <Route path="/login" exact={true} component={LoginForm}/>
        <Route path="/home" exact={true} component={Home}/>
        <Route path="/calendar" exact={true} component={CalendarView}/>
        <Route path="/balance" exact={true} component={BalanceView}/>
        <Route path="/loan" exact={true} component={LoanView}/>
      </Container>    
    </div>
  );
}

export default App;

