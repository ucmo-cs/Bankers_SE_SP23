import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Table, Overlay, Badge, Alert } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Popover from 'react-bootstrap/Popover';
import '../App.css';
import AuthenticateUser from '../App.js'
import Header from '../components/Header'


const dateStringBuilder=(day,month,year)=>{
  //day from calendar buttons is sent here. Converted to full date string to add to statement post.
  let tempBool = true;
  let dateString = "";
  if(day<10){ //maybe make date builder function. Inputs day, month year.
    if(month+1<10){
      dateString = String(year).concat("-").concat("0").concat(String(month+1)).concat("-").concat("0").concat(String(day))
      tempBool = false;
    }
    if(month+1>9){
      dateString = String(year).concat("-").concat(String(month+1)).concat("-").concat("0").concat(String(day))
      tempBool = false;
    }
  }
  if(tempBool){
    if(month+1<10){
      dateString = String(year).concat("-").concat("0").concat(String(month+1)).concat("-").concat(String(day))
      tempBool = true;
    }
    if(month+1>9){
      dateString = String(year).concat("-").concat(String(month+1)).concat("-").concat(String(day))
      tempBool = true;
    }
  }
  return dateString;
}


let Weekday = 0;
let C = 0;
let Y = 0;
let m = 0;
let lastMonthDay = 0;
let currentDate = new Date();
let todaysDate = currentDate.getDate();
let todaysMonth = currentDate.getMonth(); //date builder function is different in calendar view. No +1 here.
let todaysYear = currentDate.getFullYear();

//set this in session storage.
let year = currentDate.getFullYear();
let month = currentDate.getMonth();
sessionStorage.setItem("Year", year)

//list for converting month number to name
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let monthName = monthNames[month];
sessionStorage.setItem("Month", monthName)
//bool for leap year
let isLeapYear = false; 
let displayDay = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]  
let buttonDisable = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]  
let tempString = "";

 //determine century and year digits
const setCYdigits = () =>{
  C=Number(String(year)[0].concat(String(year)[1]))
  Y=Number(String(year).slice(-2))

}

    //checks if selected year is a leap year and sets isLeapYear bool.
    const checkLeap = () =>{
      if(year-4*Math.floor(year/4)===0&&year-100*Math.floor(year/100)!==0){
        isLeapYear=true;
      }
      if(year-400*Math.floor(year/400)===0){
        isLeapYear=true;
      }
      else{
        isLeapYear=false;
      }
    }

    //convert month number to calendar code. 
    //March = 1, . . ., Dec. = 10, Jan. = 11, Feb. = 12
    //set total number of days in selected month
    const convertMonth = () =>{
      if(month===0){
        m=11
        lastMonthDay=31
      }
      if(month===1){
        m=12
        if(isLeapYear===true){
          lastMonthDay=29
        }
        else{
          lastMonthDay=28
        }
      }
      if(month===2){
        m=1
        lastMonthDay=31
      }
      if(month===3){
        m=2
        lastMonthDay=30
      }
      if(month===4){
        m=3
        lastMonthDay=31
      }
      if(month===5){
        m=4
        lastMonthDay=30
      }
      if(month===6){
        m=5
        lastMonthDay=31
      }
      if(month===7){
        m=6
        lastMonthDay=31
      }
      if(month===8){
        m=7
        lastMonthDay=30
      }
      if(month===9){
        m=8
        lastMonthDay=31
      }
      if(month===10){
        m=9
        lastMonthDay=30
      }
      if(month===11){
        m=10
        lastMonthDay=31
      }
      }

