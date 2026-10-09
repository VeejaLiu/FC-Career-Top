import {
  cloneElement,
  useEffect,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Popover, SideSheet } from '@douyinfe/semi-ui';
import { MOBILE_QUERY, useMediaQuery } from '../hooks/useMediaQuery';

interface Props {
  title: ReactNode;
  content: ReactNode;
  children: ReactElement;
  desktopWidth?: number;
  desktopPosition?: ComponentProps<typeof Popover>['position'];
  mobileClassName?: string;
}

// Touch screens use a dismissible sheet; desktop keeps the anchored popup.
export function ResponsivePopover({
  title,
  content,
  children,
  desktopWidth = 320,
  desktopPosition = 'bottomRight',
  mobileClassName,
}: Props) {
  const mobile = useMediaQuery(MOBILE_QUERY);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!mobile) setOpen(false);
  }, [mobile]);
  if (!mobile)
    return (
      <Popover
        trigger="click"
        position={desktopPosition}
        style={{ width: desktopWidth }}
        content={content}
      >
        {children}
      </Popover>
    );
  return (
    <>
      {cloneElement(children, {
        'aria-expanded': open,
        onClick: (event: MouseEvent) => {
          children.props.onClick?.(event);
          setOpen(true);
        },
      })}
      <SideSheet
        className={mobileClassName}
        title={title}
        visible={open}
        width="100%"
        onCancel={() => setOpen(false)}
      >
        {content}
      </SideSheet>
    </>
  );
}
