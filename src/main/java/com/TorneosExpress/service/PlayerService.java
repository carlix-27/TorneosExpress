package com.TorneosExpress.service;

import com.TorneosExpress.model.player.Player;
import com.TorneosExpress.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;


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
}
