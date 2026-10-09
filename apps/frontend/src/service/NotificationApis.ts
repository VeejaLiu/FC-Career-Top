import { getDefaultGameVersion, getToken } from '../common/common.ts';
import axios from 'axios';
import { BACKEND_URL } from '../constant';
import { reportApiError } from './api-error';

export interface NotificationBody {
  id?: number;
  user_id?: number;
  game_version?: number;
  in_game_date?: string;
  message_type?: string;
  message_subtype?: string;
  player_id?: number;
  player_position?: string;
  player_name?: string;
  old_overall_rating?: number | null;
  overall_rating?: number | null;
  old_potential?: number | null;
  potential?: number | null;
  old_skillmoves?: number | null;
  skillmoves?: number | null;
  old_weakfoot?: number | null;
  weakfoot?: number | null;
  is_read?: number;
  is_deleted?: number;
  create_time?: string;
  update_time?: string;
}

/**
 * Notification APIs
 */
export class NotificationApis {
  /**
   * Get all unread notifications count
   * @returns number
   */
  static async getUnreadNotificationsCount(): Promise<number> {
    try {
      const token = getToken();
      const gameVersion = await getDefaultGameVersion();

      const response = await axios.get(
        `${BACKEND_URL}/api/v1/notification/unread-count?gameVersion=${gameVersion}`,
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      if (response.status === 200) {
        return response.data.count;
      }
      return 0;
    } catch (error: unknown) {
      reportApiError(error);
      return 0;
    }
  }

  /**
   * Get all notifications
   * @returns NotificationBody[]
   */
  static async getAllNotifications({
    page,
    limit,
    filter,
    onlyUnread = false,
  }: {
    page: number;
    limit: number;
    filter?: string;
    onlyUnread?: boolean;
  }): Promise<{
    total: number;
    items: NotificationBody[];
  }> {
    try {
      const token = getToken();
      const gameVersion = await getDefaultGameVersion();

      const params = new URLSearchParams({
        gameVersion: gameVersion.toString(),
        page: page.toString(),
        limit: limit.toString(),
        filter: filter || 'all',
        onlyUnread: onlyUnread.toString(),
      });

      const response = await axios.get(
        `${BACKEND_URL}/api/v1/notification/?${params.toString()}`,
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      if (response.status === 200) {
        return response.data;
      }
      return {
        total: 0,
        items: [],
      };
    } catch (error: unknown) {
      reportApiError(error);
      return { total: 0, items: [] };
    }
  }

  /**
   * Mark notification as read
   * @param id
   */
  static async markAsRead(id: number) {
    try {
      const token = getToken();
      const gameVersion = await getDefaultGameVersion();

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/notification/mark-read`,
        { id, gameVersion },
        { headers: { token } },
      );
      if (response.status === 200) {
        return response.data;
      }
      return [];
    } catch (error: unknown) {
      reportApiError(error);
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead() {
    try {
      const token = getToken();
      const gameVersion = await getDefaultGameVersion();

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/notification/mark-all-read`,
        { gameVersion },
        { headers: { token } },
      );
      if (response.status === 200) {
        return response.data;
      }
      return [];
    } catch (error: unknown) {
      reportApiError(error);
    }
  }
}
