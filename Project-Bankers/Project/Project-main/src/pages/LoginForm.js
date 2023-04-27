import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

import './LoginForm.css';

function LoginForm() {
    const [showCreateForm, setCreateForm] = useState(false);
    const [showAccountCreatedDisplay, setAccountCreatedDisplay] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [invalidUser, setInvalidUser] = useState(false);

    const handleLoginClick = (event) => {
      event.preventDefault();
      const form = event.target;
      const login = {
        name: form.username.value,
        username: form.username.value,
        password: form.password.value,
      };
              const APIlogin = "http://localhost:8080/login";
              const abortController = new AbortController()
              fetch(APIlogin, {
                signal: abortController.signal,
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  name: login.username,
                  //username: login.username,
                  //database wants name here. Switch to username.
                  password: login.password,
                })
              })
              .then((res) => 
              {
                if(res.status === 200){
                  setInvalidUser(false)
                  //save token to browser's session storage. Slice parts of string that are not token.
                  res.json().then(body => {
                  sessionStorage.setItem('Token', JSON.stringify(body['token']).slice(1, -1))
                  //set bankuser_id in session storage to access each user's unique statements
                  sessionStorage.setItem('bankuser_id', JSON.stringify(body['bankuser_id']).slice(1, -1))
                  //get balance value from body.
                  sessionStorage.setItem('balance', JSON.stringify(body['balance']).slice(1, -1))
                  //get savings goal.
                  sessionStorage.setItem('monthlySavingsGoal', JSON.stringify(body['monthlySavingsGoal']).slice(1, -1))
                  //get monthly starting budget
                  sessionStorage.setItem('monthlyStartingBalance', JSON.stringify(body['monthlyStartingBalance']).slice(1, -1))
                  //get daily budget
                  sessionStorage.setItem('dailyBudget', JSON.stringify(body['dailyBudget']).slice(1, -1))
                  //get average daily budget
                  sessionStorage.setItem('avgDailyBudget', JSON.stringify(body['avgDailyBudget']).slice(1, -1))
                  //set bank user
                  sessionStorage.setItem("CurrentUser", login.username);
                })
                  window.location.replace("http://localhost:3000/home")

                }
                if(res.status === 400){
                  setInvalidUser(true)
                }
              })
              .catch(error => {
                if (error.name === 'AbortError') return 
                throw error
              })    
            return () => {abortController.abort()}
  }
  

    const handleCreateClick = (event) => {
        event.preventDefault();
        setCreateForm(true);
      };

      const handleCreateClose = (event) => {
        event.preventDefault();
        setCreateForm(false);
      };

      const handleFormSubmit = (event) => { 
        event.preventDefault();
        const form = event.target;
        const account = {
          id: new Date().getTime(),
          username: form.username.value,
          password: form.password.value,
          balance: form.balance.value,
          avgDailyBudget: 0,
          dailyBudget: 0,
          monthlySavingsGoal: 0,
          monthlyStartingBalance: form.balance.value,
        };
        setAccounts([...accounts, account]);
        setCreateForm(false);
        setAccountCreatedDisplay(true)
        setInvalidUser(false)

                //post data to database
      
                const APIpostUser = "http://localhost:8080/bankuser";
                const abortController = new AbortController()
                fetch(APIpostUser, {
                  signal: abortController.signal,
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    username: account.username,
                    password: account.password,
                  })
                })
                .then((res) => res.json()).then((res) => {sessionStorage.setItem("bankuser_id",JSON.stringify(res["id"]))
    
                //this is called within the bank user fetch to access from its response the user_id that connects bankuser, account and associated statements.
                const APIpostAccount = "http://localhost:8080/users/"+JSON.stringify(res["id"])+"/account";
                const abortController = new AbortController()
                fetch(APIpostAccount, {
                  signal: abortController.signal,
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    username: account.username,
                    password: account.password,
                    balance: account.balance,
                    avgDailyBudget: account.avgDailyBudget,
                    dailyBudget: account.dailyBudget,
                    monthlySavingsGoal: account.monthlySavingsGoal,
                    monthlyStartingBalance: account.monthlyStartingBalance
                  })
                })
                .then((res) => res.json())
                .catch(error => {
                  if (error.name === 'AbortError') return 
                  throw error
                })    
              return () => {abortController.abort()}
              })
                .catch(error => {
                  if (error.name === 'AbortError') return 
                  throw error
                })    
              return () => {abortController.abort()}
    }

  return (
    
        <div className="main">
     <div className="sub-main">
       <div>
         <Form onSubmit={handleLoginClick} >
           <h1>Login</h1>
           <Form.Group controlId="username">
          <Form.Label> Username</Form.Label>
          <Form.Control type="text" name="username" required />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="pwd" required />
        </Form.Group>
        <Button variant="outline-success" type="submit">
          Login
        </Button>
         </Form>
         <br/><br/>
        {//render if invalid user
         invalidUser&&(
          <div style={{fontSize: 12, textAlign: 'center', color: 'green'}}>Not valid user!</div>
        )}
        {//render if account created
        showAccountCreatedDisplay&&(
          <div style={{fontSize: 12, textAlign: 'center', color: 'green'}}>
           Account Created! Please login.
          </div>
         )}
       
         <br/><br/><br/>
         <Button variant="outline-success" onClick={handleCreateClick}>
            Create Account
         </Button>
         <br/><br/>
         {showCreateForm && (
       
       <div className='createButton'>
         <Form onSubmit={handleFormSubmit}>
           <Form.Group controlId="username">
             <Form.Label><br/> Username</Form.Label>
             <Form.Control type="text" name="name" required />
           </Form.Group>
   
           <Form.Group controlId="password">
             <Form.Label>Password</Form.Label>
             <Form.Control type="password" name="name" required />
           </Form.Group>
   
           <Form.Group controlId="balance">
             <Form.Label>Initial Balance</Form.Label>
             <Form.Control type="number" step="0.01" name="amount" required />
           </Form.Group>
   
           <Button variant="outline-success" type="submit">
             Submit
           </Button>
           <Button variant="outline-danger" onClick={handleCreateClose}>
             Cancel
           </Button><br/> <br/>
         </Form>
       </div>
     )}
       </div>
     </div>
    </div>

  );
}

export default LoginForm;



