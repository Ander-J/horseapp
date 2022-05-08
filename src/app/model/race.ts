import { Horse } from "./horse";

export class Race {
    id: string;
    participants: Horse[];
    track: string;
    date: Date;
}