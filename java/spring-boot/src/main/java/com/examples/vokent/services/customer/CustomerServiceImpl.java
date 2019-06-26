package com.examples.vokent.services.customer;

import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImpl implements CustomerService {
    
    String message = new String();

    @Override
    public String getMessage() {
        return message;
    }

    @Override 
    public void setMessage(String message) {
        this.message = message;
    }
}
