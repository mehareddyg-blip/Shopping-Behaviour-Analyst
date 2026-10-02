package com.example.shopping;
import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface EventRepository extends CrudRepository<Event, Long> {
    List<Event> findByTimestampAfter(Instant timestamp);
    @Query(value = """
        SELECT p.category, p.description, p.price
    FROM events e
    JOIN product p ON e.product_id = p.id
    WHERE e.timestamp > :timestamp
    """, nativeQuery = true)
    List<Object[]> findEventSummary(@Param("timestamp") Instant timestamp);
}