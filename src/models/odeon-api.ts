export interface Schedule {
  businessDate: string;
  startsAt: Date;
  endsAt: Date;
  filmStartsAt: Date;
  filmEndsAt: Date;
}

export interface Showtime {
  id: string;
  schedule: Schedule;
  isSoldOut: boolean;
  seatLayoutId: number;
  filmId: string;
  siteId: string;
  screenId: string;
  attributeIds: string[];
  isAllocatedSeating: boolean;
  requires3dGlasses: boolean;
  eventId?: any;
}

export interface Name {
  text: string;
  translations: any[];
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Address {
  line1: string;
  line2: string;
  city: string;
}

export interface ContactDetails {
  phoneNumbers: any[];
  email: string;
  address: Address;
}

export interface Site {
  id: string;
  name: Name;
  location: Location;
  contactDetails: ContactDetails;
  ianaTimeZoneName: string;
}

export interface Title {
  text: string;
  translations: any[];
}

export interface Synopsis {
  text: string;
  translations: any[];
}

export interface ShortSynopsis {
  text: string;
  translations: any[];
}

export interface CensorRatingNote {
  text: string;
  translations: any[];
}

export interface CastAndCrew {
  castAndCrewMemberId: string;
  roles: string[];
}

export interface ExternalIds {
  moviexchangeReleaseId: string;
}

export interface Film {
  id: string;
  title: Title;
  synopsis: Synopsis;
  shortSynopsis: ShortSynopsis;
  censorRatingId: string;
  censorRatingNote: CensorRatingNote;
  releaseDate: string;
  runtimeMinutes: number;
  trailerUrl: string;
  classificationNoteTranslations?: any;
  displayPriority: number;
  castAndCrew: CastAndCrew[];
  genreIds: string[];
  categories: string[];
  showtimeAttributeIds: string[];
  externalIds: ExternalIds;
  hopk: string;
  hoCode: string;
  eventId?: any;
}

export interface Name2 {
  givenName: string;
  familyName: string;
  middleName?: any;
}

export interface CastAndCrew2 {
  id: string;
  name: Name2;
}

export interface Name3 {
  text: string;
  translations: any[];
}

export interface Genre {
  id: string;
  name: Name3;
  description?: any;
}

export interface Classification {
  text: string;
  translations: any[];
}

export interface CensorRating {
  id: string;
  classification: Classification;
  classificationDescription?: any;
}

export interface Name4 {
  text: string;
  translations: any[];
}

export interface ShortName {
  text: string;
  translations: any[];
}

export interface Description {
  text: string;
  translations: any[];
}

export interface Attribute {
  id: string;
  name: Name4;
  shortName: ShortName;
  description: Description;
  importantMessage?: any;
  displayPriority: number;
  isPromoted: boolean;
}

export interface Name5 {
  text: string;
  translations: any[];
}

export interface Screen {
  id: string;
  name: Name5;
}

export interface RelatedData {
  sites: Site[];
  films: Film[];
  castAndCrew: CastAndCrew2[];
  genres: Genre[];
  censorRatings: CensorRating[];
  attributes: Attribute[];
  screens: Screen[];
  events: any[];
}

export interface ShowingsResponse {
  businessDate: string;
  showtimes: Showtime[];
  relatedData: RelatedData;
}
