export interface SocialPost {
  id: string | number;
  authorId?: string;
  username: string;
  initial: string;
  avatarColor: string;
  timezone: string;
  tag: string;
  tagColor: string;
  game: string;
  time: string;
  content: string;
  likes: number;
  liked: boolean;
  comments: number;
  bottomGradient: string;
}

export interface SocialComment {
  id: string;
  postId: string;
  authorId: string;
  username: string;
  content: string;
  createdAt: string;
}

export interface OnlinePlayer {
  username: string;
  initial: string;
  color: string;
  tag: string;
}

export interface TrendingTag {
  tag: string;
  count: string;
  color: string;
}

export interface CreatePostDto {
  content: string;
  tag?: string;
  game?: string;
}
