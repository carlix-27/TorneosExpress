package com.TorneosExpress.model;

import jakarta.persistence.*;

@Entity
public class Article {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long article_id;

  @Column()
  private String article_name;

  @Column()
  private String description;

  @Column()
  private float price;

}
