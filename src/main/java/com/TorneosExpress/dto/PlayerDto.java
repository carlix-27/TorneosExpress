package com.TorneosExpress.dto;

import com.TorneosExpress.model.Team;

import java.util.List;

public class PlayerDto {
    private Long id;
    private String name;
    private String location;
    private String email;
    private Boolean isPremium;
    private Boolean isEnabled;
    private String password;
    private List<Team> ownedTeams; // Debería ser un teamDto
    private boolean isCaptain;

    public PlayerDto(Long id, String name, String location, String email, Boolean isPremium, Boolean isEnabled, String password, List<Team> ownedTeams, boolean isCaptain) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.email = email;
        this.isPremium = isPremium;
        this.isEnabled = isEnabled;
        this.password = password;
        this.ownedTeams = ownedTeams;
        this.isCaptain = isCaptain;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getPremium() {
        return isPremium;
    }

    public void setPremium(Boolean premium) {
        isPremium = premium;
    }

    public Boolean getEnabled() {
        return isEnabled;
    }

    public void setEnabled(Boolean enabled) {
        isEnabled = enabled;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Team> getOwnedTeams() {
        return ownedTeams;
    }

    public void setOwnedTeams(List<Team> ownedTeams) {
        this.ownedTeams = ownedTeams;
    }

    public boolean isCaptain() {
        return isCaptain;
    }

    public void setCaptain(boolean captain) {
        isCaptain = captain;
    }
}