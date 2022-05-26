import axios, { AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { AirGnGUser, Station } from '../App.d';

export async function getAllStations(): Promise<Station[]> {
    return axios
        .get<Request, AxiosResponse<Station[]>>(
            `${Constants.manifest.extra.baseUrl}/stations`
        )
        .then((res) => res.data)
        .catch((reason) => {
            console.error(reason);
            return new Promise<Station[]>((resolve, reject) => {
                resolve([]);
            });
        });
}

export async function getOneStation(id: string): Promise<Station> {
    return axios
        .get<Request, AxiosResponse<Station>>(
            `${Constants.manifest.extra.baseUrl}/stations/${id}`
        )
        .then((res) => res.data)
        .catch((reason) => {
            console.error(reason);
            return new Promise<Station>((resolve, reject) => {
                resolve(null);
            });
        });
}
export async function getOneUser(id: string): Promise<AirGnGUser> {
    return axios
        .get<Request, AxiosResponse<AirGnGUser>>(
            `${Constants.manifest.extra.baseUrl}/users/${id}`
        )
        .then((res) => res.data)

        .catch((reason) => {
            console.error(reason);
            return new Promise<AirGnGUser>((resolve, reject) => {
                resolve(null);
            });
        });
}
