package com.TorneosExpress.dto;

public class MyTeamsDataDto {
    private Long id;
    private String name;
    private String location;
    private boolean isPrivate;

    public MyTeamsDataDto(Long id, String name, String location, boolean isPrivate){
        this.id = id;
        this.name = name;
        this.location = location;
        this.isPrivate = isPrivate;
    }

    public Long getId(){
        return id;
    }
    public String getName(){
        return name;
    }

    public String getLocation(){
        return location;
    }

    public boolean getIsPrivate(){
        return isPrivate;
    }
}
