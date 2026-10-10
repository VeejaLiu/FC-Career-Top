import {
  Button,
  LocaleConsumer,
  Pagination,
  Select,
  Switch,
  Spin,
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

function NotificationChange({
  label,
  before,
  after,
}: {
  label: string;
  before?: number | null;
  after?: number | null;
}) {
  return (
    <div className="notification-change">
      <dt>{label}</dt>
      <dd>
        <span>{before ?? '—'}</span>
        <span className="notification-change-arrow" aria-hidden="true">
          →
        </span>
        <strong
          style={{
            color: getColorByDiff(
              before == null || after == null ? 0 : after - before,
            ),
          }}
        >
          {after ?? '—'}
        </strong>
      </dd>
    </div>
  );
}

function getNotificationContent(notification: NotificationBody, locale: any) {
  if (notification.message_type !== 'PlayerUpdate')
    return <p className="notification-unknown">{locale.UnknownMessageType}</p>;
  switch (notification.message_subtype) {
    case 'PlayerUpdate.SkillMove':
      return (
        <dl className="notification-changes">
          <NotificationChange
            label={locale.SkillMove}
            before={notification.old_skillmoves}
            after={notification.skillmoves}
          />
        </dl>
      );
    case 'PlayerUpdate.WeakFoot':
      return (
        <dl className="notification-changes">
          <NotificationChange
            label={locale.WeakFoot}
            before={notification.old_weakfoot}
            after={notification.weakfoot}
          />
        </dl>
      );
    case 'PlayerUpdate.Overall':
      return (
        <dl className="notification-changes">
          <NotificationChange
            label={locale.Overall}
            before={notification.old_overall_rating}
            after={notification.overall_rating}
          />
          <NotificationChange
            label={locale.Potential}
            before={notification.old_potential}
            after={notification.potential}
          />
        </dl>
      );
    default:
      return (
        <p className="notification-unknown">
          {locale.UnknownMessageType}: {notification.message_subtype}
        </p>
      );
  }
}

export const NotificationItem = ({
  notification,
}: {
  notification: NotificationBody;
}) => (
  <LocaleConsumer componentName="NotificationItem">
    {(locale: any) => (
      <div className="notification-item-layout">
        <div className="notification-avatar">
          <img
            src={getAvatarUrl(notification.player_id)}
            alt=""
            loading="lazy"
            onError={(event) => {
              if (
                event.currentTarget.getAttribute('src') !==
                player_avatar_placeholder
              )
                event.currentTarget.src = player_avatar_placeholder;
            }}
          />
        </div>
        <div className="notification-item-body">
          <div className="notification-item-heading">
            <div className="notification-player-name">
              <span
                className="notification-position"
                style={{
                  color: getColorByPosition(notification.player_position || ''),
                }}
              >
                {notification.player_position}
              </span>
              <strong>{notification.player_name}</strong>
            </div>
            {!notification.is_read && (
              <span className="notification-unread-dot" aria-hidden="true" />
            )}
          </div>
          <p className="notification-date">
            <span>{locale.GameDate}</span>
            <time dateTime={notification.in_game_date}>
              {notification.in_game_date}
            </time>
          </p>
          {getNotificationContent(notification, locale)}
          {!notification.is_read && (
            <span className="sr-only">{locale.MarkAsRead}</span>
          )}
        </div>
      </div>
    )}
  </LocaleConsumer>
);

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
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterValue, setFilterValue] = useState<string>('all');

  const requestSequence = useRef(0);
  const fetchNotificationList = useCallback(async () => {
    const sequence = ++requestSequence.current;
    setLoading(true);
    const notificationList = await NotificationApis.getAllNotifications({
      page: currentPage,
      limit: PAGE_SIZE,
      filter: filterValue,
      onlyUnread: onlyShowUnread,
    });
    if (sequence !== requestSequence.current) return;
    setNotificationList(notificationList);
    setLoading(false);
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
                aria-label={localeData.OnlyShowUnread}
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
          <div className="notification-panel-filters">
            <Select
              className="notification-type-filter"
              aria-label={localeData.FilterLabel}
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
          </div>
          <div className="notification-panel-content" aria-busy={loading}>
            {loading && notificationList.items.length === 0 && (
              <div className="notification-list-state">
                <Spin size="small" />
              </div>
            )}
            {!loading && notificationList.items.length === 0 && (
              <div className="notification-list-state" role="status">
                {onlyShowUnread ? localeData.EmptyUnread : localeData.Empty}
              </div>
            )}
            {notificationList?.items
              ?.filter(
                (notification) => !onlyShowUnread || !notification.is_read,
              )
              .map((notification: any, index: number) => (
                <button
                  type="button"
                  disabled={
                    loading || !!notification.is_read || notification.id == null
                  }
                  className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
                  key={notification.id ?? index}
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
                </button>
              ))}
          </div>

          {/* Pagination */}
          {notificationList.total > 0 && (
            <div className="notification-panel-footer">
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
            </div>
          )}
          {/* Pagination ---- End */}

          {/* Content ---- End */}
        </div>
      )}
    </LocaleConsumer>
  );
};
