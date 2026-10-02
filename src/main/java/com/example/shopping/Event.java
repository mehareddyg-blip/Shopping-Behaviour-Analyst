package com.example.shopping;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="events")
public class Event {

    @Id
    private long eventId;
    private Instant timestamp;
    
    private String type;
    private int productId;
    private double timeSpent;
}