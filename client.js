import axios from 'axios';

const BASE_URL="https://dojomaze-api.maas.codes"

export async function RegisterPlayer(clientId, name) {
    return axios.post(`${BASE_URL}/player/new`, JSON.stringify({
        name,
        clientId
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function GetPlayerStatus(playerId) {
    return axios.post(`${BASE_URL}/player/status`, JSON.stringify({
        playerId
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function Shoot(playerId, direction) {
    return axios.post(`${BASE_URL}/player/shoot`, JSON.stringify({
        playerId,
        direction
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function Move(playerId, direction) {
    return axios.post(`${BASE_URL}/player/move`, JSON.stringify({
        playerId,
        direction
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}