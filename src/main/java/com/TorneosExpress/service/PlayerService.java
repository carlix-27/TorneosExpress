package com.TorneosExpress.service;

import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    /*@Autowired
    private TournamentService tournamentService;*/

    public List<Player> getPlayerByName(String name) {
        return playerRepository.findByName(name);
    }

    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }

    public Player createPlayer(String player_name, String player_location, String player_email, String password) {
        Player newPlayer = new Player(player_name, player_location, player_email, password);
        return savePlayer(newPlayer);
    }

    public Player login(String email, String password) {
        Player player = playerRepository.findByemail(email);
        if (player == null || !player.getPassword().equals(password)) {
            return null;
        }
        return player;
    }

    public boolean isPremiumUser(Long userId) {
        Player user = playerRepository.findById(userId).orElse(null);
        if (user != null) {
            return user.getIs_Premium();
        }
        return false;
    }

    public boolean isCaptain(Long userId){
        Player user = playerRepository.findById(userId).orElse(null);
        if(user != null){
            return user.isIs_Captain();
        }
        return false;
    }

    // Considero que aquí tiene que haber una lógica de realizar una solicitud, y procesarla.
    /*public boolean requestTournamentAccess(Long playerId, Long tournamentId, Long teamId){
        return tournamentService.processAccessRequest(tournamentId, playerId, teamId);
    }*/

    public void upgradeToCaptain(Long userId){
        Optional<Player> optionalPlayer = playerRepository.findById(userId);
        if(optionalPlayer.isPresent()){
            Player player = optionalPlayer.get();
            player.setIs_Captain(true); // Ahora cambié el estado que tenía en la db a True. Sos capitán!
            playerRepository.save(player);
        }
    }

    public boolean upgradeToPremium(Long playerId) {
        Optional<Player> optionalPlayer = playerRepository.findById(playerId);
        if (optionalPlayer.isPresent()) {
            Player player = optionalPlayer.get();
            player.setIs_Premium(true);
            playerRepository.save(player);
            return true;
        } else {
            return false;
        }
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public List<Team> findTeamsByPlayerId(Long playerId) {
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new RuntimeException("Player not found"));
        return player.getTeams();
    }
}
