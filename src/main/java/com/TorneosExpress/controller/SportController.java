package com.TorneosExpress.controller;


import com.TorneosExpress.dto.request.CreateSportDto;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.service.SportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sports")
public class SportController {

    private final SportService sportService;

    @Autowired
    public SportController(SportService sportService) {
        this.sportService = sportService;
    }

    @GetMapping("")
    public List<Sport> getAllSports(){
        return sportService.getAllSports();
    }

    @GetMapping("/{id}")
    public Sport getSportById(@PathVariable Long id) {
        return sportService.getSportById(id);
    }

    @PostMapping("/create")
    public Sport createSport(@RequestBody CreateSportDto request){

        String requestName = request.name();
        int requestNumPlayers = request.num_players();

        return sportService.createSport(requestName, requestNumPlayers);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Sport> updateSport(@PathVariable Long id, @RequestBody Sport updatedSport) {
        Sport existingSport = sportService.getSportById(id);
        if (existingSport == null) {
            return ResponseEntity.notFound().build();
        }

        existingSport.setSportName(updatedSport.getSportName());
        existingSport.setNum_players(updatedSport.getNum_players());

        Sport updatedSportEntity = sportService.updateSport(existingSport);
        if (updatedSportEntity == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedSportEntity);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSport(@PathVariable Long id) {
        sportService.deleteSport(id);
        return ResponseEntity.noContent().build();
    }
}