const calculateWeek = () => {
  //modulo (x)mod(y) = x-y*floor(x/y)
  //first variable is 1 as this must find the name of the first day.
  const x=(1+Math.floor(2.6*m-0.2)-2*C+Y+Math.floor(Y/4)+Math.floor(C/4));  
  Weekday = x-7*Math.floor(x/7);
}

 //get first day
 const calenderFill = () =>{

  for(let i = 0; i < (7); i++){
    if(Weekday===i){
        displayDay[i]=1;
        buttonDisable[i]=false;
      }
  
  //get last day of month
  for(let i = (Weekday+1); i < (lastMonthDay+Weekday); i++){
    displayDay[i]=i-Weekday+1;
    buttonDisable[i]=false;
  }    
  };
  
  //disable buttons before day 1/set day display to empty.
  for(let i = (Weekday-1); 0 <= (i); i--){
    buttonDisable[i]=true;
    displayDay[i] = <br/>;
  }
  //disable buttons before day 1/set day display to empty.
   for(let i = (lastMonthDay+Weekday); i < 42; i++){
    buttonDisable[i]=true;
    displayDay[i] = <br/>;
  }
}


 
function CalendarView() {
  const [globalBudget, setGlobalBudget] = useState(sessionStorage.getItem('dailyBudget'))
  const [globalBalance, setGlobalBalance] = useState(sessionStorage.getItem('balance'))

    AuthenticateUser()

    useEffect(() => {
      setCYdigits()
    },[])

    useEffect(() => {
      checkLeap()
    },[])

    useEffect(() => {
      convertMonth()
    },[])

    useEffect(() => {
      calculateWeek()
    },[])

  useEffect(() => {
    calenderFill()
  },[])

  //modifies look of calendar buttons
  const style = {
    border: '1px solid gray',
    fontSize: '10px',
    fontWeight: '600',
    outline: 'Yes',
    width: '100px',
    height: '100px',
    paddingRight: '80px', 
    lineHeight: '12px'
  };

  const popoverStyle ={
    maxWidth: 'none'
  }

  //modifies look of dropdown buttons
  const dropStyle = {
    border: "1px solid white",
    fontSize: '12px',
    width: "200px",
    height: "30px",
  };
  //sets year display. 
  const [valueYear, setValueYear] = useState(sessionStorage.getItem("Year"))
  const handleSelectYear = (e) => {
      setShowStatement(false);
      setValueYear(e);
      year = e;
      sessionStorage.setItem("Year", e)
      setCYdigits()
      calculateWeek()
      calenderFill()
  };
  //sets month dispaly.
  const [valueMonth, setValueMonth] = useState(sessionStorage.getItem("Month"))
  const handleSelectMonth = (e) => {
      setShowStatement(false);
      setValueMonth(e);
      month = monthNames.indexOf(e);
      sessionStorage.setItem("Month", e)
      convertMonth()
      calculateWeek()
      calenderFill()
  }

  //savings goal
  const [savings, setSavings] = useState("");
  const [showSavingsForm, setShowSavingsForm] = useState(false);
  
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [transactions, setTransactions] = useState([]);

  //find all statements and fill table with data based on current user
  useEffect(() => {
    const APIallGet = "http://localhost:8080/"+sessionStorage.getItem('bankuser_id')+"/statements";
    const abortController = new AbortController()   //Abort controller
    fetch(APIallGet, { signal: abortController.signal }) 
    .then((res) => res.json())
    .then((res) => {setTransactions(res)})
      .catch(error => {if (error.name === 'AbortError') return  
 throw error})
    return () => {abortController.abort()}
  }, [transactions])


    //button for bringing up statements
    const [target, setTarget] = useState(null);
    const ref = useRef(null);
    const [showStatement, setShowStatement] = useState(false);

    const handleButton = (event) =>{
      event.preventDefault();
      setShowStatement(true);
      setTarget(event.currentTarget)
      //get date based on button clicked and selected month/year.
      //convert date to format used by transactions array.
      tempString = dateStringBuilder(event.currentTarget.value,month,year)
      filterbyDay(tempString)
    };
  

  const handleIncomeClick = (event) => {
    event.preventDefault();
    setShowIncomeForm(true);
  };

  const handleExpenseClick = (event) => {
    event.preventDefault();
    setShowExpenseForm(true);
  };

  //savings goal
  const handleSavingsClick = (event) => {
    event.preventDefault();
    setShowSavingsForm(true);
  };
  //savings goal
  const handleSavingsClose = (event) => {
    event.preventDefault();
    setShowSavingsForm(false);
  };
  //savings goal
  const [savingsSet, setSavingsSet]= useState("FALSE")
  const handleSavings = (event) =>{
    event.preventDefault();
    setShowSavingsForm(false);
    const updateSavingsGoal = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/monthlysavingsgoal/"+savings
    fetch(updateSavingsGoal, {
       method: "PATCH",
       headers: {
         "Content-Type": "application/json"
        },
       }).then((res) => res.json())
       sessionStorage.setItem('monthlySavingsGoal', savings)
       setSavingsSet(!savingsSet)
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const transaction = {
      id: new Date().getTime(),
      date: tempString,
      name: form.name.value,
      type: showIncomeForm ? 'Income' : 'Expense',
      planned: form.planned.value,
      frequency: form.frequency.value,
      amount: form.amount.value,
      affected: "TRUE",
    };
    setTransactions([...transactions, transaction]);
    setShowIncomeForm(false);
    setShowExpenseForm(false);

    if(transaction.frequency === "One-Time"){
      transaction.affected = "FALSE";
    }

    let stringTemp = dateStringBuilder(todaysDate, todaysMonth, todaysYear)
    let tempBalance = 0;
    let tempBudget = 0;

      if(transaction.date === stringTemp && transaction.affected === "FALSE" && transaction.frequency === "One-Time"){
      //update statement affected.

      transaction.affected = "TRUE";
  
        if(transaction.type === "Income"){
          //update balance in account
          tempBalance = parseInt(sessionStorage.getItem('balance'))+parseInt(transaction.amount)
          sessionStorage.setItem('balance', tempBalance)
          setGlobalBalance(tempBalance)
          const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
          fetch(updateAccountBalance, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
          }).then((res) => res.json())
  
         tempBudget = parseInt(sessionStorage.getItem('dailyBudget'))+ parseInt(transaction.amount)
         sessionStorage.setItem('dailyBudget', tempBudget)
  
        }
        if(transaction.type === "Expense"){
            //update balance in account
            tempBalance = parseInt(sessionStorage.getItem('balance'))-parseInt(transaction.amount)
            sessionStorage.setItem('balance', tempBalance)
            setGlobalBalance(tempBalance)
    
            const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
            fetch(updateAccountBalance, {
               method: "PATCH",
               headers: {
                 "Content-Type": "application/json"
                },
               }).then((res) => res.json())
          
            tempBudget = parseInt(sessionStorage.getItem('dailyBudget'))-parseInt(transaction.amount)
            sessionStorage.setItem('dailyBudget', tempBudget)
        }
        setGlobalBudget(tempBudget)
        const updateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
        fetch(updateAccountBudget, {
           method: "PATCH",
           headers: {
             "Content-Type": "application/json"
            },
           }).then((res) => res.json())   
      }

    
    //post data to database associated with current bankuser.
    const APIpost = "http://localhost:8080/users/"+sessionStorage.getItem('bankuser_id')+"/statement"; 
    fetch(APIpost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: transaction.name,
        date: transaction.date,
        type: transaction.type,
        planned: transaction.planned,
        frequency: transaction.frequency,
        amount: transaction.amount,
        affected: transaction.affected,
      })
    })
    .then((res) => res.json())
  };
  //end post data


  const handleIncomeClose = (event) => {
    event.preventDefault();
    setShowIncomeForm(false)
  };

  const handleExpenseClose = (event) => {
    event.preventDefault();
    setShowExpenseForm(false);
  };

  //puts transactions into a temp array
  const [filteredtransactions, setfilteredTransactions] = useState(transactions);
   //selected date is passed as "date" and filters array
  const filterbyDay = date =>{
    setfilteredTransactions(transactions.filter(transaction=>{
      return transaction.date === date
    }))
  }

  const handleDelete = (id) => {
   
    transactions.filter(transaction=>{

      if(transaction.id === id){
      if(transaction.affected === "TRUE"){
        //if affected is true, undo affect on delete.
        if(transaction.type === "Income"){
          let tempDaily = parseInt(sessionStorage.getItem('balance'));
          let tempAmout = parseInt(transaction.amount);
          let tempBalance = tempDaily - tempAmout;
          
          sessionStorage.setItem('balance', tempBalance)
          setGlobalBalance(tempBalance)
          const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
          fetch(updateAccountBalance, {
             method: "PATCH",
             headers: {
               "Content-Type": "application/json"
              },
             }).then((res) => res.json())
        }
        if(transaction.type==="Expense"){
          let tempDaily = parseInt(sessionStorage.getItem('balance'));
          let tempAmout = parseInt(transaction.amount);
          let tempBalance = tempDaily + tempAmout;

          sessionStorage.setItem('balance', tempBalance)
          setGlobalBalance(tempBalance)
          const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
          fetch(updateAccountBalance, {
             method: "PATCH",
             headers: {
               "Content-Type": "application/json"
              },
             }).then((res) => res.json())
        }
      }
      if(transaction.frequency === "One-Time"){
        //if one-time, this means it affected budget. Undo this affect.
        if(transaction.type === "Income"){

          let tempDailyBudget = parseInt(sessionStorage.getItem('dailyBudget'));
          let tempAmout = parseInt(transaction.amount);
          let tempBudget = tempDailyBudget - tempAmout;

          sessionStorage.setItem('dailyBudget', tempBudget)
          setGlobalBudget(tempBudget)
        //update daily budget
        const updateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
        fetch(updateAccountBudget, {
           method: "PATCH",
           headers: {
             "Content-Type": "application/json"
            },
           }).then((res) => res.json())
        }
        if(transaction.type === "Expense"){

          let tempDailyBudget = parseInt(sessionStorage.getItem('dailyBudget'));
          let tempAmout = parseInt(transaction.amount);
          let tempBudget = tempDailyBudget + tempAmout;

          sessionStorage.setItem('dailyBudget', tempBudget)
          setGlobalBudget(tempBudget)
        //update daily budget
        const updateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
        fetch(updateAccountBudget, {
           method: "PATCH",
           headers: {
             "Content-Type": "application/json"
            },
           }).then((res) => res.json())
        }
      }
    }
    return "statement deleted"})

    setTransactions(transactions.filter((transaction) => transaction.id !== id));

    //delete data from database based on current user.
    const APIdelete = "http://localhost:8080/users/"+sessionStorage.getItem('bankuser_id')+"/statement/"+id;
    fetch(APIdelete, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((res) => res.text())

  //end delete data
  };


//these functions display statement info in buttons.
let tempCount = 0;
let overCount = 0;
const tempCounter = () => {
  tempCount++;
    }
const overCounter = () => {
  overCount++;
    } 
const tempCounterRetset = () => {
  tempCount = 0;
  overCount = 0;
    }

//Searches statement array by date and displays to calendar buttons.
//Checks to only display first three then display" . . . more" if more than three.
const JSXFunction  = (data) =>{return <div> 
            {transactions.map((transaction,index) => (
              <div key ={index} >
                {transaction.date===dateStringBuilder(displayDay[data],month,year)&& overCounter()}
                {transaction.date===dateStringBuilder(displayDay[data],month,year)&&transaction.type ==="Income"&&tempCount<3&&transaction.planned ==="TRUE"&&
                <div style={{whiteSpace: 'nowrap', color: 'green', fontSize: '12px'}}>{"PL+$"}{transaction.amount}{tempCounter()}</div>
                }
                {transaction.date===dateStringBuilder(displayDay[data],month,year)&&transaction.type ==="Expense"&&tempCount<3&&transaction.planned ==="TRUE"&&
                <div style={{whiteSpace: 'nowrap', color: 'red', fontSize: '12px'}}>{"PL-$"}{transaction.amount}{tempCounter()}</div>
                }
               {transaction.date===dateStringBuilder(displayDay[data],month,year)&&transaction.type ==="Income"&&tempCount<3&&transaction.planned ==="FALSE"&&
                <div style={{whiteSpace: 'nowrap', color: 'green', fontSize: '12px'}}>{"UN+$"}{transaction.amount}{tempCounter()}</div>
                }
                {transaction.date===dateStringBuilder(displayDay[data],month,year)&&transaction.type ==="Expense"&&tempCount<3&&transaction.planned ==="FALSE"&&
                <div style={{whiteSpace: 'nowrap', color: 'red', fontSize: '12px'}}>{"UN-$"}{transaction.amount}{tempCounter()}</div>
                }
                
              </div >
            ))}
        </div>;}

//fills in button with line breaks to keep consistent look based on how many statements posted to that button.
const buttonFill = () =>{
  if(overCount>3){
    return <div style={{ whiteSpace: 'nowrap', color: 'blue', fontSize: '10px'}}>. . . more<br/><br/></div>
  }
  if(tempCount===0){
    return <><br/><br/><br/><br/><br/></>
  }
  if(tempCount===1){
    return <><br/><br/><br/><br/></>
  }
  if(tempCount===2){
    return <><br/><br/><br/></>
  }
  if(tempCount===3){
    return <div><br/><br/></div>
  }
}
  //this updated session storage twice.
  const checkStatements = () => {//this checks if an upcoming statement takes affect today.
 
    const APIallGet = "http://localhost:8080/"+sessionStorage.getItem('bankuser_id')+"/statements";
    fetch(APIallGet)
    .then((res) => res.json())
    .then((res) => {
      let stringTemp = dateStringBuilder(todaysDate, todaysMonth, todaysYear)
    let tempBalance = 0;
    let tempBudget = 0;
  
    res.filter(transaction=>{

      if(transaction.date === stringTemp && transaction.affected === "FALSE" && transaction.frequency === "One-Time"){
      //update statement affected.
  
      const updateStatementAffected = "http://localhost:8080/users/"+sessionStorage.getItem('bankuser_id')+"/statements/" +transaction.id+ "/affected/TRUE"
      fetch(updateStatementAffected, {
         method: "PATCH",
         headers: {
           "Content-Type": "application/json"
          },
         }).then((res) => res.json())
  
        if(transaction.type === "Income"){
          //update balance in account
          tempBalance = parseInt(sessionStorage.getItem('balance'))+parseInt(transaction.amount)
          sessionStorage.setItem('balance', tempBalance)
          setGlobalBalance(tempBalance)
          const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
          fetch(updateAccountBalance, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
          }).then((res) => res.json())
  
         tempBudget = parseInt(sessionStorage.getItem('dailyBudget'))+ parseInt(transaction.amount)
         sessionStorage.setItem('dailyBudget', tempBudget)
  
        }
        if(transaction.type === "Expense"){
            //update balance in account
            tempBalance = parseInt(sessionStorage.getItem('balance'))-parseInt(transaction.amount)
            sessionStorage.setItem('balance', tempBalance)
            const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
            fetch(updateAccountBalance, {
               method: "PATCH",
               headers: {
                 "Content-Type": "application/json"
                },
               }).then((res) => res.json())
          
            tempBudget = parseInt(sessionStorage.getItem('dailyBudget'))-parseInt(transaction.amount)
            sessionStorage.setItem('dailyBudget', tempBudget)
        }
        setGlobalBudget(tempBudget)
        const updateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
        fetch(updateAccountBudget, {
           method: "PATCH",
           headers: {
             "Content-Type": "application/json"
            },
           }).then((res) => res.json())

      } return "balance updated"})
    
    })
  }
  useEffect(() => {
    checkStatements()
  },[])

  return(
    <div><Header/>
    <div style={{display:'flex'}}>
      <div>
        <div style={{order: 2}}>
       <div>Account Balance: <Badge bg="secondary">${globalBalance}</Badge></div>

        <div style={{fontSize: "30px", paddingTop: '16px'}}>
        {valueYear} {valueMonth}
        </div>

        <Dropdown className="d-inline mx-0"onSelect={handleSelectYear}>
      <Dropdown.Toggle variant="success" id="Year" style={dropStyle}>
        Select Year
      </Dropdown.Toggle>

      <Dropdown.Menu >
        <Dropdown.Item eventKey="2000" >2000</Dropdown.Item>
        <Dropdown.Item eventKey="2001" >2001</Dropdown.Item>
        <Dropdown.Item eventKey="2002" >2002</Dropdown.Item>
        <Dropdown.Item eventKey="2003" >2003</Dropdown.Item>
        <Dropdown.Item eventKey="2004" >2004</Dropdown.Item>
        <Dropdown.Item eventKey="2005" >2005</Dropdown.Item>
        <Dropdown.Item eventKey="2006" >2006</Dropdown.Item>
        <Dropdown.Item eventKey="2007" >2007</Dropdown.Item>
        <Dropdown.Item eventKey="2008" >2008</Dropdown.Item>
        <Dropdown.Item eventKey="2009" >2009</Dropdown.Item>
        <Dropdown.Item eventKey="2010" >2010</Dropdown.Item>
        <Dropdown.Item eventKey="2011" >2011</Dropdown.Item>
        <Dropdown.Item eventKey="2012" >2012</Dropdown.Item>
        <Dropdown.Item eventKey="2013" >2013</Dropdown.Item>
        <Dropdown.Item eventKey="2014" >2014</Dropdown.Item>
        <Dropdown.Item eventKey="2015" >2015</Dropdown.Item>
        <Dropdown.Item eventKey="2016" >2016</Dropdown.Item>
        <Dropdown.Item eventKey="2017" >2017</Dropdown.Item>
        <Dropdown.Item eventKey="2018" >2018</Dropdown.Item>
        <Dropdown.Item eventKey="2019" >2019</Dropdown.Item>
        <Dropdown.Item eventKey="2020" >2020</Dropdown.Item>
        <Dropdown.Item eventKey="2021" >2021</Dropdown.Item>
        <Dropdown.Item eventKey="2022" >2022</Dropdown.Item>
        <Dropdown.Item eventKey="2023" >2023</Dropdown.Item>
        <Dropdown.Item eventKey="2024" >2024</Dropdown.Item>
        <Dropdown.Item eventKey="2025" >2025</Dropdown.Item>
        <Dropdown.Item eventKey="2026" >2026</Dropdown.Item>
        <Dropdown.Item eventKey="2027" >2027</Dropdown.Item>
        <Dropdown.Item eventKey="2028" >2028</Dropdown.Item>
        <Dropdown.Item eventKey="2029" >2029</Dropdown.Item>
        <Dropdown.Item eventKey="2030" >2030</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>

    <Dropdown className="d-inline mx-0" onSelect={handleSelectMonth}>
      <Dropdown.Toggle variant="success" id="Month" style={dropStyle}>
        Select Month
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="January">January</Dropdown.Item>
        <Dropdown.Item eventKey="February">February</Dropdown.Item>
        <Dropdown.Item eventKey="March">March</Dropdown.Item>
        <Dropdown.Item eventKey="April">April</Dropdown.Item>
        <Dropdown.Item eventKey="May">May</Dropdown.Item>
        <Dropdown.Item eventKey="June">June</Dropdown.Item>
        <Dropdown.Item eventKey="July">July</Dropdown.Item>
        <Dropdown.Item eventKey="August">August</Dropdown.Item>
        <Dropdown.Item eventKey="September">September</Dropdown.Item>
        <Dropdown.Item eventKey="October">October</Dropdown.Item>
        <Dropdown.Item eventKey="November">November</Dropdown.Item>
        <Dropdown.Item eventKey="December">December</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>


        <div>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[0]} onClick = {handleButton} value={displayDay[0]}>
            <>{displayDay[0]}</>
            <>{JSXFunction(0)}</>
            <>{buttonFill()}</>
            <>{tempCounterRetset()}</>
            <>Sunday</>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[1]} onClick = {handleButton} value={displayDay[1]}>
            <>{displayDay[1]}</>
            <>{JSXFunction(1)}</>
            <>{buttonFill()}</>
            <>{tempCounterRetset()}</>
            <>Monday</>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[2]} onClick = {handleButton} value={displayDay[2]}>
            <>{displayDay[2]}</>
            <>{JSXFunction(2)}</>
            <>{buttonFill()}</>
            <>{tempCounterRetset()}</>
            <>Tuesday</>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[3]} onClick = {handleButton} value={displayDay[3]}>
            <>{displayDay[3]}</>
            <>{JSXFunction(3)}</>
            <>{buttonFill()}</>
            <>{tempCounterRetset()}</>
            <>Wednesday</>
          </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[4]} onClick = {handleButton} value={displayDay[4]}>
            <>{displayDay[4]}</>
            <>{JSXFunction(4)}</>
            <>{buttonFill()}</>
            <>{tempCounterRetset()}</>
            <>Thursday</>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[5]} onClick = {handleButton} value={displayDay[5]}>
            <>{displayDay[5]}</>
            <>{JSXFunction(5)}</>
            <>{buttonFill()}</>
            <>{tempCounterRetset()}</>
            <>Friday</>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[6]} onClick = {handleButton} value={displayDay[6]}>
            <>{displayDay[6]}</>
            <>{JSXFunction(6)}</>
            <>{buttonFill()}</>
            <>{tempCounterRetset()}</>
            <>Saturday</>
            </Button>
        </div>
        <div>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[7]}>
            <div>{displayDay[7]}</div>
            <div>{JSXFunction(7)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Sunday</div>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[8]}>
            <div>{displayDay[8]}</div>
            <div>{JSXFunction(8)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Monday</div>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[9]}>
            <div>{displayDay[9]}</div>
            <div>{JSXFunction(9)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Tuesday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[10]}>
            <div>{displayDay[10]}</div>
            <div>{JSXFunction(10)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Wednesday</div>
          </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[11]}>
            <div>{displayDay[11]}</div>
            <div>{JSXFunction(11)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Thursday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[12]}>
            <div>{displayDay[12]}</div>
            <div>{JSXFunction(12)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Friday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[13]}>
            <div>{displayDay[13]}</div>
            <div>{JSXFunction(13)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Saturday</div>
            </Button>
        </div>
        <div>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[14]}>
            <div>{displayDay[14]}</div>
            <div>{JSXFunction(14)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Sunday</div>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[15]}>
            <div>{displayDay[15]}</div>
            <div>{JSXFunction(15)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Monday</div>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[16]}>
            <div>{displayDay[16]}</div>
            <div>{JSXFunction(16)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Tuesday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[17]}>
            <div>{displayDay[17]}</div>
            <div>{JSXFunction(17)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Wednesday</div>
          </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[18]}>
            <div>{displayDay[18]}</div>
            <div>{JSXFunction(18)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Thursday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[19]}>
            <div>{displayDay[19]}</div>
            <div>{JSXFunction(19)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Friday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[20]}>
            <div>{displayDay[20]}</div>
            <div>{JSXFunction(20)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Saturday</div>
            </Button>
        </div>
        <div>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[21]}>
            <div>{displayDay[21]}</div>
            <div>{JSXFunction(21)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Sunday</div>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[22]}>
            <div>{displayDay[22]}</div>
            <div>{JSXFunction(22)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Monday</div>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[23]}>
            <div>{displayDay[23]}</div>
            <div>{JSXFunction(23)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Tuesday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[24]}>
            <div>{displayDay[24]}</div>
            <div>{JSXFunction(24)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Wednesday</div>
          </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[25]}>
            <div>{displayDay[25]}</div>
            <div>{JSXFunction(25)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Thursday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[26]}>
            <div>{displayDay[26]}</div>
            <div>{JSXFunction(26)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Friday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} onClick = {handleButton} value={displayDay[27]}>
            <div>{displayDay[27]}</div>
            <div>{JSXFunction(27)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Saturday</div>
            </Button>
        </div>
        <div>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[28]} onClick = {handleButton} value={displayDay[28]}>
            <div>{displayDay[28]}</div>
            <div>{JSXFunction(28)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Sunday</div>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[29]} onClick = {handleButton} value={displayDay[29]}>
            <div>{displayDay[29]}</div>
            <div>{JSXFunction(29)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Monday</div>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[30]} onClick = {handleButton} value={displayDay[30]}>
            <div>{displayDay[30]}</div>
            <div>{JSXFunction(30)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Tuesday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[31]} onClick = {handleButton} value={displayDay[31]}>
            <div>{displayDay[31]}</div>
            <div>{JSXFunction(31)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Wednesday</div>
          </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[32]} onClick = {handleButton} value={displayDay[32]}>
            <div>{displayDay[32]}</div>
            <div>{JSXFunction(32)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Thursday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[33]} onClick = {handleButton} value={displayDay[33]}>
            <div>{displayDay[33]}</div>
            <div>{JSXFunction(33)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Friday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[34]} onClick = {handleButton} value={displayDay[34]}>
            <div>{displayDay[34]}</div>
            <div>{JSXFunction(34)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Saturday</div>
            </Button>
        </div>
        <div>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[35]} onClick = {handleButton} value={displayDay[35]}>
            <div>{displayDay[35]}</div>
            <div>{JSXFunction(35)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Sunday</div>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[36]} onClick = {handleButton} value={displayDay[36]}>
            <div>{displayDay[36]}</div>
            <div>{JSXFunction(36)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Monday</div>
            </Button>
            <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[37]} onClick = {handleButton} value={displayDay[37]}>
            <div>{displayDay[37]}</div>
            <div>{JSXFunction(37)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Tuesday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[38]} onClick = {handleButton} value={displayDay[38]}>
            <div>{displayDay[38]}</div>
            <div>{JSXFunction(38)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Wednesday</div>
          </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[39]} onClick = {handleButton} value={displayDay[39]}>
            <div>{displayDay[39]}</div>
            <div>{JSXFunction(39)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Thursday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[40]} onClick = {handleButton} value={displayDay[40]}>
            <div>{displayDay[40]}</div>
            <div>{JSXFunction(40)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Friday</div>
            </Button>
          <Button variant="outline-secondary" type="button" style ={style} disabled = {buttonDisable[41]} onClick = {handleButton} value={displayDay[41]}>
            <div>{displayDay[41]}</div>
            <div>{JSXFunction(41)}</div>
            <div>{buttonFill()}</div>
            <div>{tempCounterRetset()}</div>
            <div>Saturday</div>
            </Button>
        </div>
        </div>
        </div>

        <div id = "item2">   
          <Alert style={{marginTop: '114px', paddingLeft: '20px', height:'600px', width: '410px', fontSize: '20px', background: 'white'}}>
        <div>Monthly Savings Goal: ${parseInt(sessionStorage.getItem('monthlySavingsGoal'))}</div>
        <div>Monthly Starting Balance: ${parseInt(sessionStorage.getItem('monthlyStartingBalance'))}</div>
        <div>Monthly Target Balance: ${(parseInt(sessionStorage.getItem('monthlyStartingBalance'))+parseInt(sessionStorage.getItem('monthlySavingsGoal')))}</div>
        <div style={{height: '6px', backgroundColor: '#d8e4fa', marginTop: '10px', border: '1px solid #b2caf6', borderRadius: '2px'}}></div>

        <div style={{marginTop: '10px'}}>Daily Savings Goal: ${Math.round((parseInt(sessionStorage.getItem('monthlySavingsGoal')) / lastMonthDay ))}</div>
        <div>Avg Daily Budget: ${Math.round(parseInt(sessionStorage.getItem('avgDailyBudget')))}</div>

        <div style={{height: '6px', backgroundColor: '#d8e4fa', marginTop: '10px', marginBottom: '10px', border: '1px solid #b2caf6', borderRadius: '2px'}}></div>
        <div>Today's Target Balance: ${Math.round(((todaysDate/lastMonthDay)*parseInt(sessionStorage.getItem('monthlySavingsGoal'))+parseInt(sessionStorage.getItem('monthlyStartingBalance'))))}</div>
        <div style={
                (parseInt(sessionStorage.getItem('balance')) - (parseInt(sessionStorage.getItem('monthlyStartingBalance'))+parseInt(sessionStorage.getItem('monthlySavingsGoal')))) < 0
                  ? {color: 'red' }
                  : {color: 'green' }}>Monthly Goal: ${parseInt(sessionStorage.getItem('balance')) - (parseInt(sessionStorage.getItem('monthlyStartingBalance'))+parseInt(sessionStorage.getItem('monthlySavingsGoal')))}</div>
      <div style={
                Math.round(((parseInt(sessionStorage.getItem('balance'))-((todaysDate/lastMonthDay)*parseInt(sessionStorage.getItem('monthlySavingsGoal'))+parseInt(sessionStorage.getItem('monthlyStartingBalance')))))) < 0
                  ? {color: 'red' }
                  : {color: 'green' }}>Daily Goal: ${Math.round(((parseInt(sessionStorage.getItem('balance'))-((todaysDate/lastMonthDay)*parseInt(sessionStorage.getItem('monthlySavingsGoal'))+parseInt(sessionStorage.getItem('monthlyStartingBalance'))))))}</div>
        <div style={
                Math.round(((parseInt(sessionStorage.getItem('balance'))-parseInt(sessionStorage.getItem('monthlyStartingBalance')))/(lastMonthDay-todaysDate))+parseInt(sessionStorage.getItem('dailyBudget'))) < 0
                  ? {color: 'red' }
                  : {color: 'green' }}>Avg Daily Budget Remaining: ${Math.round(parseInt(sessionStorage.getItem('dailyBudget')))}</div>
        <Button  style={{marginTop: '10px'}} variant="outline-warning" onClick={handleSavingsClick}>
          Adjust Savings Goal
        </Button>
        {showSavingsForm && (
          <div>
               <Form onSubmit={handleSavings}>

               <Form.Group controlId="savings-goal">
                <Form.Label>New Savings Goal</Form.Label>
                <Form.Control style={{width: '170px'}} type="number" value={savings} onChange={(event) => setSavings(event.target.value)} required />
              </Form.Group>
      
                  <Button type="submit" variant="outline-success">Submit</Button>
                  <Button variant="outline-danger" onClick={handleSavingsClose}>Cancel</Button>
                </Form>
          </div>
        )}
         <br/><br/><br/><br/><br/>
        </Alert>
      </div>

    <div ref={ref}>
    <Overlay 
    show = {showStatement} 
    target = {target}
    placement="bottom"
    container={ref}
    containerPadding={0}>
      <Popover 
      id="popover-contained"
      style={popoverStyle}>
      <Popover.Body>
    <div style={{textAlign: 'center', display: 'inline',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Income/Expense</th>
              <th>Planned</th>
              <th>Frequency</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredtransactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.name}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.type}</td>
                <td>{transaction.planned}</td>
                <td>{transaction.frequency}</td>
                <td>{transaction.date}</td>
                <td>
                  <Button variant="outline-danger" onClick={() => handleDelete(transaction.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div style={{ textAlign: 'center', alignItems: 'center' }}>
          <Button variant="outline-success" onClick={handleIncomeClick}>
            Add Income
          </Button>
          <Button variant="outline-success" onClick={handleExpenseClick}>
            Add Expense
          </Button>
        </div>
        {showIncomeForm && (
          <div style={{ textAlign: 'center' }}>
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="incomeName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" required />
              </Form.Group>

              <Form.Group controlId="incomeAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" step="0.01" name="amount" required />
              </Form.Group>

              <Form.Group controlId="plannedBool">
              <Form.Label>Planned</Form.Label>
              <Form.Select name="planned" required>
                <option>select</option>
                <option value="TRUE">True</option>
                <option value="FALSE">False</option>
             </Form.Select>
             </Form.Group>

             <Form.Group controlId="incomeFrequency">
              <Form.Label>Frequency</Form.Label>
              <Form.Select name="frequency" required>
                <option>select</option>
                <option value="One-Time">One-Time</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Loan">Loan</option>
             </Form.Select>
             </Form.Group>

              <Button variant="outline-success" type="submit">
                Submit
              </Button>
              <Button variant="outline-danger" onClick={handleIncomeClose}>
                Cancel
              </Button>
            </Form>
          </div>
        )}
        {showExpenseForm && (
          <div style={{ textAlign: 'center' }}>
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="expenseName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" required />
              </Form.Group>

              <Form.Group controlId="expenseAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" step="0.01" name="amount" required />
              </Form.Group>

              <Form.Group controlId="plannedBool">
              <Form.Label>Planned</Form.Label>
              <Form.Select name="planned" required>
                <option>select</option>
                <option value="TRUE">True</option>
                <option value="FALSE">False</option>
             </Form.Select>
             </Form.Group>

             <Form.Group controlId="expenseFrequency">
              <Form.Label>Frequency</Form.Label>
              <Form.Select name="frequency" required>
                <option>select</option>
                <option value="One-Time">One-Time</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Loan">Loan</option>
             </Form.Select>
             </Form.Group>

              <Button variant="outline-success" type="submit">
                Submit
              </Button>
              <Button variant="outline-danger" onClick={handleExpenseClose}>
                Cancel
              </Button>
            </Form>
          </div>
        )}
      </div>
    </div>
    </Popover.Body>
      </Popover>
      </Overlay>
    </div>
    </div>
    </div>
  );
}

export default CalendarView;
