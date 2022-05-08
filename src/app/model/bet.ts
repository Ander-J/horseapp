import { Horse } from "./horse";

export class Bet {
    raceId: string;
    betSize: string;
    betHorse: Horse;
    didWin: boolean;
}