import {
  Button,
  LocaleConsumer,
  Pagination,
  Select,
  Switch,
  Tooltip,
} from '@douyinfe/semi-ui';
import { IconCheckChoiceStroked } from '@douyinfe/semi-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  NotificationApis,
  NotificationBody,
} from '../service/NotificationApis.ts';
import {
  getAvatarUrl,
  getColorByDiff,
  getColorByPosition,
} from '../common/player-helper.ts';
import './NotificationPopover.css';
import player_avatar_placeholder from '../assets/image/player_avatar_placeholder.svg';

function getNotificationContent(
  notification: NotificationBody,
  localeData: any,
) {
  switch (notification.message_type) {
    case 'PlayerUpdate': {
      switch (notification.message_subtype) {
        case 'PlayerUpdate.SkillMove':
          return (
            <div className="flex mt-2 font-mono items-center">
              <div className="w-24 font-bold text-gray-400">
                {localeData.SkillMove}
              </div>
              <div className="w-6 text-center">
                {notification.old_skillmoves}
              </div>
              <div className="w-10 text-center">{'→'}</div>
              <div
                className="w-6 font-bold text-center"
                style={{
                  color: getColorByDiff(
                    (notification?.skillmoves || 0) -
                      (notification?.old_skillmoves || 0),
                  ),
                }}
              >
                {notification.skillmoves}
              </div>
            </div>
          );
        case 'PlayerUpdate.WeakFoot':
          return (
            <div className="flex mt-2 font-mono items-center">
              <div className="w-24 font-bold text-gray-400">
                {localeData.WeakFoot}
              </div>
              <div className="w-6 text-center">{notification.old_weakfoot}</div>
              <div className="w-10 text-center">{'→'}</div>
              <div
                className="w-6 font-bold text-center"
                style={{
                  color: getColorByDiff(
                    (notification?.weakfoot || 0) -
                      (notification?.old_weakfoot || 0),
                  ),
                }}
              >
                {notification.weakfoot}
              </div>
            </div>
          );
        case 'PlayerUpdate.Overall':
          return (
            <div>
              <div className="flex mt-2 font-mono items-center">
                <div className="w-24 font-bold text-gray-400">
                  {localeData?.Overall}
                </div>
                <div className="w-6 text-center">
                  {notification.old_overall_rating}
                </div>
                <div className="w-10 text-center"> {'→'} </div>
                <div
                  className="w-6 font-bold text-center"
                  style={{
                    color: getColorByDiff(
                      (notification?.overall_rating || 0) -
                        (notification?.old_overall_rating || 0),
                    ),
                  }}
                >
                  {notification.overall_rating}
                </div>
              </div>

              <div className="flex mt-1 font-mono items-center">
                <div className="w-24 font-bold text-gray-400">
                  {localeData?.Potential}
                </div>
                <div className="w-6 text-center">
                  {notification.old_potential}
                </div>
                <div className="w-10 text-center">{'→'}</div>
                <div
                  className="font-bold w-6 text-center"
                  style={{
                    color: getColorByDiff(
                      (notification?.potential || 0) -
                        (notification?.old_potential || 0),
                    ),
                  }}
                >
                  {notification.potential}
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div>
              {localeData?.UnknownMessageType}: {notification.message_subtype}
            </div>
          );
      }
    }
    default:
      return (
        <div>
          {localeData?.UnknownMessageType}: {notification.message_type}
        </div>
      );
  }
}

type NotificationItemProps = {
  notification: NotificationBody;
};

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  return (
    <LocaleConsumer componentName={'NotificationItem'}>
      {(localeData: any, localeCode: string, dateFnsLocale: any) => (
        <div className="notification-item-layout">
          <div className="notification-avatar">
            <img
              className="h-16 w-16 rounded-full"
              src={getAvatarUrl(notification.player_id)}
              alt={notification.player_name}
              onError={(e) => {
                e.currentTarget.src = player_avatar_placeholder;
              }}
            />
          </div>
          <div className="notification-item-body">
            {/* Position and name */}
            <div className="font-bold">
              <span
                style={{
                  color: getColorByPosition(notification.player_position || ''),
                }}
                className="mr-1"
              >
                {notification.player_position}
              </span>
              <span className="text-gray-800">{notification.player_name}</span>
            </div>

            {/* Game date */}
            <div className="mb-1 flex">
              <div className="w-24">{localeData?.GameDate}</div>
              <span className="text-gray-800">{notification.in_game_date}</span>
            </div>
            {getNotificationContent(notification, localeData)}
          </div>
          <div className="notification-item-actions">
            <a className="cursor-pointer underline">
              {notification.is_read ? '' : localeData?.MarkAsRead}
            </a>

            {!notification.is_read && (
              <div className="w-2 h-2 rounded-full bg-red-600 mt-8 ml-auto"></div>
            )}
          </div>
        </div>
      )}
    </LocaleConsumer>
  );
};

