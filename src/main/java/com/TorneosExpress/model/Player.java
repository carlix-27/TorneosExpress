package com.TorneosExpress.model;


import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Player {
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Boolean getIs_Premium() {
        return is_Premium;
    }

    public void setIs_Premium(Boolean is_Premium) {
        this.is_Premium = is_Premium;
    }

    public Boolean getIs_Enabled() {
        return is_Enabled;
    }

    public void setIs_Enabled(Boolean is_Enabled) {
        this.is_Enabled = is_Enabled;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isIs_Captain() {
        return is_Captain;
    }

    public void setIs_Captain(boolean is_Captain) {
        this.is_Captain = is_Captain;
    }

    public List<Team> getOwnedTeams() {
        return ownedTeams;
    }

    public void setOwnedTeams(List<Team> ownedTeams) {
        this.ownedTeams = ownedTeams;
    }

    public Boolean getEnabled() {
        return is_Enabled;
    }

    public void setEnabled(Boolean enabled) {
        is_Enabled = enabled;
    }

    public List<Team> getTeams() {
        return teams;
    }

    public void setTeams(List<Team> teams) {
        this.teams = teams;
    }

    public Player(String name, String location, String email, String password) {
        this.name = name;
        this.location = location;
        this.email = email;
        this.password = password;
        this.is_Premium = false;
        this.is_Captain = false;
        this.is_Enabled = false;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "LOCATION")
    private String location;

    @Column(name = "EMAIL", unique = true)
    private String email;

    @Column(name = "IS_PREMIUM")
    private Boolean is_Premium;

    @Column(name = "IS_ENABLED")
    private Boolean is_Enabled;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "IS_CAPTAIN")
    private boolean is_Captain;

    @ManyToMany(mappedBy = "players")
    private List<Team> ownedTeams = new ArrayList<>();

    @ManyToMany(mappedBy = "players")
    private List<Team> teams = new ArrayList<>();

    public Player() {}

}
