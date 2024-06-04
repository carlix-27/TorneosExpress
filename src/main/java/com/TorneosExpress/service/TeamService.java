package com.TorneosExpress.service;


import com.TorneosExpress.dto.AccessRequest;


import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {

  @Autowired
  private TeamRepository teamRepository;

  public Team findById(long id) {
    return teamRepository.findById(id);
  }

  public String addPlayer(Long teamId, Player player) {
    teamRepository.findById(teamId).ifPresent(team -> processRequest(team, player));
    return "Error while joining team.";
  }

  private String processRequest(Team team, Player player) {
    String returnMessage;
    if (!isTeamPrivate(team)) {
      team.addPlayer(player);
      returnMessage = "Team joined successfully.";
    } else {
      team.addJoinRequest(player);
      returnMessage = "Request sent successfully.";
    }
    teamRepository.save(team);
    return returnMessage;
  }

  private boolean isTeamPrivate(Team team) {
    return team.isPrivate();
  }

  public List<Team> findByCaptainId(long id) {
    return teamRepository.findByCaptainId(id);
  }

  public List<Team> findByName(String name) {
    return teamRepository.findByName(name);
  }

  public List<Team> findAll() {
    return teamRepository.findAll();
  }

  public void deleteTeamById(long id) {
    teamRepository.deleteById(id);
  }

  public Team updateTeam(Team team) {
    if (team.getId() == null || !teamRepository.existsById(team.getId())) {
      return null; // Tournament not found
    }
    return teamRepository.save(team);
  }

  public Team save(Team team) {
    return teamRepository.save(team);
  }

  public Team createTeam(Team team) {
    return save(team);
  }

  public List<Team> getAllTeams() {
    return teamRepository.findAll();
  }

}
