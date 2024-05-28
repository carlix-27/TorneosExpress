package com.TorneosExpress.model;
import com.TorneosExpress.dto.ShortTeamDto;
import com.TorneosExpress.dto.TeamDto;
import com.TorneosExpress.model.shop.Article;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Team {

  public Team(TeamDto teamDto) { // Todo. Para que te deje de aparecer null. Toquetea de acá!.
    this.id = teamDto.getId();
    this.name = teamDto.getName();
    this.location = teamDto.getLocation();
    this.isPrivate = teamDto.isPrivate();
    this.prestigePoints = teamDto.getPrestigePoints();
    this.captainId = teamDto.getCaptainId();
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true)
  private String name;

  @Column
  private String location;

  @Column
  private boolean isPrivate;

  @Column
  private int prestigePoints;

  @Column
  private Long captainId;

  @ManyToMany(mappedBy = "participatingTeams")
  private List<Tournament> activeTournaments = new ArrayList<>();

  @ManyToMany
  @JoinTable(
          name = "team_players",
          joinColumns = @JoinColumn(name = "team_id"),
          inverseJoinColumns = @JoinColumn(name = "players_id")
  )
  private List<Player> players = new ArrayList<>();

  @ManyToMany
  @JoinTable(
          name = "team_articles",
          joinColumns = @JoinColumn(name = "team_id"),
          inverseJoinColumns = @JoinColumn(name = "articles_article_id")
  )
  private List<Article> articles = new ArrayList<>();

  @ManyToMany(mappedBy = "participationRequests")
  private List<Tournament> requestedTournaments = new ArrayList<>();

  public Team(Long captainId, String teamName, String teamLocation, boolean isPrivate) {
    this.name = teamName;
    this.location = teamLocation;
    this.isPrivate = isPrivate;
    this.prestigePoints = 0;
    this.captainId = captainId;
  }

  public Team() {
  }

  // Getters and setters...

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getLocation() {
    return location;
  }

  public boolean isPrivate() {
    return isPrivate;
  }

  public int getPrestigePoints() {
    return prestigePoints;
  }

  public Long getCaptainId() {
    return captainId;
  }

  public List<Tournament> getActiveTournaments() {
    return activeTournaments;
  } // En los torneos donde ya estoy

  public List<Player> getPlayers() {
    return players;
  }

  public List<Article> getArticles() {
    return articles;
  }

  public List<Tournament> getRequestedTournaments() {
    return requestedTournaments;
  } // Los torneos a los que envio solicitud

  // Setters...

  public void setName(String name) {
    this.name = name;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public void setIsPrivate(boolean aPrivate) {
    isPrivate = aPrivate;
  }

  public void setPrestigePoints(int prestigePoints) {
    this.prestigePoints = prestigePoints;
  }

  public void setCaptainId(Long captainId) {
    this.captainId = captainId;
  }

  public void setActiveTournaments(List<Tournament> activeTournaments) {
    this.activeTournaments = activeTournaments;
  }

  public void setPlayers(List<Player> players) {
    this.players = players;
  }

  public void setArticles(List<Article> articles) {
    this.articles = articles;
  }

  public void setRequestedTournaments(List<Tournament> requestedTournaments) {
    this.requestedTournaments = requestedTournaments;
  }

  public ShortTeamDto toDto(){
    return new ShortTeamDto(this.id, this.name);
  }
}
