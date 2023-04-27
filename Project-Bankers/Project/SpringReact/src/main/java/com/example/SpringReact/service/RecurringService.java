package com.example.SpringReact.service;

import com.example.SpringReact.domain.BankUser;
import com.example.SpringReact.domain.Recurring;
import com.example.SpringReact.domain.Statement;
import com.example.SpringReact.repository.BankUserRepository;
import com.example.SpringReact.repository.RecurringRepository;
import com.example.SpringReact.repository.StatementRepository;
import javassist.compiler.ast.Variable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@Service
public class RecurringService {

    private final StatementRepository statementRepository;

    private final RecurringRepository recurringRepository;
    private final BankUserRepository bankUserRepository;

    @Transactional
    public Recurring create(Integer user_id, Recurring recurring){

        BankUser bankUser;

        bankUser = bankUserRepository.findById(user_id).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));

        recurring.setBankuser(bankUser);
        return recurringRepository.save(recurring);
    }


    @Transactional
    public List<Recurring> getAllRecurrings(Integer user_id){
        BankUser bankUser;
        bankUser = bankUserRepository.findById(user_id).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));

        return recurringRepository.findAllByBankuser(bankUser);

    }

    @Transactional
    public List<Recurring> getRecurringsById(Integer user_id, Integer recurring_id){
        BankUser bankUser;
        bankUser = bankUserRepository.findById(user_id).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));

        return recurringRepository.findAllByBankuserAndId(bankUser, recurring_id);

    }


    @Transactional
    public List<Recurring> updateRecurringsByIdAttribute(Integer user_id, Integer recurring_id, String attribute, String value){//not list, only one at a time?
        //get target bank user.
        BankUser bankUser;
        bankUser = bankUserRepository.findById(user_id).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));
        //get all recurrings from bank user.
        //compare recurrings id to target id.
        for(int i=0;i< bankUser.getRecurrings().size();i++){
            if(Objects.equals(bankUser.getRecurrings().get(i).getId(), recurring_id)){
                if(Objects.equals(attribute, "amount")){
                    bankUser.getRecurrings().get(i).setAmount(Integer.valueOf(value));
                }
                if(Objects.equals(attribute, "date")){
                    bankUser.getRecurrings().get(i).setDate(Integer.valueOf(value));
                }
                if(Objects.equals(attribute, "day")){
                    bankUser.getRecurrings().get(i).setDay(value);
                }
                if(Objects.equals(attribute, "frequency")){
                    bankUser.getRecurrings().get(i).setFrequency(value);
                }
                if(Objects.equals(attribute, "name")){
                    bankUser.getRecurrings().get(i).setName(value);
                }
                if(Objects.equals(attribute, "nextPostDate")){
                    bankUser.getRecurrings().get(i).setNextPostDate(value);
                }
                if(Objects.equals(attribute, "payments")){
                    bankUser.getRecurrings().get(i).setPayments(Integer.valueOf(value));
                }
                if(Objects.equals(attribute, "planned")){
                    bankUser.getRecurrings().get(i).setPlanned(value);
                }
                if(Objects.equals(attribute, "type")){
                    bankUser.getRecurrings().get(i).setType(value);
                }
                if(Objects.equals(attribute, "week")){
                    bankUser.getRecurrings().get(i).setWeek(Integer.valueOf(value));
                }
            }
        }

        return recurringRepository.findAllByBankuserAndId(bankUser, recurring_id);

    }

    @Transactional
    public List<Recurring> getRecurringsByName(Integer user_id, String name){
        BankUser bankUser;
        bankUser = bankUserRepository.findById(user_id).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));

        return recurringRepository.findAllByBankuserAndName(bankUser, name);

    }


    @Transactional
    public String deleteRecurringById(Integer userId, Integer id){


        //get target bank user.
        BankUser bankUser;
        bankUser = bankUserRepository.findById(userId).orElseThrow(()
                ->new IllegalArgumentException("bankUser id does not exists"));
        //get all recurrings from bank user.
        List<Recurring> recurrings = bankUser.getRecurrings();
        //compare recurrings id to target id.
        for(int i=0;i<recurrings.size();i++){
            if(Objects.equals(recurrings.get(i).getId(), id)){
                //delete target.
                System.out.println(id);
                recurringRepository.deleteById(id);
            }
        }
        return "deleted statement";
    }
    }
