import { Timestamp } from '@firebase/firestore';
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, serverTimestamp } from 'firebase/firestore';
import { Auth } from '../firebase/connection';
import AsyncStorage from '@react-native-async-storage/async-storage';
// The cloud functions have to constantly update the requests

export type PrivateUserType = {
  eventsLiked: string[];
  evensAsInvited: string[];
  eventsRequested: string[];
  groupsAsInvited: string[];
  groupsRequested: string[];
  friendsRequests: string[];
  friendsRequested: string[];
  friendsBlocked: string[];
  tripsRequested: string[];
  storiesLiked: string[];
  pushToken: string;
  notifications: string[];
  chats: string[];

};

export class PrivateUser {
  eventsLiked: string[];
  evensAsInvited: string[];
  eventsRequested: string[];
  groupsAsInvited: string[];
  groupsRequested: string[];
  friendsRequests: string[];
  friendsRequested: string[];
  friendsBlocked: string[];
  tripsRequested: string[];
  storiesLiked: string[];
  pushToken: string;
  notifications: string[];
  chats: string[];

  constructor(data: PrivateUserType) {
    this.eventsLiked = data.eventsLiked;
    this.evensAsInvited = data.evensAsInvited;
    this.eventsRequested = data.eventsRequested;
    this.groupsAsInvited = data.groupsAsInvited;
    this.groupsRequested = data.groupsRequested;
    this.friendsRequests = data.friendsRequests;
    this.friendsRequested = data.friendsRequested;
    this.friendsBlocked = data.friendsBlocked;
    this.tripsRequested = data.tripsRequested;
    this.storiesLiked = data.storiesLiked;
    this.pushToken = data.pushToken;
    this.notifications = data.notifications;
    this.chats = data.chats;
  }
}

