package com.propertymart.propertymart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PropertymartApplication {

	public static void main(String[] args) {
		SpringApplication.run(PropertymartApplication.class, args);
	}

}
