package com.TorneosExpress.model;

import com.TorneosExpress.dto.TournamentDto;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity
public class Tournament {

  public Tournament() { }

  public Tournament(TournamentDto dto){
    this.Id = dto.getId();
    this.creatorId = dto.getCreatorId();
    this.name = dto.getName();
    this.location = dto.getLocation();
    this.sport = dto.getSport();
    this.isPrivate = dto.getIsPrivate();
    this.difficulty = dto.getDifficulty();
    this.isActive = dto.getIsActive();
    this.maxTeams = dto.getMaxTeams();
  }

  public Tournament(String tournamentName, String tournamentLocation, Sport sport, boolean privacy, Difficulty difficulty) {
    this.name = tournamentName;
    this.location = tournamentLocation;
    this.sport = sport;
    this.isPrivate = privacy;
    this.difficulty = difficulty;
    this.isActive = true;
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long Id;

  @Column
  private Long creatorId;

  @Column(unique = true)
  private String name;

  @Column
  private String location;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "sport_id", referencedColumnName = "sport_Id")
  private Sport sport;

  @Column
  private boolean isPrivate;

  @Column
  private Difficulty difficulty;

  @Column
  private boolean isActive;

  @Column
  private int maxTeams;

  @ManyToMany
  @JoinTable(
          name = "tournament_teams",
          joinColumns = @JoinColumn(name = "tournament_id"),
          inverseJoinColumns = @JoinColumn(name = "team_id"),
          uniqueConstraints = @UniqueConstraint(columnNames = { "tournament_id", "team_id" })
  )
  private List<Team> participatingTeams = new ArrayList<>();

  @ManyToMany
  @JoinTable(
          name = "tournament_requests",
          joinColumns = @JoinColumn(name = "tournament_id"),
          inverseJoinColumns = @JoinColumn(name = "team_id"),
          uniqueConstraints = @UniqueConstraint(columnNames = { "tournament_id", "team_id" })
  )
  private List<Team> participationRequests = new ArrayList<>();

  public boolean isActive() {
    return isActive;
  }

  public void setActive(boolean active) {
    isActive = active;
  }

  public int getMaxTeams() {
    return maxTeams;
  }

  public void setMaxTeams(int maxTeams) {
    this.maxTeams = maxTeams;
  }



  public void setCreatorId(Long creatorId) {
    this.creatorId = creatorId;
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

  public Sport getSport() {
    return sport;
  }

  public void setSport(Sport sport) {
    this.sport = sport;
  }

  public boolean isPrivate() {
    return isPrivate;
  }

  public void setPrivate(boolean aPrivate) {
    isPrivate = aPrivate;
  }

  public void setDifficulty(Difficulty difficulty) {
    this.difficulty = difficulty;
  }

  @Override
  public boolean equals(Object o){ // Define bien como tiene que comparar contains con las colecciones de java.
    if (this == o) return true;
    if (!(o instanceof Tournament)) {
      return false;
    }
    Tournament other = (Tournament) o;
    return this.getId().equals(other.getId());
  }

  public List<Team> getParticipatingTeams() {
    return participatingTeams;
  }

  public void setParticipatingTeams(List<Team> participatingTeams) {
    this.participatingTeams = participatingTeams;
  }

  public List<Team> getParticipationRequests() {
    return participationRequests;
  }

  public void setParticipationRequests(List<Team> participationRequests) {
    this.participationRequests = participationRequests;
  }

  public Long getId() {
    return Id;
  }

  public void setId(Long id) {
    Id = id;
  }

  public void setTournament_id(Long tournamentId) {
    this.Id = tournamentId;
  }

  public Difficulty getDifficulty() { return this.difficulty; }

  public Long getCreatorId() {
    return creatorId;
  }

}
