export interface PodcastData {
    id: number;
    name: string;
    total: number;
    has_next: boolean;
    podcasts: Podcast[];
    parent_id: number;
    page_number: number;
    has_previous: boolean;
    listennotes_url: string;
    next_page_number: number;
    previous_page_number: number;
}
export interface Podcast {
    id: string;
    rss: string;
    type: string;
    email: string;
    extra: Extra;
    image: string;
    title: string;
    country: string;
    website: string;
    language: string;
    genre_ids: number[];
    itunes_id: number;
    publisher: string;
    thumbnail: string;
    is_claimed: boolean;
    description: string;
    looking_for: LookingFor;
    has_sponsors: boolean;
    listen_score: number;
    total_episodes: number;
    listennotes_url: string;
    audio_length_sec: number;
    explicit_content: boolean;
    latest_episode_id: string;
    latest_pub_date_ms: number;
    earliest_pub_date_ms: number;
    has_guest_interviews: boolean;
    update_frequency_hours: number;
    listen_score_global_rank: string;
}
export interface Extra {
    url1: string;
    url2: string;
    url3: string;
    spotify_url: string;
    youtube_url: string;
    linkedin_url: string;
    wechat_handle: string;
    patreon_handle: string;
    twitter_handle: string;
    facebook_handle: string;
    amazon_music_url: string;
    instagram_handle: string;
}
export interface LookingFor {
    guests: boolean;
    cohosts: boolean;
    sponsors: boolean;
    cross_promotion: boolean;
}
export interface SearchResponse {
    took: number;
    count: number;
    total: number;
    results: Episode[];
    next_offset: number;
}
interface Episode {
    id: string;
    rss: string;
    link: string;
    audio: string;
    image: string;
    podcast: searchPodcast;
    itunes_id: number;
    thumbnail: string;
    pub_date_ms: number;
    guid_from_rss: string;
    title_original: string;
    listennotes_url: string;
    audio_length_sec: number;
    explicit_content: boolean;
    title_highlighted: string;
    description_original: string;
    description_highlighted: string;
    transcripts_highlighted: [];
}
interface searchPodcast {
    id: string;
    image: string;
    genre_ids: number[];
    thumbnail: string;
    listen_score: number;
    title_original: string;
    listennotes_url: string;
    title_highlighted: string;
    publisher_original: string;
    publisher_highlighted: string;
    listen_score_global_rank: string;
}
export interface PodcastDetailResponse {
    id: string;
    rss: string;
    type: string;
    email: string;
    extra: IdExtra;
    image: string;
    title: string;
    country: string;
    website: string;
    episodes: EpisodeDetail[];
    language: string;
    genre_ids: number[];
    itunes_id: number;
    publisher: string;
    thumbnail: string;
    is_claimed: boolean;
    description: string;
    looking_for: IdLookingFor;
    has_sponsors: boolean;
    listen_score: number;
    total_episodes: number;
    listennotes_url: string;
    audio_length_sec: number;
    explicit_content: boolean;
    latest_episode_id: string;
    latest_pub_date_ms: number;
    earliest_pub_date_ms: number;
    has_guest_interviews: boolean;
    next_episode_pub_date: number;
    update_frequency_hours: number;
    listen_score_global_rank: string;
}
interface IdExtra {
    url1: string;
    url2: string;
    url3: string;
    spotify_url: string;
    youtube_url: string;
    linkedin_url: string;
    wechat_handle: string;
    patreon_handle: string;
    twitter_handle: string;
    facebook_handle: string;
    amazon_music_url: string;
    instagram_handle: string;
}
interface EpisodeDetail {
    id: string;
    link: string;
    audio: string;
    image: string;
    title: string;
    thumbnail: string;
    description: string;
    pub_date_ms: number;
    guid_from_rss: string;
    listennotes_url: string;
    audio_length_sec: number;
    explicit_content: boolean;
    maybe_audio_invalid: boolean;
    listennotes_edit_url: string;
}
interface IdLookingFor {
    guests: boolean;
    cohosts: boolean;
    sponsors: boolean;
    cross_promotion: boolean;
}
export interface AudioProgress {
    progress: number;
    duration: number;
    url: string;
    host: string;
    title: string;
    image: string;
}
export {};
//# sourceMappingURL=types.d.ts.map