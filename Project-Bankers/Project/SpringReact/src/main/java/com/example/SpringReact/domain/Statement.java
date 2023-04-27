package com.example.SpringReact.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Entity
    public class Statement {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

        private String name;

        private String amount;

        private String date;

        private String planned;

        private String type;

        private String frequency;

        private String affected;

        @ManyToOne
        @JoinColumn(name = "user_id")
        @JsonIgnore
        private BankUser bankuser;

        @ManyToOne
        @JoinColumn(name = "recurring_id")
        @JsonIgnore
        private Recurring recurring;
    }
