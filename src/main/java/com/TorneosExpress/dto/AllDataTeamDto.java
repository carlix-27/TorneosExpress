package com.TorneosExpress.dto;

import com.TorneosExpress.model.Difficulty;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.model.Team;

import java.util.List;
import java.util.stream.Collectors;

public class AllDataTeamDto {

    private Long id;
    private Long creatorId;
    private String name;
    private String location;
    private Sport sport;
    private boolean isPrivate;
    private Difficulty difficulty;
    private boolean isActive;
    private int maxTeams;
    private List<ShortTeamDto> participatingTeamsShortData;
    private List<ShortTeamDto> participationRequestsShortData;



    public AllDataTeamDto(Long id, Long creatorId, String name, String location, Sport sport, boolean isPrivate, Difficulty difficulty, boolean isActive, int maxTeams, List<Team> participatingTeams, List<Team> participationRequests) {
        this.id = id;
        this.creatorId = creatorId;
        this.name = name;
        this.location = location;
        this.sport = sport;
        this.isPrivate = isPrivate;
        this.difficulty = difficulty;
        this.isActive = isActive;
        this.maxTeams = maxTeams;

        // Convert List<Team> to List<ShortTeamDto>
        this.participatingTeamsShortData = participatingTeams.stream()
                .map(team -> new ShortTeamDto(id, name))
                .collect(Collectors.toList());

        this.participationRequestsShortData = participationRequests.stream()
                .map(team -> new ShortTeamDto(id, name))
                .collect(Collectors.toList());
    }
}
