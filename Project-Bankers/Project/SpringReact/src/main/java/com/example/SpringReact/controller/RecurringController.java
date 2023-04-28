package com.example.SpringReact.controller;


import com.example.SpringReact.domain.BankUser;
import com.example.SpringReact.domain.Statement;
import com.example.SpringReact.domain.Recurring;
import com.example.SpringReact.repository.BankUserRepository;
import com.example.SpringReact.service.StatementService;
import com.example.SpringReact.service.RecurringService;
import com.example.SpringReact.repository.StatementRepository;
import com.example.SpringReact.repository.RecurringRepository;
import javassist.compiler.ast.Variable;
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
public class RecurringController {

    private final RecurringService recurringService;
    private final StatementService statementService;
    @Autowired
    private RecurringRepository recurringRepository;

    @Autowired
    private StatementRepository statementRepository;

    @Autowired
    private BankUserRepository bankUserRepository;

    @CrossOrigin
    @PostMapping("/users/{userId}/recurring")    //create recurring for bankuser. Works.
    public ResponseEntity<?> save(@PathVariable("userId") Integer userId, @RequestBody Recurring recurring) {

        return new ResponseEntity<>(recurringService.create(userId, recurring), HttpStatus.CREATED);

    }

    @CrossOrigin
    @GetMapping("{userId}/recurrings")  //return all recurrings. Works.
    public ResponseEntity<?> getAllRecurrings(@PathVariable("userId") Integer userId) {

        return new ResponseEntity<>(recurringService.getAllRecurrings(userId), HttpStatus.OK);

    }
    @GetMapping("/recurring") //return all recurrings. Works. //not needed
    public List<Recurring> getAllRecurrings(){
        return recurringRepository.findAll();
    }

    @CrossOrigin
    @GetMapping("users/{userId}/recurrings/{name}")  //return all recurrings by name from bank user. Does Not Works. Not needed.
    public ResponseEntity<?> getRecurringsByName(@PathVariable("userId") Integer userId, @PathVariable("name") String name) {

        return new ResponseEntity<>(recurringService.getRecurringsByName(userId, name), HttpStatus.OK);

    }
    @CrossOrigin
    @GetMapping("{userId}/recurrings/statements/{recurringId}")  //return all statements by recurring_id. Works.
    public ResponseEntity<?> getStatementsByRecurringsId(@PathVariable("userId") Integer userId, @PathVariable("recurringId") Integer recurring_id) {

        return new ResponseEntity<>(statementService.getStatementsByRecurringsId(userId, recurring_id), HttpStatus.OK);

    }

    @CrossOrigin
    @GetMapping("users/{userId}/recurrings/{recurringId}")  //return recurring by recurring_id. Works
    public ResponseEntity<?> getRecurringsById(@PathVariable("userId") Integer userId, @PathVariable("recurringId") Integer recurring_id) {

        return new ResponseEntity<>(recurringService.getRecurringsById(userId, recurring_id), HttpStatus.OK);

    }

    @CrossOrigin
    @PatchMapping("users/{userId}/recurring/{recurringId}/{attribute}/{value}")  //update recurrings by recurring_id.
    public ResponseEntity<?> updateRecurringsByIdAttribute(@PathVariable("userId") Integer userId, @PathVariable("recurringId") Integer recurring_id, @PathVariable("attribute") String attribute, @PathVariable("value") String value) {

        return new ResponseEntity<>(recurringService.updateRecurringsByIdAttribute(userId, recurring_id, attribute, value), HttpStatus.OK);

    }


    @CrossOrigin
    @DeleteMapping("/users/{userId}/recurring/{recurringId}")  //delete recurring by Id. Works.
    public ResponseEntity<?> deleteRecurringById(@PathVariable("userId") Integer userId, @PathVariable("recurringId") Integer id){
        //because the recurring to be deleted owns statements, it deletes those owned statements with cascading.
        //We must repost.
        //get statements owned by recurring to be deleted.
        List<Statement> statements = statementService.getStatementsByRecurringsId(userId, id);
        //repost statements unowned by recurring.
        for(int i = 0; i < statements.size(); i++) {
        Statement statement = new Statement();
        statement.setName(statements.get(i).getName().toString());
        statement.setDate(statements.get(i).getDate());
        statement.setAmount(statements.get(i).getAmount());
        statement.setFrequency(statements.get(i).getFrequency());
        statement.setPlanned(statements.get(i).getPlanned());
        statement.setType(statements.get(i).getType());
        BankUser bankUser;
        bankUser = bankUserRepository.findById(userId).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));
        statement.setBankuser(bankUser);
        //do not set recurring so it is null.
        statementRepository.save(statement);
        }
        return new ResponseEntity<>(recurringService.deleteRecurringById(userId, id), HttpStatus.OK);
    }

}
