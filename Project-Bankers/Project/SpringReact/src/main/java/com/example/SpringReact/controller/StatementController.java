package com.example.SpringReact.controller;


import com.example.SpringReact.domain.Statement;
import com.example.SpringReact.service.StatementService;
import com.example.SpringReact.repository.StatementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping
@RequiredArgsConstructor
public class StatementController {

    private final StatementService statementService;

    @Autowired
    private StatementRepository statementRepository;

    @CrossOrigin
    @PostMapping("/users/{userId}/statement")    //create statement for bankuser
    public ResponseEntity<?> save(@PathVariable("userId") Integer userId, @RequestBody Statement statement) {

        return new ResponseEntity<>(statementService.create(userId, statement), HttpStatus.CREATED);

    }

    @CrossOrigin
    @PostMapping("/users/{userId}/statement/recurring/{recurringId}")    //create recurring statement for bankuser.
    public ResponseEntity<?> save(@PathVariable("userId") Integer userId, @PathVariable("recurringId") Integer recurringId, @RequestBody Statement statement) {

        return new ResponseEntity<>(statementService.createRecurring(userId, recurringId, statement), HttpStatus.CREATED);

    }

    @CrossOrigin
    @GetMapping("{userId}/statements")  //return all statements from bank user
    public ResponseEntity<?> getAllStatements(@PathVariable("userId") Integer userId) {

        return new ResponseEntity<>(statementService.getAllStatements(userId), HttpStatus.OK);

    }
    @GetMapping("/statement") //return all statements. I could not get the above to work.
    public List<Statement> getAllStatements(){
        return statementRepository.findAll();
    }

    @CrossOrigin
    @GetMapping("{userId}/recurring/statements/{name}")  //return all statements by name from bank user. Works.
    public ResponseEntity<?> getStatementsByName(@PathVariable("userId") Integer userId, @PathVariable("name") String name) {

        return new ResponseEntity<>(statementService.getStatementsByName(userId, name), HttpStatus.OK);

    }//had to update path to include recurring.

    @CrossOrigin
    @PatchMapping("users/{userId}/statements/{statementId}/{attribute}/{value}")  //update statements. Works.
    public ResponseEntity<?> updateStatements(@PathVariable("userId") Integer userId, @PathVariable("statementId") Integer statementId, @PathVariable("attribute") String attribute, @PathVariable("value") String value) {

        return new ResponseEntity<>(statementService.updateStatements(userId, statementId, attribute, value), HttpStatus.OK);

    }

    @CrossOrigin
    @DeleteMapping("/users/{userId}/statement/{statementId}")  //delete statement by Id. Works.
    public ResponseEntity<?> deleteStatementById(@PathVariable("userId") Integer userId, @PathVariable("statementId") Integer id){
        return new ResponseEntity<>(statementService.deleteStatementByBankuserAndId(userId, id), HttpStatus.OK);
    }//Had to change mapping to get this to work.



}
