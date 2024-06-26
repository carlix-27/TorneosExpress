package com.TorneosExpress.controller;

import com.TorneosExpress.dto.request.InviteDto;
import com.TorneosExpress.dto.team.TeamRequestDto;
import com.TorneosExpress.dto.tournament.TournamentRequestDto;
import com.TorneosExpress.model.Invite;
import com.TorneosExpress.model.TeamRequest;
import com.TorneosExpress.model.TournamentRequest;
import com.TorneosExpress.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    @Autowired
    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping("/invite/send")
    public Invite sendInvite(@RequestBody InviteDto inviteRequest) {

        Long invite_from = inviteRequest.inviteFrom();
        Long invite_to = inviteRequest.inviteTo();
        Long teamId = inviteRequest.teamId();

        return requestService.sendInvite(invite_from, invite_to, teamId);
    }

    @GetMapping("/invite/{id}")
    public List<Invite> getInvitesById(@PathVariable Long id) {
        return requestService.getInvitesById(id);
    }

    @DeleteMapping("/invite/accept/{inviteId}")
    public Invite acceptInvite(@PathVariable Long inviteId) throws Exception {
        return  requestService.acceptInvite(inviteId);
    }


    @DeleteMapping("/invite/deny/{inviteId}")
    public Invite denyInvite(@PathVariable Long inviteId) throws Exception {
        return requestService.denyInvite(inviteId);
    }

    @PostMapping("/team/send")
    public TeamRequest sendTeamRequest(@RequestBody TeamRequestDto teamRequestDto) {
        Long requestFromId = teamRequestDto.getRequestFrom();
        Long requestToId = teamRequestDto.getRequestTo();
        Long teamId = teamRequestDto.getTeamId();
        String name = teamRequestDto.getName();
        return requestService.sendTeamRequest(requestFromId, requestToId, teamId, name);
    }

    @PostMapping("/tournament/send")
    public TournamentRequest sendTournamentRequest(@RequestBody TournamentRequestDto teamRequestDto) {
        Long requestFromId = teamRequestDto.getRequest_from();
        Long requestToId = teamRequestDto.getRequest_to();
        Long teamId = teamRequestDto.getTeamId();
        String teamName = teamRequestDto.getTeamName();
        Long tournamentId = teamRequestDto.getTournamentId();
        return requestService.sendTournamentRequest(requestFromId, requestToId, teamId, teamName, tournamentId, teamName);
    }


    @GetMapping("/team/{toId}/{teamId}")
    public List<TeamRequest> getTeamRequests(@PathVariable Long toId, @PathVariable Long teamId) {
        return requestService.getRequestsByTeam(toId, teamId);
    }


    @GetMapping("/tournament/{toId}/{tournamentId}")
    public List<TournamentRequest> getTournamentRequests(@PathVariable Long toId, @PathVariable Long tournamentId) {
        return requestService.getRequestsByTournament(toId, tournamentId);
    }

    @DeleteMapping("/team/{requestId}/accept")
    public TeamRequest acceptTeamRequest(@PathVariable Long requestId) {
        return requestService.acceptTeamRequest(requestId);
    }

    @DeleteMapping("/team/{requestId}/deny")
    public TeamRequest denyTeamRequest(@PathVariable Long requestId) {
        return requestService.denyTeamRequest(requestId);
    }


    @DeleteMapping("/tournament/{requestId}/accept")
    public TournamentRequest acceptTournamentRequest(@PathVariable Long requestId) {
        return requestService.acceptTournamentRequest(requestId);
    }

    @DeleteMapping("/tournament/{requestId}/deny")
    public TournamentRequest denyTournamentRequest(@PathVariable Long requestId) {
        return requestService.denyTournamentRequest(requestId);
    }

}
