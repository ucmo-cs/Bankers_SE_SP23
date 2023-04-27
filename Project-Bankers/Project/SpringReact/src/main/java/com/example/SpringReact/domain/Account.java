package com.example.SpringReact.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Account {


    @Id
    private String username;

    private String password;

    private String token;

    private Integer balance;

    private Integer monthlySavingsGoal;

    private Integer monthlyStartingBalance;

    private Integer dailyBudget;

    private Integer avgDailyBudget;

    @OneToOne(targetEntity = BankUser.class)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private BankUser bankuser;

}
