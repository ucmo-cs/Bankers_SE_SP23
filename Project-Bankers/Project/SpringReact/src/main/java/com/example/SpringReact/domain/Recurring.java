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
public class Recurring {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recurring_id")
    private Integer id;

    private String name;

    private Integer amount;

    private String nextPostDate;

    private String planned;

    private String type;

    private String frequency;

    private Integer date;

    private String day;

    private Integer week;

    private Integer payments;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private BankUser bankuser;

    @OneToMany(mappedBy = "recurring", targetEntity = Statement.class,cascade = CascadeType.ALL)
    private List<Statement> statements = new ArrayList<>();
}
