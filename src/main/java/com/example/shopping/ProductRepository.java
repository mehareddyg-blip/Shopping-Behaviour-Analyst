package com.example.shopping;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface ProductRepository extends CrudRepository<Product, Integer> {

    List<Product> findByPrice(double price);

    List<Product> findByShippingDays(int shippingDays);

    List<Product> findByCategory(String category);
}