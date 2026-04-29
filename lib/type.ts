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

export interface GroupType {
  id: number;
  name: string;
  logo_url: string | null;
  total_member: number;
}
