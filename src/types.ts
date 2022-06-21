export interface Video {
  title: string
  description?: any
  description_html?: any
  broadcast_id: number
  broadcast_type: string
  status: string
  tag_list: string
  views: number
  url: string
  language: string
  created_at: string
  viewable: string
  viewable_at?: any
  published_at: string
  delete_at: string
  _id: string
  recorded_at: string
  game: string
  length: number
  preview: {
    small: string
    medium: string
    large: string
    template: string
  }
  animated_preview_url: string
  thumbnails: {
    small: Thumbnail[]
    medium: Thumbnail[]
    large: Thumbnail[]
    template: Thumbnail[]
  }
  fps: {
    [key: string]: number
  }
  seek_previews_url: string
  resolutions: {
    [key: string]: string
  }
  restriction: string
  channel: Channel
  increment_view_count_url: string
}

interface Thumbnail {
  type: string
  url: string
}

interface Channel {
  mature: boolean
  status: string
  broadcaster_language: string
  broadcaster_software: string
  display_name: string
  game: string
  language: string
  _id: number
  name: string
  created_at: string
  updated_at: string
  partner: boolean
  logo: string
  video_banner: string
  profile_banner: string
  profile_banner_background_color: string
  url: string
  views: number
  followers: number
  broadcaster_type: string
  description: string
  private_video: boolean
  privacy_options_enabled: boolean
}

export interface Quality {
  name: string // 1080p60, 720p60, ...
  video: string // chunked, 720p, ...
  resolution: string // 1920x1080, 1280x720, ...
  frameRate: string // 60.000, 30.000, ...
}
