package com.example.SpringReact.controller;
import com.example.SpringReact.domain.BankUser;
import com.example.SpringReact.domain.Login;
import com.example.SpringReact.domain.Account;
import com.example.SpringReact.domain.Statement;
import com.example.SpringReact.service.BankUserService;
import com.example.SpringReact.service.SecurityService;
import com.example.SpringReact.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping
@RequiredArgsConstructor

public class BankUserController {
    private final BankUserService bankUserService;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private SecurityService securityService;

    @CrossOrigin
    @PostMapping("/bankuser")
    public ResponseEntity<?> save(@RequestBody BankUser bankUser) {

        System.out.println("userId " + bankUser.getUsername());
        System.out.println("userPassword " + bankUser.getPassword());
        return new ResponseEntity<>(bankUserService.create(bankUser), HttpStatus.CREATED);


    }

    @CrossOrigin
    @PostMapping("users/{userId}/account")
    public ResponseEntity<?> save(@PathVariable("userId") Integer userId, @RequestBody Account account) {

        System.out.println("userId " + account.getUsername());
        System.out.println("userPassword " + account.getPassword());
        return new ResponseEntity<>(bankUserService.create(userId, account), HttpStatus.CREATED);


    }


    @CrossOrigin
    @GetMapping("{userId}/account")  //return token. ID is username.
    public ResponseEntity<?> getCurrentToken(@PathVariable("userId") String userId) {

        return new ResponseEntity<>(bankUserService.getAllAccounts(userId), HttpStatus.OK);

    }

    @CrossOrigin
    @PatchMapping("{userId}/account/{attribute}/{value}")  //update account balance for current account. Works.
    public ResponseEntity<?> updateAccountBalance(@PathVariable("userId") String userId, @PathVariable("attribute") String attribute, @PathVariable("value") Integer value) {

        return new ResponseEntity<>(bankUserService.updateAccountBalance(userId, attribute, value), HttpStatus.OK);

    }

    @CrossOrigin
    @GetMapping("{userId}/bankuser")  //return bankuser by name.
    public ResponseEntity<?> getCurrentUser(@PathVariable("userId") Integer userId) {

        return new ResponseEntity<>(bankUserService.getCurrentUser(userId), HttpStatus.OK);

    }

    //    public ResponseEntity<Object> validateUserLogin(@RequestBody Login login) {
    @PostMapping("/login")
    @CrossOrigin
    public ResponseEntity<Map<String,Object>> validateUserLogin(@RequestBody Login login) {
        System.out.println("Login Server TEST");
        System.out.println(login.getName());
        System.out.println(login.getPassword());


        String token = securityService.createToken(login.getName(),(1*1000*10));
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("token", token);



        //add current session token
        Optional<Account> account = accountRepository.findById(login.getName());
        //add bankuser id of logged in user. Needed to access statements, account and bankuser.
        String id = account.get().getBankuser().getId().toString();
        map.put("bankuser_id", id);
        //add balance to body. Save to session storage for access across pages.
        String balance = account.get().getBalance().toString();
        map.put("balance", balance);
        //add monthly savings goal to body.
        String monthlySavingsGoal = account.get().getMonthlySavingsGoal().toString();
        map.put("monthlySavingsGoal", monthlySavingsGoal);
        //add monthly starting balance to body.
        String monthlyStartingBalance = account.get().getMonthlyStartingBalance().toString();
        map.put("monthlyStartingBalance", monthlyStartingBalance);
        //add daily budget to body.
        String dailyBudget = account.get().getDailyBudget().toString();
        map.put("dailyBudget", dailyBudget);
        //add average daily budget to body
        String avgDailyBudget = account.get().getAvgDailyBudget().toString();
        map.put("avgDailyBudget", avgDailyBudget);

        account.ifPresent(tokenSetter -> {
            tokenSetter.setToken(token);

            accountRepository.save(tokenSetter);
        });

        System.out.println("validation" + bankUserService.validateUserLogin(login));

        if (bankUserService.validateUserLogin(login)) {
            return ResponseEntity.status(200).body(map);
        }
        return ResponseEntity.status(400).body(null);

    }
}

