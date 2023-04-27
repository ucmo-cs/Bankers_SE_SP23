package com.example.SpringReact.service;

import com.example.SpringReact.domain.Account;
import com.example.SpringReact.domain.BankUser;
import com.example.SpringReact.domain.Recurring;
import com.example.SpringReact.domain.Statement;
import com.example.SpringReact.repository.BankUserRepository;
import com.example.SpringReact.repository.StatementRepository;
import com.example.SpringReact.repository.RecurringRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class StatementService {

    private final StatementRepository statementRepository;
    private final BankUserRepository bankUserRepository;

    private final RecurringRepository recurringRepository;

    @Transactional
    public Statement create(Integer user_id, Statement statement){

        BankUser bankUser;

        bankUser = bankUserRepository.findById(user_id).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));

        statement.setBankuser(bankUser);
        return statementRepository.save(statement);
    }

    @Transactional
    public Statement createRecurring(Integer user_id, Integer recurring_id, Statement statement){

        BankUser bankUser;

        bankUser = bankUserRepository.findById(user_id).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));

        statement.setBankuser(bankUser);

        Recurring recurring;

        recurring = recurringRepository.findById(recurring_id).orElseThrow(()
                ->new IllegalArgumentException("recurring id does not exists"));

        statement.setRecurring(recurring);

        return statementRepository.save(statement);
    }


    @Transactional
    public List<Statement> getAllStatements(Integer user_id){
        BankUser bankUser;
        bankUser = bankUserRepository.findById(user_id).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));

        return statementRepository.findAllByBankuser(bankUser);

    }

    @Transactional
    public List<Statement> getStatementsByName(Integer user_id, String name){
        BankUser bankUser;
        bankUser = bankUserRepository.findById(user_id).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));

        return statementRepository.findAllByBankuserAndName(bankUser, name);

    }
    @Transactional
    public List<Statement> getStatementsByRecurringsId(Integer user_id, Integer recurring_id){
        BankUser bankUser;
        bankUser = bankUserRepository.findById(user_id).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));

        return statementRepository.findAllByBankuserAndRecurring_id(bankUser, recurring_id);

    }

    @Transactional
    public Statement updateStatements(Integer userID, Integer statementId,String attribute, String value){
        Statement statement = new Statement();
        BankUser bankUser;
        bankUser = bankUserRepository.findById(userID).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));
        for(int i=0;i< bankUser.getStatements().size();i++) {
            if (Objects.equals(bankUser.getStatements().get(i).getId(), statementId)) {
                if(Objects.equals(attribute, "affected")){
                    bankUser.getStatements().get(i).setAffected(value);
                    statement = bankUser.getStatements().get(i);
                }
                if(Objects.equals(attribute, "name")){
                    bankUser.getStatements().get(i).setName(value);
                    statement = bankUser.getStatements().get(i);
                }
                if(Objects.equals(attribute, "amount")){
                    bankUser.getStatements().get(i).setAmount(value);
                    statement = bankUser.getStatements().get(i);
                }
                if(Objects.equals(attribute, "date")){
                    bankUser.getStatements().get(i).setDate(value);
                    statement = bankUser.getStatements().get(i);
                }
                if(Objects.equals(attribute, "planned")){
                    bankUser.getStatements().get(i).setPlanned(value);
                    statement = bankUser.getStatements().get(i);
                }
                if(Objects.equals(attribute, "type")){
                    bankUser.getStatements().get(i).setType(value);
                    statement = bankUser.getStatements().get(i);
                }
            }
        }
        return statement;
    }
    @Transactional
    public String deleteStatementByBankuserAndId(Integer userId, Integer id){
    //get target bank user.
        BankUser bankUser;
        bankUser = bankUserRepository.findById(userId).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));
        //get all statements from bank user.
        List<Statement> statements = bankUser.getStatements();
        //compare statements id to target id.
        for(int i=0;i<statements.size();i++){
            if(Objects.equals(statements.get(i).getId(), id)){
                //delete target.
                statementRepository.deleteById(id);
            }
        }
        return "deleted statement";
    }
}