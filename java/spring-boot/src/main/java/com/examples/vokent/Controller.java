package com.examples.vokent;

import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.examples.vokent.services.city.City;
import com.examples.vokent.services.city.CityService;
import com.examples.vokent.services.customer.CustomerService;

@RestController
@RequestMapping("/")
public class Controller {

    private final AtomicLong counter = new AtomicLong();
    
    @Autowired
    private CityService cityService;

    @Autowired
    private CustomerService customerService;

    @RequestMapping("greeting")
    public Greeting greeting(@RequestParam(value="name", defaultValue="World") String name) {
        return new Greeting(counter.incrementAndGet(), String.format("Hello, %s!", name));
    }
    
    @RequestMapping(value = "getCities")
    public List<City> getCities() {
        List<City> cities = cityService.findAll();
        return cities;
    }

    @RequestMapping(value = "customer")
    public String Customer() {
        customerService.setMessage("Message by Customer");
        return customerService.getMessage();
    }
}
