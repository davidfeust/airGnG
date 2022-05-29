import axios, { AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { Station } from '../App.d';

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
