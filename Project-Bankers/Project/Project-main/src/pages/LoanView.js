import React, { useState, useReducer } from 'react';
import { Form, Button, Badge } from "react-bootstrap";
import "./LoanView.css";
import AuthenticateUser from '../App.js'
import Header from '../components/Header'

//amount is an integer. It is getting rounded. Perhaps change to float.

//this doesn't account for savings goal. Loan must check the savings goal.
//"The Personal Loan Estimator should offer advice to the user, informing them when a specific
//loan would cause their monthly savings to drop below their savings goal or worse, below zero."

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

function LoanView() {

    AuthenticateUser()

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [repaymentTerm, setRepaymentTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [savingsAdvice, setSavingsAdvice] = useState("");

  const formattedCurrency = (value) => {
    return `$${value.toFixed(2)}`;
  };
  
  const initialFrequency = {type: "", date: 0, day: "", week: 0, payments: 0 };
  const [frequencyObject, setfrequencyObject] = useReducer(
  (frequencyObject, updates) => ({ ...frequencyObject, ...updates }),
  initialFrequency
);
  const [afterCalculation, setAfterCalculation] = useState(false)
  const [postSelected, setPostSelected] = useState(false)
  const [recurringByMonth, setRecurringByMonth] = useState(false);
  const [recurringByWeekDay, setRecurringByWeekDay] = useState(false);
  const [recurringByWeekNumber, setRecurringByWeekNumber] = useState(false);
  const [recurringType, setRecurringType] = useState(false);
  const [submitShow, setSubmitShow] = useState(false);

  const selectPost = (event) => {
    event.preventDefault();
    if(event.target.value==="Yes"){
      setSubmitShow(true)
      setPostSelected(true);
      setRecurringType(true);
    }
    if(event.target.value==="No"){
      setSubmitShow(false)
      setPostSelected(false);
      setRecurringType(false);
    }
  }
  const dateSelect = (event) =>{
    setfrequencyObject({date: event.target.value});
    setfrequencyObject({day: null});
    setfrequencyObject({week: null});
  }

  const daySelect = (event) =>{
    setfrequencyObject({day: event.target.value});
    setfrequencyObject({date: null});
  }

  const weekSelect = (event) =>{
    setfrequencyObject({week: event.target.value});
    setfrequencyObject({date: null});
  }

  const handleClose = (event) =>{
    event.preventDefault();
    setRecurringByMonth(false)
    setRecurringByWeekDay(false)
    setRecurringByWeekNumber(false)
    setPostSelected(false)
    setSubmitShow(false)
  }

  const recurringSelect = (event) => {
    if(event.target.value === "RecurringMonthly"){
      setRecurringByMonth(true);
      setRecurringByWeekDay(false);
      setRecurringByWeekNumber(false);
    }
    if(event.target.value === "RecurringByDayWeek"){
      setRecurringByWeekDay(true);
      setRecurringByWeekNumber(true);
      setRecurringByMonth(false);
    }
    if(event.target.value === "Select"){
      setRecurringByMonth(false);
      setRecurringByWeekDay(false);
      setRecurringByWeekNumber(false);
      setRecurringType(false)
    }
  };

  const calculatePostDate = (date, day, week) =>{ 
    //for calculations after the initial value type = frequency.

    let currentDate = new Date();//initialize to current date.
    let targetDate = new Date();
    let found = true;
    let foundDate = new Date();

      if(date==null){
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

    return dateString;
    
  }

  
  const calculateLoan = (event) => {
    event.preventDefault();
    setAfterCalculation(true)
    // Convert inputs to numbers
    const amount = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const term = parseFloat(repaymentTerm);

    // Calculate monthly payment
    const monthly = (amount * rate) / (1 - Math.pow(1 + rate, -term));
    setMonthlyPayment(monthly);

    // Calculate total payment
    const total = monthly * term;
    setTotalPayment(total);

    // Calculate total interest
    const interest = total - amount;
    setTotalInterest(interest);

    let dividedBudget = parseInt(sessionStorage.getItem('dailyBudget'));
    let dividedPayment = (monthly/30);
    let comparisonValue = dividedPayment/dividedBudget;

    if(comparisonValue<0){
      setSavingsAdvice("The loan payments are greater than your average daily budget. Do not take out loan.")
    }
    if(comparisonValue>0&&comparisonValue<0.25){
      setSavingsAdvice("The loan payments are " +Math.round(100*comparisonValue)+"% of your average daily budget. You may be able to afford this loan.")
    }
    if(comparisonValue>0.25&&comparisonValue<0.5){
      setSavingsAdvice("The loan payments are " +Math.round(100*comparisonValue)+"% of your average daily budget. You may not be able to afford this loan.")
    }
    if(comparisonValue>0.5&&comparisonValue<0.75){
      setSavingsAdvice("The loan payments are " +Math.round(100*comparisonValue)+"% of your average daily budget. It is unlikely that you can afford this loan.")
    }
    if(comparisonValue>0.75&&comparisonValue<1){
      setSavingsAdvice("The loan payments are " +Math.round(100*comparisonValue)+"% of your average daily budget. It is unlikely that you can afford this loan.")
    }
    if(comparisonValue>1){
      setSavingsAdvice("The loan payments are greater than your entire average daily budget. Do not take out loan")
    }
  };

  const handleFormSubmitRecurring = (event) => {

    event.preventDefault();
    const form = event.target;
    const recurring = {//post loan to recurring
      id: new Date().getTime(),
      nextPostDate: calculatePostDate(frequencyObject.date, frequencyObject.day, frequencyObject.week),
      name: form.name.value,
      type: "Expense",
      planned: "TRUE",
      frequency: "Loan",
      date: frequencyObject.date,
      day: frequencyObject.day,
      week: frequencyObject.week,
      payments: repaymentTerm,
      amount: monthlyPayment,
    };

    const today = new Date();
    const transaction = {//post loan amount to statement as a one-time income.
      id: new Date().getTime(),
      date: dateStringBuilder(today.getDate(), today.getMonth()+1, today.getFullYear()), //does month need +1?
      name: recurring.name,
      type: 'Income',
      planned: 'TRUE',
      frequency: "Loan",
      amount: loanAmount,
      affected: "TRUE",
    };

    //post recurring data to database associated with current bankuser.
    const postRecurring = () =>{
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
      })
      .then((res) => res.json())
      .catch(error => {
        if (error.name === 'AbortError') return 
        throw error
      })    
    return () => {abortController.abort()}
    }
    postRecurring();

    const post = () =>{
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
          affected: transaction.affected
        })
      })
      .then((res) => res.json())
      .catch(error => {
        if (error.name === 'AbortError') return 
        throw error
      })    
    return () => {abortController.abort()}
    }
    post();

    //update balance in account.
    const updateAccountBalance = ()=>{
      let tempSessionBalance = sessionStorage.getItem('balance')
      let updateValue = parseInt(tempSessionBalance) + parseInt(loanAmount);
      const updateAccountBalance = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/balance/"+updateValue
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

    //update session storage.
    let newBalance = parseInt(sessionStorage.getItem('balance'))+parseInt(loanAmount);
    sessionStorage.setItem('balance', newBalance)

    let lastMonthDay = 0;
    let isLeapYear = false;
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();

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

    let avgbudget = parseInt(sessionStorage.getItem('avgDailyBudget'));
    let avgrecurAmount = parseInt(recurring.amount)/lastMonthDay;
    let avgtempDaily = Math.round(avgbudget+avgrecurAmount);
    const APIupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/avgdailybudget/"+avgtempDaily
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
       sessionStorage.setItem('avgDailyBudget', avgtempDaily)

       let budget = parseInt(sessionStorage.getItem('dailyBudget'));
       let recurAmount = parseInt(loanAmount)
       let tempDaily = budget+recurAmount;
      
       const APIavgupdateAccountBudget = "http://localhost:8080/"+sessionStorage.getItem('CurrentUser')+"/account/dailybudget/"+tempDaily
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
          sessionStorage.setItem('dailyBudget', tempDaily)

          setSubmitShow(false);
          setRecurringByMonth(false);
          setRecurringByWeekDay(false);
          setRecurringByWeekNumber(false);
          setPostSelected(false);
          setRecurringType(false);
          setAfterCalculation(false);
  };


  return (
<div><Header/>
  <div>      
    Account Balance: <Badge bg="secondary">${sessionStorage.getItem('balance')}</Badge>
  <br/><br/><br/>
  
    <div className='inputForm'>
      <h1>Loan Estimator</h1>
      <form onSubmit={calculateLoan}>
        <label htmlFor="loan-amount">Loan amount:</label>
        <input
          type="number"
          id="loan-amount"
          value={loanAmount}
          onChange={(event) => setLoanAmount(event.target.value)}
          required
        />

        <label htmlFor="interest-rate">Interest rate:</label>
        <input
          type="number"
          id="interest-rate"
          value={interestRate}
          onChange={(event) => setInterestRate(event.target.value)}
          required
        />

        <label htmlFor="repayment-term">Repayment term (in months):</label>
        <input
          type="number"
          id="repayment-term"
          value={repaymentTerm}
          onChange={(event) => setRepaymentTerm(event.target.value)}
          required
        />
        <button type="submit">Calculate</button>
      </form>

      {monthlyPayment > 0 && (
        <div>
          <h2>Results:</h2>
          <p>Monthly payment: {formattedCurrency(monthlyPayment)}</p>
          <p>Total payment: {formattedCurrency(totalPayment)}</p>
          <p>Total interest: {formattedCurrency(totalInterest)}</p>
        </div>
      )}

    {savingsAdvice && (
        <div>
          <h2>Savings Advice:</h2>
          <p>{savingsAdvice}</p>
        </div>
      )}
    </div>
    

          {afterCalculation && (

        <div className='inputForm'>
        <br/>
        <Form onSubmit={handleFormSubmitRecurring}>
          <Form.Group controlId="incomeName">
          <Form.Label>Post to recurring statements?</Form.Label>
          <Form.Select name="recurringType" placeholder="select" onChange={selectPost} required>
          <option value="Select">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </Form.Select>
          </Form.Group>
          

          {postSelected &&(//frequency is always loan. Planned is always true. Type is always expense.
            <Form.Group controlId="incomeName">
             <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" required />
              </Form.Group>
          )}
           {recurringType &&(
            <Form.Group controlId="recurringType">
            <Form.Label>Chose Recurring Type</Form.Label>
            <Form.Select name="recurringType" placeholder="select" onChange={recurringSelect} required>
            <option value="Select">Select</option>
              <option value="RecurringMonthly">Recurring Monthly By Date</option>
              <option value="RecurringByDayWeek">Recurring Monthly By Day and Week</option>
           </Form.Select>
           </Form.Group>
            )}
            {recurringByMonth && (
              <Form.Group controlId="incomeFrequencyMonth">
                <Form.Select name="day" required onChange={dateSelect}>
                <option>select day to post</option>
                <option value="01">1st</option>
                <option value="02">2nd</option>
                <option value="03">3rd</option>
                <option value="04">4th</option>
                <option value="05">5th</option>
                <option value="06">6th</option>
                <option value="07">7th</option>
                <option value="08">8th</option>
                <option value="09">9th</option>
                <option value="10">10th</option>
                <option value="11">11th</option>
                <option value="12">12th</option>
                <option value="13">13th</option>
                <option value="14">14th</option>
                <option value="15">15th</option>
                <option value="16">16th</option>
                <option value="17">17th</option>
                <option value="18">18th</option>
                <option value="19">19th</option>
                <option value="20">20th</option>
                <option value="21">21st</option>
                <option value="22">22nd</option>
                <option value="23">23rd</option>
                <option value="24">24th</option>
                <option value="25">25th</option>
                <option value="26">26th</option>
                <option value="27">27th</option>
                <option value="28">28th</option>
                </Form.Select>
                </Form.Group>
                )}
                {recurringByWeekDay && (
                 <Form.Group controlId="incomeFrequencyDay">
                  <Form.Select name="day" required onChange={daySelect}>
                     <option>select day of week</option>
                     <option value="Sunday">Sunday</option>
                     <option value="Monday">Monday</option>
                     <option value="Tuesday">Tuesday</option>
                     <option value="Wednesday">Wednesday</option>
                     <option value="Thursday">Thursday</option>
                     <option value="Friday">Friday</option>
                     <option value="Saturday">Saturday</option>
                    </Form.Select>
                    </Form.Group>
                  )}
                  {recurringByWeekNumber &&(
                    <Form.Group controlId="incomeFrequencyWeek">
                    <Form.Select name="week" required onChange={weekSelect}>
                      <option>select week</option>
                       <option value="1">1st</option>
                       <option value="2">2nd</option>
                       <option value="3">3rd</option>
                       <option value="4">4th</option>
                      </Form.Select>
                      </Form.Group>
                    )}
                    {submitShow && (
                      <>
                      <Button variant="outline-success" type="submit">
                       Submit
                      </Button>
                      <Button variant="outline-danger" onClick={handleClose}>
                      Cancel
                      </Button>
                      </>
                    )}
        </Form>
       </div>
        )}
    </div>
    '</div>
    
  );
}

export default LoanView;

