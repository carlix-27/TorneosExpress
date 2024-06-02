package com.TorneosExpress.dto;

public class ShortTeamDto {
    private Long id;
    private String name;

    public ShortTeamDto(Long id, String name){
        this.id = id;
        this.name = name;
    }

    public Long getId(){
        return id;
    }

    public String getName(){
        return name;
    }
}
