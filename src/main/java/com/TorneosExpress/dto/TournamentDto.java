package com.TorneosExpress.dto;

import com.TorneosExpress.model.Difficulty;
import com.TorneosExpress.model.Sport;

public class TournamentDto {
    private Long id;
    private Long creatorId;
    private String name;
    private String location;
    private Sport sport;
    private boolean isPrivate;
    private Difficulty difficulty;
    private boolean isActive;
    private int maxTeams;

    public TournamentDto(Long id, Long creatorId, String name, String location, Sport sport, boolean isPrivate, Difficulty difficulty, boolean isActive){
        this.id = id;
        this.creatorId = creatorId;
        this.name = name;
        this.location = location;
        this.sport = sport;
        this.isPrivate = isPrivate;
        this.difficulty = difficulty;
        this.isActive = isActive;
    }


    public TournamentDto(int maxTeams){
        this.maxTeams = maxTeams;
    }

    public Long getId(){
        return id;
    }

    public Long getCreatorId(){return creatorId;}

    public int getMaxTeams() {
        return maxTeams;
    }

    //public int getActualTeams(){ return actualTeams;}

    public String getName(){
        return name;
    }

    public String getLocation(){
        return location;
    }

    public Sport getSport(){return sport;}

    public boolean getIsPrivate(){return isPrivate;}

    public Difficulty getDifficulty(){return difficulty;}

    public boolean getIsActive(){
        return isActive;
    }

}
