package com.example.SpringReact.repository;

import com.example.SpringReact.domain.Account;
import com.example.SpringReact.domain.BankUser;
import com.example.SpringReact.domain.Statement;
import com.example.SpringReact.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account,String> {

   // public List<Account> findAllByBankuser(Account account);
}
