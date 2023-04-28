import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Badge, Alert } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import '../App.css'
import AuthenticateUser from '../App.js'
import Header from '../components/Header'

let activeStatements = "";
let lastMonthDay = 0;
let currentDate = new Date();
let todaysDate = currentDate.getDate();
let todaysMonth = currentDate.getMonth() + 1;
let todaysYear = currentDate.getFullYear();
let year = currentDate.getFullYear();
let month = currentDate.getMonth();
let isLeapYear = false; 
let initialFrequencyType = ""; 
let initialFrequencyDate = 0;
let initialFrequencyDay = "";
let initialFrequencyWeek = 0;
let initialFrequencyPayments = 0;
let plannedSelectBool = "FALSE";
let stopRepeat = true;

const dateStringBuilder=(day,month,year)=>{
  //day from calendar buttons is sent here. Converted to full date string to add to statement post.
  let dateString = "";
  if(month<10){
    dateString = String(year).concat("-").concat("0").concat(String(month)).concat("-").concat(String(day))
  }
  if(month>9){
    dateString = String(year).concat("-").concat(String(month)).concat("-").concat(String(day))
  }
  return dateString;
}

function BalanceView() {

  const [globalBalance, setGlobalBalance] = useState(sessionStorage.getItem('balance'))

  AuthenticateUser()

  useEffect(()=>{
      if(year-4*Math.floor(year/4)===0&&year-100*Math.floor(year/100)!==0){
        isLeapYear=true;
      }
      if(year-400*Math.floor(year/400)===0){
        isLeapYear=true;
      }
      else{
        isLeapYear=false;
      }

      if(month===0){
        lastMonthDay=31
      }
      if(month===1){
        if(isLeapYear===true){
          lastMonthDay=29
        }
        else{
          lastMonthDay=28
        }
      }
      if(month===2){
        lastMonthDay=31
      }
      if(month===3){
        lastMonthDay=30
      }
      if(month===4){
        lastMonthDay=31
      }
      if(month===5){
        lastMonthDay=30
      }
      if(month===6){
        lastMonthDay=31
      }
      if(month===7){
        lastMonthDay=31
      }
      if(month===8){
        lastMonthDay=30
      }
      if(month===9){
        lastMonthDay=31
      }
      if(month===10){
        lastMonthDay=30
      }
      if(month===11){
        lastMonthDay=31
      }
  },[])

  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showRecurringIncomeForm, setShowRecurringIncomeForm] = useState(false);
  const [showRecurringExpenseForm, setShowRecurringExpenseForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [recurrings, setRecurrings] = useState([]);

    //find all statements and fill table with data from current bankuser.
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

    //find all recurrings and fill table with data from current bankuser.
    useEffect(() => {
      const APIallGetRecurring = "http://localhost:8080/"+sessionStorage.getItem('bankuser_id')+"/recurrings";
      const abortController = new AbortController()   //Abort controller
      fetch(APIallGetRecurring, { signal: abortController.signal }) 
      .then((res) => res.json())
      .then((res) => {setRecurrings(res)})                           
        .catch(error => {if (error.name === 'AbortError') return   
          throw error}) 
      return () => {abortController.abort()}
    }, [recurrings])

  const handleIncomeClick = (event) => {
    event.preventDefault();
    setShowIncomeForm(true);
  };

  const handleExpenseClickRecurring = (event) => {
    event.preventDefault();
    setShowRecurringExpenseForm(true);
  };

  const handleIncomeClickRecurring = (event) => {
    event.preventDefault();
    setShowRecurringIncomeForm(true);
  };

  const handleExpenseClick = (event) => {
    event.preventDefault();
    setShowExpenseForm(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const transaction = {
      id: new Date().getTime(),
      date: form.date.value,
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

          const updateAccountBalance = ()=> {
            const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
            const abortController = new AbortController()   
            fetch(updateAccountBalance,{
              signal: abortController.signal,
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
            }).then((res) => res.json())
            .catch(error => {if (error.name === 'AbortError') return   
            throw error}) 
        return () => {abortController.abort()}
          }
          updateAccountBalance();
  
         tempBudget = parseInt(sessionStorage.getItem('dailyBudget'))+ parseInt(transaction.amount)
         sessionStorage.setItem('dailyBudget', tempBudget)
  
        }
        if(transaction.type === "Expense"){
            //update balance in account
            tempBalance = parseInt(sessionStorage.getItem('balance'))-parseInt(transaction.amount)
            sessionStorage.setItem('balance', tempBalance)
            setGlobalBalance(tempBalance)

            const updateAccountBalance=() => {
                const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
                const abortController = new AbortController() 
                fetch(updateAccountBalance, {
                  signal: abortController.signal,
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json"
                   },
                  })  
                  .then((res) => res.json())
                  .catch(error => {
                    if (error.name === 'AbortError') return    
                    throw error
                  })       
                return () => {abortController.abort()}
              }
              updateAccountBalance();
          
            tempBudget = parseInt(sessionStorage.getItem('dailyBudget'))-parseInt(transaction.amount)
            sessionStorage.setItem('dailyBudget', tempBudget)
        }

        const updateAccountBudget=() => {
            const updateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
            const abortController = new AbortController()
            fetch(updateAccountBudget, { 
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
          updateAccountBudget();
      }
    
    //post data to database associated with current bankuser.
    const APIpost=() => {
      const APIpost = "http://localhost:8080/users/"+sessionStorage.getItem('bankuser_id')+"/statement"; 
      const abortController = new AbortController()
      fetch(APIpost, { 
        signal: abortController.signal,
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
        .catch(error => {
          if (error.name === 'AbortError') return 
          throw error
        })    
      return () => {abortController.abort()}
    }
    APIpost()
  };
  

  const dateSelect = (event) =>{
    initialFrequencyDate = event;
    initialFrequencyDay = null;
    initialFrequencyWeek = null;
  }

  const daySelect = (event) =>{
    initialFrequencyDay = event;
    initialFrequencyDate = null;
  }

  const weekSelect = (event) =>{
    initialFrequencyWeek = event;
    initialFrequencyDate = null;
  }

  const plannedSelect = (event) =>{
    plannedSelectBool = event;
  }

  const calculatePostDate = (type, date, day, week) =>{ 
    //for calculations after the initial value type = frequency.

    let currentDate = new Date();//initialize to current date.
    let targetDate = new Date();
    let found = true;
    let foundDate = new Date();

    if(type === "Weekly"){//increment increases by 1 each time but currentDate gets reset each time so date increases exponesionaly
      while(found){
        targetDate.setDate(targetDate.getDate()+1)
        if(String(targetDate).slice(0,3)===day.slice(0,3)){
          found = false;
        }
      }
      foundDate = targetDate;
    }
    if(type === "Bi-Weekly"){
      while(found){
        targetDate.setDate(targetDate.getDate()+1)
        if(String(targetDate).slice(0,3)===day.slice(0,3)){
          found = false;
        }
      }
      targetDate.setDate(targetDate.getDate()+7);
      foundDate = targetDate;
    }

    if(type === "Monthly"||type==="Loan"){

      if(date===null){
        //if date is null this means "by day and week" was selected.
        let nestedFound = true;
        while(found){
          //find first month day.
          targetDate.setDate(targetDate.getDate()-1)
          if(String(targetDate).slice(8,10)==="01"){
            while(nestedFound){
              //find first target day.
              targetDate.setDate(targetDate.getDate()+1)
              if(String(targetDate).slice(0,3)===day.slice(0,3)){
                found = false;
                nestedFound = false;
              }
            }
          }
        }
        found = true;
        nestedFound = true;
        //check if next post date is before current day. If yes, recalculate for next month.
        if(currentDate.getDay()>targetDate.getDay()){
          while(found){
            //find next first month day.
            targetDate.setDate(targetDate.getDate()+1)
            if(String(targetDate).slice(8,10)==="01"){
              while(nestedFound){
                //find first target day of target month day.
                targetDate.setDate(targetDate.getDate()+1)
                if(String(targetDate).slice(0,3)===day.slice(0,3)){
                  found = false;
                  nestedFound = false;
                }
              }
            }
          }
        }
        //increment day by selected week*7
        targetDate.setDate(targetDate.getDate()+7*(week-1));
        foundDate = targetDate;
        }
      
      else{
        found = true;
        //this means monthly by "date" was selected.
        //check if target day is today.
        if(String(currentDate).slice(8,10)!==date){
        while(found){
          //find next day that matches selected day by number.
          targetDate.setDate(targetDate.getDate()+1)
          //string date is single digit if under 10.
          if(String(targetDate).slice(8,10)===String(date)){
            found = false;
          }
        }
        }
        foundDate = targetDate;
      }
    }

    let currentMonthNumber = String(foundDate).slice(4,7);
    let nextPostMonth = "";

    if(currentMonthNumber === "Jan"){
      nextPostMonth = "1";
    }
    if(currentMonthNumber === "Feb"){
      nextPostMonth = "2";
    }
    if(currentMonthNumber === "Mar"){
      nextPostMonth = "3";
    }
    if(currentMonthNumber === "Apr"){
      nextPostMonth = "4";
    }
    if(currentMonthNumber === "May"){
      nextPostMonth = "5";
    }
    if(currentMonthNumber === "Jun"){
      nextPostMonth = "6";
    }
    if(currentMonthNumber === "Jul"){
      nextPostMonth = "7";
    }
    if(currentMonthNumber === "Aug"){
      nextPostMonth = "8";
    }
    if(currentMonthNumber === "Sep"){
      nextPostMonth = "9";
    }
    if(currentMonthNumber === "Oct"){
      nextPostMonth = "10";
    }
    if(currentMonthNumber === "Nov"){
      nextPostMonth = "11";
    }
    if(currentMonthNumber === "Dec"){
      nextPostMonth = "12";
    }
    let nextPostYear = String(foundDate).slice(11,15);
    let nextPostDay = String(foundDate).slice(8,10);
    let dateString = dateStringBuilder(nextPostDay,nextPostMonth,nextPostYear)

    checkStatements();
    return dateString;
  }

  const handleFormSubmitRecurring = (event) => {

    event.preventDefault();
    stopRepeat = true;
    const form = event.target;
    const recurring = {
      id: new Date().getTime(),
      nextPostDate: calculatePostDate(initialFrequencyType, initialFrequencyDate, initialFrequencyDay, initialFrequencyWeek),
      name: form.name.value,
      type: showRecurringIncomeForm ? 'Income' : 'Expense',
      planned: plannedSelectBool,
      frequency: initialFrequencyType,
      date: initialFrequencyDate,
      day: initialFrequencyDay,
      week: initialFrequencyWeek,
      payments: initialFrequencyPayments,
      amount: form.amount.value,
    };

    setRecurrings([...recurrings, recurring]);
    setShowRecurringIncomeForm(false);
    setShowRecurringExpenseForm(false);

    //post recurring data to database associated with current bankuser.
    const APIpostRecurring=() => {
      const APIpostRecurring = "http://localhost:8080/users/"+sessionStorage.getItem('bankuser_id')+"/recurring"; 
      const abortController = new AbortController()
      fetch(APIpostRecurring, { 
        signal: abortController.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: recurring.name,
          nextPostDate: recurring.nextPostDate,
          type: recurring.type,
          planned: recurring.planned,
          frequency: recurring.frequency,
          date: recurring.date,
          day: recurring.day,
          week: recurring.week,
          payments: recurring.payments,
          amount: recurring.amount
        })
      }).then((res) => res.json())
        .catch(error => {
          if (error.name === 'AbortError') return 
          throw error
        })    
      return () => {abortController.abort()}
    }
    APIpostRecurring()

    let typeBool = "FALSE"
    if(recurring.type === "Income"){
      typeBool = "FALSE"
    }
    if(recurring.type === "Expense"){
      typeBool = "TRUE"
    }
   
    if(recurring.frequency==="Weekly"){
      let budget = parseInt(sessionStorage.getItem('dailyBudget'));
      let recurAmount = parseInt(recurring.amount)/7;
      let tempDaily = 0;
      if(typeBool==="FALSE"){
        tempDaily = Math.round(budget+recurAmount);
      }
      if(typeBool==="TRUE"){
        tempDaily = Math.round(budget-recurAmount);
      }

      const APIupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempDaily
      const updateAccountBudget=() => {
        const abortController = new AbortController()
        fetch(APIupdateAccountBudget, { 
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
        updateAccountBudget();

         sessionStorage.setItem('dailyBudget', tempDaily)

         const APIavgupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/avgdailybudget/"+tempDaily
         const avgupdateAccountBudget=() => {
           const abortController = new AbortController()
           fetch(APIavgupdateAccountBudget, { 
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
           avgupdateAccountBudget();
         sessionStorage.setItem('avgDailyBudget', tempDaily)

    }
    if(recurring.frequency==="Bi-Weekly"){
      let budget = parseInt(sessionStorage.getItem('dailyBudget'));
      let recurAmount = parseInt(recurring.amount)/14;
      let tempDaily = 0;
      if(typeBool==="FALSE"){
        tempDaily = Math.round(budget+recurAmount);
      }
      if(typeBool==="TRUE"){
        tempDaily = Math.round(budget-recurAmount);
      }


      const APIupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempDaily
      const updateAccountBudget=() => {
        const abortController = new AbortController()
        fetch(APIupdateAccountBudget, { 
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
      updateAccountBudget();

      sessionStorage.setItem('dailyBudget', tempDaily)

      const APIavgupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/avgdailybudget/"+tempDaily
      const avgupdateAccountBudget=() => {
        const abortController = new AbortController()
        fetch(APIavgupdateAccountBudget, { 
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
        avgupdateAccountBudget();
      sessionStorage.setItem('avgDailyBudget', tempDaily)
    }
    if(recurring.frequency==="Monthly"){
      let budget = parseInt(sessionStorage.getItem('dailyBudget'));
      let recurAmount = parseInt(recurring.amount)/lastMonthDay;
      let tempDaily = 0;
      if(typeBool==="FALSE"){
        tempDaily = Math.round(budget+recurAmount);
      }
      if(typeBool==="TRUE"){
        tempDaily = Math.round(budget-recurAmount);
      }

      const APIupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempDaily
      const updateAccountBudget=() => {
        const abortController = new AbortController()
        fetch(APIupdateAccountBudget, { 
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
      updateAccountBudget();

      sessionStorage.setItem('dailyBudget', tempDaily)

        const APIavgupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/avgdailybudget/"+tempDaily
         const avgupdateAccountBudget=() => {
           const abortController = new AbortController()
           fetch(APIavgupdateAccountBudget, { 
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
           avgupdateAccountBudget();
         sessionStorage.setItem('avgDailyBudget', tempDaily)
    }
  };

  
  const handleIncomeClose = (event) => {
    event.preventDefault();
    setShowIncomeForm(false);
  };

  const handleExpenseClose = (event) => {
    event.preventDefault();
    setShowExpenseForm(false);
  };

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
          const APIupdateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
          const updateAccountBalance=() => {
            const abortController = new AbortController()
            fetch(APIupdateAccountBalance, { 
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
          updateAccountBalance();
        }
        if(transaction.type==="Expense"){
          let tempDaily = parseInt(sessionStorage.getItem('balance'));
          let tempAmout = parseInt(transaction.amount);
          let tempBalance = tempDaily + tempAmout;

          sessionStorage.setItem('balance', tempBalance)
          setGlobalBalance(tempBalance)
          const APIupdateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
          const updateAccountBalance=() => {
            const abortController = new AbortController()
            fetch(APIupdateAccountBalance, { 
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
          updateAccountBalance();
        }
      }
      {
        //if one-time, this means it affected budget. Undo this affect.
        if(transaction.type === "Income"){

          let tempDailyBudget = parseInt(sessionStorage.getItem('dailyBudget'));
          let tempAmout = parseInt(transaction.amount);
          let tempBudget = tempDailyBudget - tempAmout;

          sessionStorage.setItem('dailyBudget', tempBudget)

        //update daily budget
        
        const APIupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
        const updateAccountBudget=() => {
          const abortController = new AbortController()
          fetch(APIupdateAccountBudget, { 
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
        updateAccountBudget();

        const APIavgupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/avgdailybudget/"+tempBudget
        const avgupdateAccountBudget=() => {
          const abortController = new AbortController()
          fetch(APIavgupdateAccountBudget, { 
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
          avgupdateAccountBudget();
        sessionStorage.setItem('avgDailyBudget', tempBudget)

        }
        if(transaction.type === "Expense"){

          let tempDailyBudget = parseInt(sessionStorage.getItem('dailyBudget'));
          let tempAmout = parseInt(transaction.amount);
          let tempBudget = tempDailyBudget + tempAmout;

          sessionStorage.setItem('dailyBudget', tempBudget)

        //update daily budget
        const APIupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
        const updateAccountBudget=() => {
          const abortController = new AbortController()
          fetch(APIupdateAccountBudget, { 
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
        updateAccountBudget();

        const APIavgupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/avgdailybudget/"+tempBudget
        const avgupdateAccountBudget=() => {
          const abortController = new AbortController()
          fetch(APIavgupdateAccountBudget, { 
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
          avgupdateAccountBudget();
        sessionStorage.setItem('avgDailyBudget', tempBudget)
        }
      }
    }


    return "statement deleted"})

    setTransactions(transactions.filter((transaction) => transaction.id !== id));

    //delete data from database based on current user.
    const APIdelete=() => {
      const APIdelete = "http://localhost:8080/users/"+sessionStorage.getItem('bankuser_id')+"/statement/"+id;
      const abortController = new AbortController()
      fetch(APIdelete, { 
        signal: abortController.signal,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      }).then((res) => res.text())
        .catch(error => {
          if (error.name === 'AbortError') return 
          throw error
        })    
      return () => {abortController.abort()}
    }
    APIdelete();

  };

  const handleIncomeCloseRecurring = (event) => {
    event.preventDefault();
    setShowRecurringIncomeForm(false);
  };

  const handleExpenseCloseRecurring = (event) => {
    event.preventDefault();
    setShowRecurringExpenseForm(false);
  };

  const handleDeleteRecurring = (id) => {

    recurrings.filter(recurring=>{
      if(recurring.id === id){

        if(recurring.frequency==="Weekly"){
          let tempAmout = parseInt(recurring.amount);
          let budget = parseInt(sessionStorage.getItem('dailyBudget'));
          let tempBudget = 0;
          if(recurring.type === "Income"){
            tempBudget = Math.round(budget-tempAmout/7);
          }
          if(recurring.type === "Expense"){
            tempBudget = Math.round(budget+tempAmout/7);
          }

          const APIupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
          const updateAccountBudget=() => {
            const abortController = new AbortController()
            fetch(APIupdateAccountBudget, { 
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
          updateAccountBudget();
             sessionStorage.setItem('dailyBudget', tempBudget)
             
             const APIavgupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/avgdailybudget/"+tempBudget
             const avgupdateAccountBudget=() => {
               const abortController = new AbortController()
               fetch(APIavgupdateAccountBudget, { 
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
               avgupdateAccountBudget();
             sessionStorage.setItem('avgDailyBudget', tempBudget)
        }
        if(recurring.frequency==="Bi-Weekly"){
          let tempAmout = parseInt(recurring.amount);
          let budget = parseInt(sessionStorage.getItem('dailyBudget'));
          let tempBudget = 0;
          if(recurring.type === "Income"){
            tempBudget = Math.round(budget-tempAmout/14);
          }
          if(recurring.type === "Expense"){
            tempBudget = Math.round(budget+tempAmout/14);
          }
    
          const APIupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
          const updateAccountBudget=() => {
            const abortController = new AbortController()
            fetch(APIupdateAccountBudget, { 
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
          updateAccountBudget();
             sessionStorage.setItem('dailyBudget', tempBudget)
             
             const APIavgupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/avgdailybudget/"+tempBudget
             const avgupdateAccountBudget=() => {
               const abortController = new AbortController()
               fetch(APIavgupdateAccountBudget, { 
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
               avgupdateAccountBudget();
             sessionStorage.setItem('avgDailyBudget', tempBudget)
        }
        if(recurring.frequency==="Monthly"){
          let tempAmout = parseInt(recurring.amount);
          let budget = parseInt(sessionStorage.getItem('dailyBudget'));
          let tempBudget = 0;
          if(recurring.type === "Income"){
            tempBudget = Math.round(budget-tempAmout/lastMonthDay);
          }
          if(recurring.type === "Expense"){
            tempBudget = Math.round(budget+tempAmout/lastMonthDay);
          }

          const APIupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
          const updateAccountBudget=() => {
            const abortController = new AbortController()
            fetch(APIupdateAccountBudget, { 
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
          updateAccountBudget();
             sessionStorage.setItem('dailyBudget', tempBudget)

             const APIavgupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/avgdailybudget/"+tempBudget
             const avgupdateAccountBudget=() => {
               const abortController = new AbortController()
               fetch(APIavgupdateAccountBudget, { 
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
               avgupdateAccountBudget();
             sessionStorage.setItem('avgDailyBudget', tempBudget)
        }
      }
      
      return "recurring deleted"})
  
    setRecurrings(recurrings.filter((recurring) => recurring.id !== id));

    //delete recurring data from database based on current user.

    const APIdeleteRecurring=() => {
      const APIdeleteRecurring = "http://localhost:8080/users/"+sessionStorage.getItem('bankuser_id')+"/recurring/"+id;
      const abortController = new AbortController()
      fetch(APIdeleteRecurring, { 
        signal: abortController.signal,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then((res) => res.text())
        .catch(error => {
          if (error.name === 'AbortError') return 
          throw error
        })    
      return () => {abortController.abort()}
    }
    APIdeleteRecurring();

  };

  const [recurringByMonth, setRecurringByMonth] = useState(false);
  const [recurringByWeekDay, setRecurringByWeekDay] = useState(false);
  const [recurringByWeekNumber, setRecurringByWeekNumber] = useState(false);
  const [recurringType, setRecurringType] = useState(false);
  const recurringSelect = (event) => {
    if(event === "Weekly"){
      setRecurringByWeekDay(true);
      setRecurringType(false)
      setRecurringByMonth(false);
      initialFrequencyType = "Weekly";
      initialFrequencyDate = null;
      initialFrequencyWeek = null;
      initialFrequencyPayments = null;
    }
    if(event === "Bi-Weekly"){
      setRecurringByWeekDay(true);
      setRecurringType(false)
      setRecurringByMonth(false);
      initialFrequencyType = "Bi-Weekly";
      initialFrequencyDate = null;
      initialFrequencyWeek = null;
      initialFrequencyPayments = null;
    }
    if(event === "RecurringMonthly"){
      setRecurringByMonth(true);
      setRecurringByWeekDay(false);
      setRecurringByWeekNumber(false);
    }
    if(event === "RecurringByDayWeek"){
      setRecurringByWeekDay(true);
      setRecurringByWeekNumber(true);
      setRecurringByMonth(false);
    }

    if(event === "Monthly"){
      setRecurringType(true)
      setRecurringByMonth(false);
      setRecurringByWeekDay(false);
      setRecurringByWeekNumber(false);
      initialFrequencyType = "Monthly";
      initialFrequencyPayments = null;
    }
    if(event === "Select"){
      setRecurringByMonth(false);
      setRecurringByWeekDay(false);
      setRecurringByWeekNumber(false);
      setRecurringType(false)
    }
  };

  //This checks on page load for recurrings that need to be posted.
   const recurringDailyCheck = () => {
    if(!stopRepeat){
      return;
    }

    let currentDateTemp = new Date();
    let dayTemp = currentDateTemp.getDate();
    if(dayTemp<10){
      dayTemp = (String(0).concat(String(dayTemp)))
    }
    let monthTemp = currentDateTemp.getMonth()+1;
    let yearTemp = currentDateTemp.getFullYear();
    let stringTemp = dateStringBuilder(dayTemp, monthTemp, yearTemp)
    recurrings.filter(recurring=>{
      if(recurring.nextPostDate === stringTemp){
        console.log("Recurring found!")
        stopRepeat = false;
      //post recurring statement to database associated with current bankuser and recurrings.

      const APIpostRecurringStatement=() => {
      const APIpostRecurringStatement = "http://localhost:8080/users/"+sessionStorage.getItem('bankuser_id')+"/statement/recurring/"+ recurring.id; 
      const abortController = new AbortController()
      fetch(APIpostRecurringStatement, { 
        signal: abortController.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: recurring.name,
          date: recurring.nextPostDate,
          type: recurring.type,
          planned: recurring.planned,
          frequency: recurring.frequency,
          amount: recurring.amount,
          affected: "TRUE"
        })
      })
        .catch(error => {
          if (error.name === 'AbortError') return 
          throw error
        })    
      return () => {abortController.abort()}
    }
    APIpostRecurringStatement();

    let updateNextPostDate = calculatePostDate(recurring.frequency, recurring.date, recurring.day, recurring.week)
    //recalculate next post date

  const updateNextPostDateURL = () => {
  const updateNextPostDateURL = "http://localhost:8080/users/"+sessionStorage.getItem('bankuser_id')+"/recurring/"+recurring.id+"/nextPostDate/"+String(updateNextPostDate)
  const abortController = new AbortController()
  fetch(updateNextPostDateURL, { 
    signal: abortController.signal,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
  }).then((res) => {
    if(res.status === 200){
let tempBalance = 0;
let tempBudget = 0;

if(recurring.type === "Income"){
//update balance in account
tempBalance = parseInt(sessionStorage.getItem('balance'))+parseInt(recurring.amount)
sessionStorage.setItem('balance', tempBalance)
setGlobalBalance(tempBalance)

const updateAccountBalance = ()=> {
const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
const abortController = new AbortController()   
fetch(updateAccountBalance,{
  signal: abortController.signal,
  method: "PATCH",
  headers: {
    "Content-Type": "application/json"
  },
}).then((res) => res.json())
.catch(error => {if (error.name === 'AbortError') return   
throw error}) 
return () => {abortController.abort()}
}
updateAccountBalance();

tempBudget = parseInt(sessionStorage.getItem('dailyBudget'))+ parseInt(recurring.amount)
sessionStorage.setItem('dailyBudget', tempBudget)

}
if(recurring.type === "Expense"){

//update balance in account
tempBalance = parseInt(sessionStorage.getItem('balance'))-parseInt(recurring.amount)
sessionStorage.setItem('balance', tempBalance)
setGlobalBalance(tempBalance)

const updateAccountBalance=() => {
    const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
    const abortController = new AbortController() 
    fetch(updateAccountBalance, {
      signal: abortController.signal,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
       },
      })  
      .then((res) => res.json())
      .catch(error => {
        if (error.name === 'AbortError') return    
        throw error
      })       
    return () => {abortController.abort()}
  }
  updateAccountBalance();

tempBudget = parseInt(sessionStorage.getItem('dailyBudget'))-parseInt(recurring.amount)
sessionStorage.setItem('dailyBudget', tempBudget)
}

const updateAccountBudget=() => {
const updateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
const abortController = new AbortController()
fetch(updateAccountBudget, { 
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
updateAccountBudget();




    }})
    .catch(error => {
      if (error.name === 'AbortError') return 
      throw error
    })    
  return () => {abortController.abort()}
}
updateNextPostDateURL();


    //deincrement payments
    if(recurring.frequency==="Loan"){
      const updatePaymentsURL =() => {
        const updatePaymentsURL = "http://localhost:8080/users/"+sessionStorage.getItem('bankuser_id')+"/recurring/"+recurring.id+"/payments/"+(recurring.payments-1)
        const abortController = new AbortController()
        fetch(updatePaymentsURL, { 
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
      updatePaymentsURL();
      

    }
      }
    return "recurring posted"})
  }//make sure this only happen once.

  useEffect(()=>{
    recurringDailyCheck();
  },[recurrings])

  const [isActive, setIsActive] = useState(false)
  
  const highlightRow = (event, ownedByRecurring) =>{
    if(event === isActive){
    setIsActive(false)
    }
    else{
      setIsActive(event)
      activeStatements = "";
      let tempArray = []
      tempArray = ownedByRecurring;
      for(let i=0;i<tempArray.length;i++){
        activeStatements = activeStatements.concat(String(tempArray[i].id)+",")
      }
    }
  }

  //this updated session storage twice.
const checkStatements = () => {//this checks if an upcoming statement takes affect today.

  const APIallGet=() => {
      const APIallGet = "http://localhost:8080/"+sessionStorage.getItem('bankuser_id')+"/statements";
      const abortController = new AbortController()
      fetch(APIallGet, { signal: abortController.signal })
      .then((res) => res.json())
      .then((res) => {

        let stringTemp = dateStringBuilder(todaysDate, todaysMonth, todaysYear)
        let tempBalance = 0;
        let tempBudget = 0;
        
      
        res.filter(transaction=>{
      
          if(transaction.date === stringTemp && transaction.affected === "FALSE" && transaction.frequency === "One-Time"){
          //update statement affected.
      
          const updateStatementAffected = () =>{
            const updateStatementAffected = "http://localhost:8080/users/"+sessionStorage.getItem('bankuser_id')+"/statements/" +transaction.id+ "/affected/TRUE"
            const abortController = new AbortController()
            fetch(updateStatementAffected, {
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
          updateStatementAffected();

            if(transaction.type === "Income"){
              //update balance in account
              tempBalance = parseInt(sessionStorage.getItem('balance'))+parseInt(transaction.amount)
              sessionStorage.setItem('balance', tempBalance)
              setGlobalBalance(tempBalance)

              updateAccountBudget();
      
             tempBudget = parseInt(sessionStorage.getItem('dailyBudget'))+ parseInt(transaction.amount)
             sessionStorage.setItem('dailyBudget', tempBudget)
      
            }
            if(transaction.type === "Expense"){
                //update balance in account
                tempBalance = parseInt(sessionStorage.getItem('balance'))-parseInt(transaction.amount)
                sessionStorage.setItem('balance', tempBalance)
                setGlobalBalance(tempBalance)
        
                const updateAccountBalance =() => {
                  const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+tempBalance
                  const abortController = new AbortController()
                  fetch(updateAccountBalance, { 
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
                updateAccountBalance();
              
                tempBudget = parseInt(sessionStorage.getItem('dailyBudget'))-parseInt(transaction.amount)
                sessionStorage.setItem('dailyBudget', tempBudget)
            }

            updateAccountBudget();
          
          } return "balance updated"})



          const APIupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempBudget
          const updateAccountBudget =() => {
            const abortController = new AbortController()
            fetch(APIupdateAccountBudget, { 
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

      }).catch(error => {
          if (error.name === 'AbortError') return 
          throw error
        })    
      return () => {abortController.abort()}
    }
    APIallGet();
}
useEffect(() => {
  checkStatements()
},[])

  return (
    <div><Header/>
    <div>
      <div>Account Balance: <Badge bg="secondary">${globalBalance}</Badge></div>
      <br/><br/>
      <div style={{ textAlign: 'center' }}>
      <Alert variant = "secondary" style={{ fontSize: "20px", background: "#d6f5d6" }}>Statements</Alert>
      <div className='balanceStyle'>
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
            {transactions.map((transaction, index) => (
              <tr key={index} style={
                activeStatements.includes(String(transaction.id)) === true
                  ? { background: '#99ebff' }
                  : { background: 'white' }}>
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
        </div><br/>
        <div style={{ textAlign: 'center'}}>
        <Button style={{ width: '130px' }} variant="outline-success" onClick={handleIncomeClick}>
          Add Income
        </Button>
        <Button style={{ width: '130px' }} variant="outline-success" onClick={handleExpenseClick}>
          Add Expense
        </Button>
      </div>
       <br/>

      {showIncomeForm && (
        <div className='inputForm'>
          <br/>
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
       
             <Form.Group controlId="incomeDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" required />
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
        <div className='inputForm'>
        <br/>
      <Form onSubmit={handleFormSubmit} >
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

        <Form.Group controlId="expenseDate">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" name="date" required />
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

<Alert variant = "secondary" style={{ fontSize: "20px", background: "#d6f5d6" }}>Recurring</Alert>
        <div className='balanceStyle'>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Income/Expense</th>
              <th>Planned</th>
              <th>Frequency</th>
              <th>Next Post Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recurrings.map((recurring, index) => (
              <tr key={index} style={
                isActive === index
                  ? { background: '#99ebff' }
                  : { background: 'white' }}
                  onClick={() => highlightRow(index, recurrings[index].statements)}>
                <td>{recurring.name}</td>
                <td>{recurring.amount}</td>
                <td>{recurring.type}</td>
                <td>{recurring.planned}</td>
                {recurring.payments!==null&&recurring.date!=null&&recurring.frequency!=="Weekly"&&recurring.frequency!=="Bi-Weekly"&&(
                <td>{recurring.frequency}: Date: {recurring.date} Remaining: {recurring.payments}</td>
                )}
                {recurring.payments!==null&&recurring.date==null&&recurring.frequency!=="Weekly"&&recurring.frequency!=="Bi-Weekly"&&(
                <td>{recurring.frequency}: Day: {recurring.day} Week: {recurring.week} Remaining: {recurring.payments}</td>
                )}
                {recurring.payments===null&&recurring.date!==null&&recurring.frequency!=="Weekly"&&recurring.frequency!=="Bi-Weekly"&&(
                <td>{recurring.frequency}: Date: {recurring.date}</td>
                )}
                {recurring.payments===null&&recurring.date===null&&recurring.frequency!=="Weekly"&&recurring.frequency!=="Bi-Weekly"&&(
                <td>{recurring.frequency}: Day: {recurring.day} Week: {recurring.week}</td>
                )}
                {recurring.frequency==="Weekly"&&(
                <td>{recurring.frequency}: Day: {recurring.day} </td>
                )}
                {recurring.frequency==="Bi-Weekly"&&(
                <td>{recurring.frequency}: Day: {recurring.day} </td>
                )}
                <td>{recurring.nextPostDate}</td>
                <td>
                  <Button variant="outline-danger" onClick={() => handleDeleteRecurring(recurring.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      </div><br/>

      <div style={{ textAlign: 'center' }}>
        <Button style={{ width: '130px' }} variant="outline-success" onClick={handleIncomeClickRecurring}>
          Add Income
        </Button>
        <Button style={{ width: '130px' }} variant="outline-success" onClick={handleExpenseClickRecurring}>
          Add Expense
        </Button>
      </div><br/>

      {showRecurringIncomeForm && (
        <div style={{width: '335px',paddingLeft: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <br/>
          <Form onSubmit={handleFormSubmitRecurring}>
            <Form.Group controlId="incomeName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" required />
            </Form.Group>

            <Form.Group controlId="incomeAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" step="0.01" name="amount" required />
            </Form.Group>

            <Dropdown onSelect={plannedSelect} required>
              <Dropdown.Toggle id="planned" style = {{width: "335px"}} variant = "outline-secondary">Planned</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey = "TRUE">True</Dropdown.Item>
                <Dropdown.Item eventKey = "FALSE">False</Dropdown.Item>
             </Dropdown.Menu>
             </Dropdown>

            <>
            <Dropdown onSelect={recurringSelect} required>
              <Dropdown.Toggle id = "frequency" style = {{width: "335px"}} variant = "outline-secondary">Frequency</Dropdown.Toggle>
              <Dropdown.Menu>
              <Dropdown.Item eventKey="Select">Select</Dropdown.Item>
                <Dropdown.Item eventKey="Weekly">Weekly</Dropdown.Item>
                <Dropdown.Item eventKey="Bi-Weekly">Bi-Weekly</Dropdown.Item>
                <Dropdown.Item eventKey="Monthly">Monthly</Dropdown.Item>
             </Dropdown.Menu>
             </Dropdown>
             </>

            {recurringType &&(
            <Dropdown  onSelect={recurringSelect} required>
            <Dropdown.Toggle id="recurringType" style = {{width: "335px"}} variant = "outline-secondary">Chose Recurring Type</Dropdown.Toggle>
            <Dropdown.Menu>
            <Dropdown.Item eventKey="Select">Select</Dropdown.Item>
              <Dropdown.Item eventKey="RecurringMonthly">Recurring Monthly By Date</Dropdown.Item>
              <Dropdown.Item eventKey="RecurringByDayWeek">Recurring Monthly By Day and Week</Dropdown.Item>
           </Dropdown.Menu>
           </Dropdown>
            )}

            {recurringByMonth && (
              <Dropdown name="date" required onSelect={dateSelect}>
              <Dropdown.Toggle id="date" style = {{width: "335px"}} variant = "outline-secondary">select day to post</Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item eventKey="01">1st</Dropdown.Item>
                <Dropdown.Item eventKey="02">2nd</Dropdown.Item>
                <Dropdown.Item eventKey="03">3rd</Dropdown.Item>
                <Dropdown.Item eventKey="04">4th</Dropdown.Item>
                <Dropdown.Item eventKey="05">5th</Dropdown.Item>
                <Dropdown.Item eventKey="06">6th</Dropdown.Item>
                <Dropdown.Item eventKey="07">7th</Dropdown.Item>
                <Dropdown.Item eventKey="08">8th</Dropdown.Item>
                <Dropdown.Item eventKey="09">9th</Dropdown.Item>
                <Dropdown.Item eventKey="10">10th</Dropdown.Item>
                <Dropdown.Item eventKey="11">11th</Dropdown.Item>
                <Dropdown.Item eventKey="12">12th</Dropdown.Item>
                <Dropdown.Item eventKey="13">13th</Dropdown.Item>
                <Dropdown.Item eventKey="14">14th</Dropdown.Item>
                <Dropdown.Item eventKey="15">15th</Dropdown.Item>
                <Dropdown.Item eventKey="16">16th</Dropdown.Item>
                <Dropdown.Item eventKey="17">17th</Dropdown.Item>
                <Dropdown.Item eventKey="18">18th</Dropdown.Item>
                <Dropdown.Item eventKey="19">19th</Dropdown.Item>
                <Dropdown.Item eventKey="20">20th</Dropdown.Item>
                <Dropdown.Item eventKey="21">21st</Dropdown.Item>
                <Dropdown.Item eventKey="22">22nd</Dropdown.Item>
                <Dropdown.Item eventKey="23">23rd</Dropdown.Item>
                <Dropdown.Item eventKey="24">24th</Dropdown.Item>
                <Dropdown.Item eventKey="25">25th</Dropdown.Item>
                <Dropdown.Item eventKey="26">26th</Dropdown.Item>
                <Dropdown.Item eventKey="27">27th</Dropdown.Item>
                <Dropdown.Item eventKey="28">28th</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
                )}
                {recurringByWeekDay && (
                 <Dropdown name="day" required onSelect={daySelect}>
                  <Dropdown.Toggle id="day" style = {{width: "335px"}} variant = "outline-secondary">select day of week</Dropdown.Toggle>
                  <Dropdown.Menu>
                     <Dropdown.Item eventKey="Sunday">Sunday</Dropdown.Item>
                     <Dropdown.Item eventKey="Monday">Monday</Dropdown.Item>
                     <Dropdown.Item eventKey="Tuesday">Tuesday</Dropdown.Item>
                     <Dropdown.Item eventKey="Wednesday">Wednesday</Dropdown.Item>
                     <Dropdown.Item eventKey="Thursday">Thursday</Dropdown.Item>
                     <Dropdown.Item eventKey="Friday">Friday</Dropdown.Item>
                     <Dropdown.Item eventKey="Saturday">Saturday</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                  )}
                  {recurringByWeekNumber &&(
                    <Dropdown name="week" required onSelect={weekSelect}>
                   <Dropdown.Toggle id="week" style = {{width: "335px"}} variant = "outline-secondary">select week</Dropdown.Toggle>
                    <Dropdown.Menu>
                       <Dropdown.Item eventKey="1">1st</Dropdown.Item>
                       <Dropdown.Item eventKey="2">2nd</Dropdown.Item>
                       <Dropdown.Item eventKey="3">3rd</Dropdown.Item>
                       <Dropdown.Item eventKey="4">4th</Dropdown.Item>
                      </Dropdown.Menu>
                      </Dropdown>
                    )}

            <Button variant="outline-success" type="submit">
          Submit
        </Button>
        <Button variant="outline-danger" onClick={handleIncomeCloseRecurring}>
          Cancel
        </Button>
      </Form>
    </div>
  )}
  {showRecurringExpenseForm && (
        <div style={{width: '335px',paddingLeft: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        <br/>
      <Form onSubmit={handleFormSubmitRecurring}>
        <Form.Group controlId="expenseName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" required />
        </Form.Group>

        <Form.Group controlId="expenseAmount">
          <Form.Label>Amount</Form.Label>
          <Form.Control type="number" step="0.01" name="amount" required />
        </Form.Group>

        <Dropdown onSelect={plannedSelect} required>
              <Dropdown.Toggle id="planned" style = {{width: "335px"}} variant = "outline-secondary">Planned</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey = "TRUE">True</Dropdown.Item>
                <Dropdown.Item eventKey = "FALSE">False</Dropdown.Item>
             </Dropdown.Menu>
             </Dropdown>

        <>
            <Dropdown onSelect={recurringSelect} required>
              <Dropdown.Toggle id = "frequency" style = {{width: "335px"}} variant = "outline-secondary">Frequency</Dropdown.Toggle>
              <Dropdown.Menu>
              <Dropdown.Item eventKey="Select">Select</Dropdown.Item>
                <Dropdown.Item eventKey="Weekly">Weekly</Dropdown.Item>
                <Dropdown.Item eventKey="Bi-Weekly">Bi-Weekly</Dropdown.Item>
                <Dropdown.Item eventKey="Monthly">Monthly</Dropdown.Item>
             </Dropdown.Menu>
             </Dropdown>
             </>


            {recurringType &&(
           <Dropdown  onSelect={recurringSelect} required>
            <Dropdown.Toggle id="recurringType" style = {{width: "335px"}} variant = "outline-secondary">Chose Recurring Type</Dropdown.Toggle>
            <Dropdown.Menu>
            <Dropdown.Item eventKey="Select">Select</Dropdown.Item>
              <Dropdown.Item eventKey="RecurringMonthly">Recurring Monthly By Date</Dropdown.Item>
              <Dropdown.Item eventKey="RecurringByDayWeek">Recurring Monthly By Day and Week</Dropdown.Item>
           </Dropdown.Menu>
           </Dropdown>
            )}

            {recurringByMonth && (
                  <Dropdown name="date" required onSelect={dateSelect}>
                  <Dropdown.Toggle id="date" style = {{width: "335px"}} variant = "outline-secondary">select day to post</Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item eventKey="01">1st</Dropdown.Item>
                    <Dropdown.Item eventKey="02">2nd</Dropdown.Item>
                    <Dropdown.Item eventKey="03">3rd</Dropdown.Item>
                    <Dropdown.Item eventKey="04">4th</Dropdown.Item>
                    <Dropdown.Item eventKey="05">5th</Dropdown.Item>
                    <Dropdown.Item eventKey="06">6th</Dropdown.Item>
                    <Dropdown.Item eventKey="07">7th</Dropdown.Item>
                    <Dropdown.Item eventKey="08">8th</Dropdown.Item>
                    <Dropdown.Item eventKey="09">9th</Dropdown.Item>
                    <Dropdown.Item eventKey="10">10th</Dropdown.Item>
                    <Dropdown.Item eventKey="11">11th</Dropdown.Item>
                    <Dropdown.Item eventKey="12">12th</Dropdown.Item>
                    <Dropdown.Item eventKey="13">13th</Dropdown.Item>
                    <Dropdown.Item eventKey="14">14th</Dropdown.Item>
                    <Dropdown.Item eventKey="15">15th</Dropdown.Item>
                    <Dropdown.Item eventKey="16">16th</Dropdown.Item>
                    <Dropdown.Item eventKey="17">17th</Dropdown.Item>
                    <Dropdown.Item eventKey="18">18th</Dropdown.Item>
                    <Dropdown.Item eventKey="19">19th</Dropdown.Item>
                    <Dropdown.Item eventKey="20">20th</Dropdown.Item>
                    <Dropdown.Item eventKey="21">21st</Dropdown.Item>
                    <Dropdown.Item eventKey="22">22nd</Dropdown.Item>
                    <Dropdown.Item eventKey="23">23rd</Dropdown.Item>
                    <Dropdown.Item eventKey="24">24th</Dropdown.Item>
                    <Dropdown.Item eventKey="25">25th</Dropdown.Item>
                    <Dropdown.Item eventKey="26">26th</Dropdown.Item>
                    <Dropdown.Item eventKey="27">27th</Dropdown.Item>
                    <Dropdown.Item eventKey="28">28th</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                )}
                     {recurringByWeekDay && (
                 <Dropdown name="day" required onSelect={daySelect}>
                  <Dropdown.Toggle id="day" style = {{width: "335px"}} variant = "outline-secondary">select day of week</Dropdown.Toggle>
                  <Dropdown.Menu>
                     <Dropdown.Item eventKey="Sunday">Sunday</Dropdown.Item>
                     <Dropdown.Item eventKey="Monday">Monday</Dropdown.Item>
                     <Dropdown.Item eventKey="Tuesday">Tuesday</Dropdown.Item>
                     <Dropdown.Item eventKey="Wednesday">Wednesday</Dropdown.Item>
                     <Dropdown.Item eventKey="Thursday">Thursday</Dropdown.Item>
                     <Dropdown.Item eventKey="Friday">Friday</Dropdown.Item>
                     <Dropdown.Item eventKey="Saturday">Saturday</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                  )}
                  {recurringByWeekNumber &&(
                    <Dropdown name="week" required onSelect={weekSelect}>
                   <Dropdown.Toggle id="week" style = {{width: "335px"}} variant = "outline-secondary">select week</Dropdown.Toggle>
                    <Dropdown.Menu>
                       <Dropdown.Item eventKey="1">1st</Dropdown.Item>
                       <Dropdown.Item eventKey="2">2nd</Dropdown.Item>
                       <Dropdown.Item eventKey="3">3rd</Dropdown.Item>
                       <Dropdown.Item eventKey="4">4th</Dropdown.Item>
                      </Dropdown.Menu>
                      </Dropdown>
                    )}
  
        <Button variant="outline-success" type="submit">
          Submit
        </Button>
        <Button variant="outline-danger" onClick={handleExpenseCloseRecurring}>
          Cancel
        </Button>
      </Form>
    </div>
  )}


</div>
</div>
);
}

export default BalanceView;
