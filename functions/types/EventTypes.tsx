import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp, arrayUnion, serverTimestamp } from 'firebase/firestore';
export const randomShift = () => {
  const min = -10;
  const max = 10;
  const value = Math.floor(Math.random() * (max - min + 1)) + min;
  return value / 100000;
};

export type Location = {
  latitude: number;
  longitude: number;
  title: string;
  id: string;
};

export const locationInitialState: Location = {
  latitude: -0.197252903373619,
  longitude: -78.4355516320591,
  title: '',
  id: '1',
};

export type EventType = {
  id: string;
  name: string;
  date: Date;
  image: { downloadURL: string; ref: string }[];
  src: string;
  url: string;
  description: string;
  location: string;
  room: string;
  address: string;
  lat: number;
  lng: number;
  duration: number;
  organizers: string;
  email: string;
  topics: string[];
  imageRef: string;
  createdAt: Date;
  updatedAt: Date;
  privacy: 'public' | 'private' | 'unlisted';
  repeats: boolean;
  daysOfWeek: number[];
  until: Date;
  approved: boolean;
};

export class Event {
  id: string;
  name: string;
  date: Date;
  image: { downloadURL: string; ref: string }[];
  src: string;
  url: string;
  description: string;
  location: string;
  room: string;
  address: string;
  lat: number;
  lng: number;
  duration: number;
  organizers: string;
  email: string;
  topics: string[];
  imageRef: string;
  createdAt: Date;
  updatedAt: Date;
  privacy: 'public' | 'private' | 'unlisted';
  repeats: boolean;
  daysOfWeek: number[];
  until: Date;
  approved: boolean;

  constructor(data: EventType) {
    this.id = data.id;
    this.name = data.name;
    this.date = data.date;
    this.image = data.image;
    this.src = data.src;
    this.url = data.url;
    this.description = data.description;
    this.location = data.location;
    this.room = data.room;
    this.address = data.address;
    this.lat = data.lat;
    this.lng = data.lng;
    this.duration = data.duration;
    this.organizers = data.organizers;
    this.email = data.email;
    this.topics = data.topics;
    this.imageRef = data.imageRef;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.privacy = data.privacy;
    this.repeats = data.repeats;
    this.daysOfWeek = data.daysOfWeek;
    this.until = data.until;
    this.approved = data.approved;
  }
}

export const eventConverter = {
  toFirestore(event: Event): DocumentData {
    return {
      name: event.name,
      date: event.date,
      image: event.image,
      src: event.src,
      url: event.url,
      description: event.description,
      location: event.location,
      room: event.room,
      address: event.address,
      lat: event.lat,
      lng: event.lng,
      duration: event.duration,
      organizers: event.organizers,
      email: event.email,
      topics: event.topics,
      imageRef: event.imageRef,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      privacy: event.privacy,
      repeats: event.repeats,
      daysOfWeek: event.daysOfWeek,
      until: event.until,
      approved: event.approved,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Event {
    const data = snapshot.data(options) as EventType;
    // Serialize from Firestore's internal format to the format the app expects
    // return new Event(data);
    return new Event({
      ...data,
      id: snapshot.id,
      date: data.date ? new Date((data.date as unknown as Timestamp).toDate().valueOf()) : new Date(),
      lat: (data.lat as unknown as number[])[0] + randomShift(),
      lng: (data.lng as unknown as number[])[0] + randomShift(),
      createdAt: data.createdAt ? new Date((data.createdAt as unknown as Timestamp).toDate().valueOf()) : new Date(),
      updatedAt: data.updatedAt ? new Date((data.updatedAt as unknown as Timestamp).toDate().valueOf()) : new Date('2024-01-01'),
      topics: data.topics ? data.topics : [],
      organizers: data.organizers ? data.organizers : "",
      repeats: data.repeats ? data.repeats : false,
      daysOfWeek: data.daysOfWeek ? daysToNumber(data.daysOfWeek as unknown as string[]) : [],
      until: data.until ? new Date((data.until as unknown as Timestamp).toDate().valueOf()) : new Date(),
      image: data.image ? data.image : [],
    });
  },
};

function daysToNumber(daysOfWeek: string[]) {
  return daysOfWeek.map((day) => days[day]);
}

const days: { [key: string]: number } = {
  "Domingo": 0,
  "Lunes": 1,
  "Martes": 2,
  "Miércoles": 3,
  "Jueves": 4,
  "Viernes": 5,
  "Sábado": 6,
};


export const eventInitialState: Event = {
  id: '',
  name: '',
  date: new Date(),
  image: [],
  src: '',
  url: '',
  description: '',
  location: '',
  room: '',
  address: '',
  lat: 0,
  lng: 0,
  duration: 0,
  organizers: '',
  email: '',
  topics: [],
  imageRef: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  privacy: 'public',
  repeats: false,
  daysOfWeek: [],
  approved: false,
  until: new Date(),
};

export type EventDocument = {
  id: string;
};
