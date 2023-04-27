package com.example.SpringReact.repository;

import com.example.SpringReact.domain.BankUser;
import com.example.SpringReact.domain.Statement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatementRepository extends JpaRepository<Statement,Integer>{

    public List<Statement> findAllByBankuser(BankUser bankUser);
    public List<Statement> findAllByBankuserAndName(BankUser bankUser, String name);

    List<Statement> findAllByBankuserAndRecurring_id(BankUser bankUser, Integer recurring_id);

}