export const privateUserConverter = {
  toFirestore(user: PrivateUser): DocumentData {
    return {
      eventsLiked: user.eventsLiked,
      evensAsInvited: user.evensAsInvited,
      eventsRequested: user.eventsRequested,
      groupsAsInvited: user.groupsAsInvited,
      groupsRequested: user.groupsRequested,
      friendsRequests: user.friendsRequests,
      friendsRequested: user.friendsRequested,
      friendsBlocked: user.friendsBlocked,
      tripsRequested: user.tripsRequested,
      storiesLiked: user.storiesLiked,
      pushToken: user.pushToken,
      notifications: user.notifications,
      chats: user.chats,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): PrivateUser {
    const data = snapshot.data(options) as PrivateUserType; // Explicitly type data as UserType
    return new PrivateUser(data);
  },
};


export type UserType = {
  name: string;
  lastName: string;
  fullName: string;
  description: string;
  email: string;
  id: string;
  uid: string;
  dob: Date | '';
  major: string
  gender: 'male' | 'female' | '';
  avatar: string;
  isOnline: boolean;
  university: string;
  createdAt: Date;
  updatedAt: Date;
  acceptedPrivacyTerms: boolean;
  stories: string[];
  completedInfo: '' | 'welcome' | 'zone' | 'notifications' | 'avatar' | 'friends';
  topics: string[];
  eventsAsOrganizer: string[];
  eventsAsMember: string[];
  groupsAsOrganizer: string[];
  groupsAsMember: string[];
  friends: string[];
  tripsAsDriver: string[];
  tripsAsPassenger: string[];
  interestedZone: {
    location: {
      latitude: number;
      longitude: number;
    };
    radius: number;
    address: string;
  };
  car: {
    licensePlate: string;
    carModel: string;
    carYear: string;
    carColor: string;
    carPlate: string;
  }

};

export class User {
  name: string;
  lastName: string;
  fullName: string;
  description: string;
  email: string;
  id: string;
  uid: string;
  dob: Date | '';
  major: string;
  gender: 'male' | 'female' | '';
  avatar: string;
  isOnline: boolean;
  university: string;
  createdAt: Date;
  updatedAt: Date;
  acceptedPrivacyTerms: boolean;
  stories: string[];
  completedInfo: '' | 'welcome' | 'zone' | 'notifications' | 'avatar' | 'friends';
  topics: string[];
  eventsAsOrganizer: string[];
  eventsAsMember: string[];
  groupsAsOrganizer: string[];
  groupsAsMember: string[];
  friends: string[];
  tripsAsDriver: string[];
  tripsAsPassenger: string[];
  interestedZone: {
    location: {
      latitude: number;
      longitude: number;
    };
    radius: number;
    address: string;
  };
  car: {
    licensePlate: string;
    carModel: string;
    carYear: string;
    carColor: string;
    carPlate: string;
  }

  constructor(data: UserType) {
    this.name = data.name;
    this.lastName = data.lastName;
    this.fullName = data.fullName;
    this.description = data.description;
    this.email = data.email;
    this.id = data.id;
    this.uid = data.uid;
    this.dob = data.dob;
    this.major = data.major;
    this.gender = data.gender;
    this.avatar = data.avatar;
    this.isOnline = data.isOnline;
    this.university = data.university;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.acceptedPrivacyTerms = data.acceptedPrivacyTerms;
    this.stories = data.stories;
    this.completedInfo = data.completedInfo;
    this.topics = data.topics;
    this.eventsAsOrganizer = data.eventsAsOrganizer;
    this.eventsAsMember = data.eventsAsMember;
    this.groupsAsOrganizer = data.groupsAsOrganizer;
    this.groupsAsMember = data.groupsAsMember;
    this.friends = data.friends;
    this.tripsAsDriver = data.tripsAsDriver;
    this.tripsAsPassenger = data.tripsAsPassenger;
    this.interestedZone = data.interestedZone;
    this.car = data.car;
  }
}

export const userConverter = {
  toFirestore(user: User): DocumentData {
    return {
      name: user.name,
      lastName: user.lastName,
      fullName: user.fullName,
      description: user.description,
      email: user.email,
      id: user.id,
      uid: user.uid,
      dob: user.dob,
      major: user.major,
      gender: user.gender,
      avatar: user.avatar,
      isOnline: user.isOnline,
      university: user.university,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      acceptedPrivacyTerms: user.acceptedPrivacyTerms,
      stories: user.stories,
      completedInfo: user.completedInfo,
      topics: user.topics,
      eventsAsOrganizer: user.eventsAsOrganizer,
      eventsAsMember: user.eventsAsMember,
      groupsAsOrganizer: user.groupsAsOrganizer,
      groupsAsMember: user.groupsAsMember,
      friends: user.friends,
      tripsAsDriver: user.tripsAsDriver,
      tripsAsPassenger: user.tripsAsPassenger,
      interestedZone: user.interestedZone,
      car: user.car,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User {
    const data = snapshot.data(options) as UserType; // Explicitly type data as UserType
    return new User({
      ...data,
      id: snapshot.id,
      uid: snapshot.id,
      description: data.description || userInitialState.description,
      major: data.major || userInitialState.major,
      topics: data.topics || userInitialState.topics,
      eventsAsOrganizer: data.eventsAsOrganizer || userInitialState.eventsAsOrganizer,
      eventsAsMember: data.eventsAsMember || userInitialState.eventsAsMember,
      groupsAsOrganizer: data.groupsAsOrganizer || userInitialState.groupsAsOrganizer,
      groupsAsMember: data.groupsAsMember || userInitialState.groupsAsMember,
      friends: data.friends || userInitialState.friends,
      tripsAsDriver: data.tripsAsDriver || userInitialState.tripsAsDriver,
      tripsAsPassenger: data.tripsAsPassenger || userInitialState.tripsAsPassenger,
      interestedZone: data.interestedZone || userInitialState.interestedZone,
      car: data.car || userInitialState.car,
      dob: data.dob ? new Date((data.dob as unknown as Timestamp).toDate().valueOf()) : new Date('2024-01-01'),
      updatedAt: data.updatedAt ? new Date((data.updatedAt as unknown as Timestamp).toDate().valueOf()) : new Date('2024-01-01'),
      createdAt: data.createdAt ? new Date((data.createdAt as unknown as Timestamp).toDate().valueOf()) : new Date('2024-01-01'),
    });
  },
};

export const userInitialState: User = {
  id: '',
  uid: '',
  name: '',
  lastName: '',
  description: '',
  fullName: '',
  email: '',
  major: '',
  gender: '',
  avatar: '',
  isOnline: false,
  university: 'Universidad San Francisco de Quito',
  dob: new Date('2024-01-01'),
  createdAt: serverTimestamp() as unknown as Date,
  updatedAt: serverTimestamp() as unknown as Date,
  acceptedPrivacyTerms: false,
  stories: [],
  completedInfo: '',
  topics: [],
  eventsAsOrganizer: [],
  eventsAsMember: [],
  groupsAsOrganizer: [],
  groupsAsMember: [],
  friends: [],
  tripsAsDriver: [],
  tripsAsPassenger: [],
  interestedZone: {
    location: {
      latitude: 0,
      longitude: 0,
    },
    radius: 0,
    address: '',
  },
  car: {
    licensePlate: '',
    carModel: '',
    carYear: '',
    carColor: '',
    carPlate: '',
  },
};

export const privateUserInitialState: PrivateUser = {
  eventsLiked: [],
  evensAsInvited: [],
  eventsRequested: [],
  groupsAsInvited: [],
  groupsRequested: [],
  friendsRequests: [],
  friendsRequested: [],
  friendsBlocked: [],
  tripsRequested: [],
  storiesLiked: [],
  pushToken: '',
  notifications: [],
  chats: [],
};

export type UserDocument = {
  id: string;
};

export const parseUsers = (usersStringified: string) => {
  const currentUsers: Record<string, User> = JSON.parse(usersStringified);
  Object.keys(currentUsers).forEach((key: string) => {
    currentUsers[key].dob = new Date(currentUsers[key].dob);
    currentUsers[key].createdAt = new Date(currentUsers[key].createdAt);
    currentUsers[key].updatedAt = new Date(currentUsers[key].updatedAt);
  });
  return currentUsers;
}

export const signOut = async () => {
  Auth.signOut();
  AsyncStorage.clear();
  return;
}
