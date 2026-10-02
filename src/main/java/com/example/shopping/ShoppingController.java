package com.example.shopping;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ShoppingController {

    @Autowired
    private ShoppingService shoppingService;


    @GetMapping("/product")
    public List<Product> getAllProducts(
            @RequestParam(required = false, defaultValue = "") String filter) {

        return shoppingService.getAllProducts(filter.toLowerCase());
    }

    @PostMapping("/events")
    public Event createEvent(@RequestBody Event event) {
        return shoppingService.saveEvent(event);
    }

    @GetMapping("/events")
    public List<Event> getEventsByTime(@RequestParam int hours){
        return shoppingService.getEventsByTime(hours);
    }

    @GetMapping("/events/summary")
    public List<Object[]> getEventSummary(@RequestParam int hours){
        return shoppingService.getEventSummary(hours);
    }
}