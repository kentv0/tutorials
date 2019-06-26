package com.examples.vokent;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;

@Configuration
@ImportResource({
    "CustomerService-context.xml",
    "CityService-context.xml"})
public class BeanConfig {
}
