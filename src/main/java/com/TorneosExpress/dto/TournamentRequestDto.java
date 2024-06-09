package com.TorneosExpress.dto;

public class TournamentRequestDto {

    private Long request_from;
    private Long request_to;
    private Long tournamentId;
    private Boolean accepted;
    private Boolean denied;

    public Long getRequest_from() {
        return request_from;
    }

    public void setRequest_from(Long request_from) {
        this.request_from = request_from;
    }

    public Long getRequest_to() {
        return request_to;
    }

    public void setRequest_to(Long request_to) {
        this.request_to = request_to;
    }

    public Long getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(Long tournamentId) {
        this.tournamentId = tournamentId;
    }

    public Boolean getAccepted() {
        return accepted;
    }

    public void setAccepted(Boolean accepted) {
        this.accepted = accepted;
    }

    public Boolean getDenied() {
        return denied;
    }

    public void setDenied(Boolean denied) {
        this.denied = denied;
    }


}
