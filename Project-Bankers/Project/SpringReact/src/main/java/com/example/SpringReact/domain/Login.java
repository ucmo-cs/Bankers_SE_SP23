package com.example.SpringReact.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class Login {

    private String name;
    private String password;

}