interface NotificationPopoverProps {
  updateUnreadCount: () => void;
}

const PAGE_SIZE = 10;

export const NotificationPopover = ({
  updateUnreadCount,
}: NotificationPopoverProps) => {
  const [notificationList, setNotificationList] = useState<{
    total: number;
    items: NotificationBody[];
  }>({
    total: 0,
    items: [],
  });
  const [onlyShowUnread, setOnlyShowUnread] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterValue, setFilterValue] = useState<string>('all');

  const requestSequence = useRef(0);
  const fetchNotificationList = useCallback(async () => {
    const sequence = ++requestSequence.current;
    const notificationList = await NotificationApis.getAllNotifications({
      page: currentPage,
      limit: PAGE_SIZE,
      filter: filterValue,
      onlyUnread: onlyShowUnread,
    });
    if (sequence !== requestSequence.current) return;
    setNotificationList(notificationList);
    if (notificationList?.items?.length === 0) {
      setCurrentPage(1);
    }
    updateUnreadCount();
  }, [currentPage, onlyShowUnread, filterValue, updateUnreadCount]);

  useEffect(() => {
    const sequenceRef = requestSequence;
    fetchNotificationList().then();
    return () => {
      sequenceRef.current++;
    };
  }, [fetchNotificationList]);

  return (
    <LocaleConsumer componentName={'NotificationPopover'}>
      {(localeData: any, localeCode: string, dateFnsLocale: any) => (
        <div className="notification-panel">
          {/* Header ---- Start */}
          <div className="notification-panel-header">
            <span className="notification-panel-title">{localeData.Title}</span>
            <div className="notification-panel-actions">
              <span>{localeData.OnlyShowUnread}</span>
              <Switch
                style={{ marginLeft: '5px' }}
                checked={onlyShowUnread}
                onChange={(checked) => {
                  setCurrentPage(1);
                  setOnlyShowUnread(checked);
                }}
                checkedText={localeData.SwitchOn}
                uncheckedText={localeData.SwitchOff}
              />
              <Tooltip content={localeData.MarkAllAsRead} position={'top'}>
                <Button
                  theme="borderless"
                  aria-label={localeData.MarkAllAsRead}
                  icon={<IconCheckChoiceStroked size="large" />}
                  onClick={() => {
                    NotificationApis.markAllAsRead().then(
                      fetchNotificationList,
                    );
                  }}
                />
              </Tooltip>
            </div>
          </div>
          {/* Header ---- End */}

          {/* Content ---- Start */}
          <div className="notification-panel-content">
            <Select
              className="m-1 ml-2 w-[200px]"
              value={filterValue}
              onChange={(value) => {
                setCurrentPage(1);
                setFilterValue(String(value));
              }}
            >
              {/* 'PlayerUpdate.Overall' | 'PlayerUpdate.SkillMove' | 'PlayerUpdate.WeakFoot' | 'all' */}
              {/* All */}
              <Select.Option value="all">
                {localeData.FilterOption.All}
              </Select.Option>
              {/* Overall / Potential */}
              <Select.Option value="PlayerUpdate.Overall">
                {localeData.FilterOption.Overall}
              </Select.Option>
              {/* Skill move */}
              <Select.Option value="PlayerUpdate.SkillMove">
                {localeData.FilterOption.SkillMove}
              </Select.Option>
              {/* Weak foot */}
              <Select.Option value="PlayerUpdate.WeakFoot">
                {localeData.FilterOption.WeakFoot}
              </Select.Option>
            </Select>

            {notificationList?.items
              ?.filter(
                (notification) => !onlyShowUnread || !notification.is_read,
              )
              .map((notification: any, index: number) => (
                <div
                  className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                  key={index}
                  onClick={() => {
                    // If click on notification, mark it as read
                    if (!notification.is_read) {
                      NotificationApis.markAsRead(notification.id).then(() => {
                        fetchNotificationList();
                      });
                    }
                  }}
                >
                  <NotificationItem notification={notification} />
                </div>
              ))}
          </div>

          {/* Pagination */}
          <Pagination
            className={'notification-pagination'}
            size="small"
            total={notificationList.total}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => {
              setCurrentPage(page);
            }}
          ></Pagination>
          {/* Pagination ---- End */}

          {/* Content ---- End */}
        </div>
      )}
    </LocaleConsumer>
  );
};
