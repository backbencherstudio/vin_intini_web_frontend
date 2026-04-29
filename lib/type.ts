export type Testimonial = {
  id: string;
  review: string;
  rating: number;
  imgUrl: string;
  reviewer: {
    name: string;
    occupation: string;
    location: string;
    avatarUrl: string;
  };
};

export type OurImpactType = {
  id: string;
  title: string;
  description: string;
  Icon: any;
  value: string;
  uniqueKey: string;
  bgColor: string;
  IconBgColor: string;
};

export interface UserProfileType {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  title: string | null;
  profile_image: string | null;
  profile_image_url: string | null;
  cover_image: string | null;
  cover_image_url: string | null;
}

export interface ConnectionRequestType {
  id: number;
  status: "pending" | "accepted" | "ignored" | "declined";
  status_label: string;
  action_label: string;
  is_incoming: boolean;
  is_outgoing: boolean;
  is_connectable: boolean;
  is_following_back: boolean;
  can_accept: boolean;
  can_ignore: boolean;
  connected_since: string | null;
  user: UserProfileType;
  mutual_connections_count: number;
  mutual_connections: any[];
  message: string;
  direction: "incoming" | "outgoing";
  requested_at: string;
  responded_at: string | null;
}


export type EmpOpportunityType = {
  id: string;
  title: string;
  location: string;
  company: string;
  type: "Full Time" | "Part Time" | "Internship" | "Contract";
  mode: "Remote" | "On-site" | "Hybrid";
  salaryRange: string;
  postedTime: string;
}


export type USAMapType = {
  id: number;
  name: string;
  code: string;
  slug: string;
  total_resources: number;
};

export type InstitutionType = "university_hospital" | "state_institution" | "residency_program";

export type HospitalType = {
    id: number;
    state_id: number;
    name: string;
    location: string;
    type: InstitutionType;
    university_id: number | null;
    created_at: string;
    updated_at: string;
}


export interface GroupMembershipPivotType {
  user_id: number;
  group_id: number;
  role: "admin" | "member" | "moderator"; 
  created_at: string;
  updated_at: string;
}


export interface GroupDetailType {
  id: number;
  name: string;
  description: string;
  logo: string;
  cover_photo: string;
    total_member: number;
  industry: string[];
  location: string;
  rules: string;
  creator_id: number;
  type: "public" | "private";
  discoverability: "listed" | "unlisted";
  allow_member_invites: boolean;
  require_post_approval: boolean;
  created_at: string;
  updated_at: string;
  members_count: number;
  logo_url: string;
  cover_photo_url: string;
  
  // Relations
  creator: UserProfileType;
  pivot?: GroupMembershipPivotType; 
}