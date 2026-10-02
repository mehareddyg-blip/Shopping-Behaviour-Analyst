package com.example.shopping;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShoppingService {

    @Autowired
    private ProductRepository productRepo;
    @Autowired
    private EventRepository eventRepo;

    public List<Product> getAllProducts(String filter) {

        Iterable<Product> products = productRepo.findAll();

        // If no filter is provided, return all products
        if (filter == null || filter.trim().isEmpty()) {
            return StreamSupport.stream(products.spliterator(), false)
                    .collect(Collectors.toList());
        }

        String search = filter.toLowerCase();

        return StreamSupport.stream(products.spliterator(), false)
        .filter(product ->
            product.getDescription().toLowerCase().contains(search)
            || product.getCategory().toLowerCase().contains(search)
            || String.valueOf(product.getPrice()).contains(search)
            || String.valueOf(product.getShippingDays()).contains(search)
    )
                .collect(Collectors.toList());
    }

    public Event saveEvent(Event event) {
        return eventRepo.save(event);
    }

    public List<Event> getEventsByTime(int hours) {
        Instant timeFromNow = Instant.now().minus(hours, ChronoUnit.HOURS);
        return eventRepo.findByTimestampAfter(timeFromNow);
    }

    public List<Object[]> getEventSummary(int hours) {
        Instant timeFromNow = Instant.now().minus(hours, ChronoUnit.HOURS);
        return eventRepo.findEventSummary(timeFromNow);
    }
}