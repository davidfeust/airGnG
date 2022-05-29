import axios, { AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { WhereFilterOp } from 'firebase/firestore';
import { AirGnGUser, Order, Station } from '../App.d';

export async function getAllStationsBy(
    x: string,
    condition: WhereFilterOp,
    y: string | Array<any>
): Promise<Station[]> {
    console.log(
        `${Constants.manifest.extra.baseUrl}/stations/${x}/${condition}/${y}`
    );

    return axios
        .get<Request, AxiosResponse<Station[]>>(
            `${Constants.manifest.extra.baseUrl}/stations/${x}/${condition}/${y}`
        )
        .then((res) => {
            // console.log('res.data: ', res.data);
            // console.log('res: ', res);
            return res.data;
        })
        .catch((reason) => {
            console.error(reason);
            return new Promise<Station[]>((resolve, reject) => {
                resolve(null);
            });
        });
}

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
export async function getAllOrdersBy(
    x: string,
    condition: WhereFilterOp,
    y: string | Array<any>
): Promise<Order[]> {
    console.log(
        `${Constants.manifest.extra.baseUrl}/orders/${x}/${condition}/${y}`
    );

    return axios
        .get<Request, AxiosResponse<Order[]>>(
            `${Constants.manifest.extra.baseUrl}/orders/${x}/${condition}/${y}`
        )
        .then((res) => res.data)

        .catch((reason) => {
            console.error(reason);
            return new Promise<Order[]>((resolve, reject) => {
                resolve(null);
            });
        });
}

export async function getAllOrders(): Promise<Order[]> {
    return axios
        .get<Request, AxiosResponse<Order[]>>(
            `${Constants.manifest.extra.baseUrl}/orders`
        )
        .then((res) => res.data)

        .catch((reason) => {
            console.error(reason);
            return new Promise<Order[]>((resolve, reject) => {
                resolve(null);
            });
        });
}
