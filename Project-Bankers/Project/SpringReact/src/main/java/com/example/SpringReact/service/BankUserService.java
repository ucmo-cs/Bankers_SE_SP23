package com.example.SpringReact.service;

import com.example.SpringReact.domain.Account;
import com.example.SpringReact.domain.BankUser;
import com.example.SpringReact.domain.Login;
import com.example.SpringReact.domain.Statement;
import com.example.SpringReact.repository.AccountRepository;
import com.example.SpringReact.repository.BankUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class BankUserService {

    private final BankUserRepository bankUserRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public BankUser create(BankUser bankUser){
        return bankUserRepository.save(bankUser);
    }

    @Transactional
    public Account create(Integer userId, Account account){
        BankUser bankUser;

        bankUser = bankUserRepository.findById(userId).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));

        account.setBankuser(bankUser);

        return accountRepository.save(account);
    }

    @Transactional
    public Optional<Account> getAllAccounts(String user_id){
        return accountRepository.findById(user_id);
    }
    @Transactional
    public Optional<BankUser> getCurrentUser(Integer userId){
        return bankUserRepository.findById(userId);
    }

    @Transactional
    public Optional <Account> updateAccountBalance(String userID, String attribute, Integer value){
        Optional <Account> account;
        account = accountRepository.findById(userID);
        if(Objects.equals(attribute, "balance")){
            account.get().setBalance(value);//add to balance.
        }
        if(Objects.equals(attribute, "dailybudget")){
            account.get().setDailyBudget(value);//add to budget.
        }
        if(Objects.equals(attribute, "avgdailybudget")){
            account.get().setAvgDailyBudget(value);//add to average budget.
        }
        if(Objects.equals(attribute, "monthlysavingsgoal")){
            account.get().setMonthlySavingsGoal(value);//add to balance.
        }
        return account;
    }
    public boolean validateUserLogin(Login login) {
        Optional<Account> account = accountRepository.findById(login.getName());

        if (!account.isPresent()) {
            return false;
        }

        System.out.println("login pass " + login.getPassword());
        System.out.println("database pass " + account.get().getPassword());

        return login.getPassword().equals(account.get().getPassword());
    }

}
