package com.example.SpringReact.repository;

import com.example.SpringReact.domain.BankUser;
import com.example.SpringReact.domain.Recurring;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecurringRepository extends JpaRepository<Recurring,Integer> {

    public List<Recurring> findAllByBankuser(BankUser bankUser);

    List<Recurring> findAllByBankuserAndName(BankUser bankUser, String name);

    List<Recurring> findAllByBankuserAndId(BankUser bankUser, Integer id);
}
