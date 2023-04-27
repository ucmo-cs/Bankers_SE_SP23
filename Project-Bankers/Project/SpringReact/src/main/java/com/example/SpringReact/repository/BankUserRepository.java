package com.example.SpringReact.repository;

import com.example.SpringReact.domain.BankUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;


@Repository
public interface BankUserRepository extends JpaRepository<BankUser,Integer> {

//public BankUser findByName(String username);
}
