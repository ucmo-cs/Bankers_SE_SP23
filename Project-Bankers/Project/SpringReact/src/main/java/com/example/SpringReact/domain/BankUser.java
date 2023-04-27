package com.example.SpringReact.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class BankUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    private String password;

    private String username;

    @OneToMany(mappedBy = "bankuser")
    private List<Statement> statements = new ArrayList<>();

    @OneToMany(mappedBy = "bankuser")
    private List<Recurring> recurrings = new ArrayList<>();

    @OneToOne(mappedBy = "bankuser", targetEntity = Account.class)
    private Account account;

}

