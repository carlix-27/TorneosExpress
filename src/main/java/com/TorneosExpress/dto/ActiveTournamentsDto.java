package com.TorneosExpress.dto;

public class ActiveTournamentsDto {
    private Long id;
    private String name;
    private String sport;
    private boolean isPrivate;

    // Constructor
    public ActiveTournamentsDto(TournamentDto tournamentDto, SportDto sportDto) {
        this.id = tournamentDto.getId();
        this.name = tournamentDto.getName();
        this.sport = sportDto.getName();
        this.isPrivate = tournamentDto.getIsPrivate();
    }

    public Long getId(){return id;}

    public String getName(){return name;}

    public String getSport(){return sport;}

    public boolean getIsPrivate(){return isPrivate;}
}

