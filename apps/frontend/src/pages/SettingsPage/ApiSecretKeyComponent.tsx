import { IconCopy, IconRefresh2 } from '@douyinfe/semi-icons';
import { Input, Notification, Popover } from '@douyinfe/semi-ui';
import * as React from 'react';
import { useEffect } from 'react';
import { UserApis } from '../../service/UserApis.ts';

export interface ApiSecretKeyComponentProps {
  localeData: any;
}

function ApiSecretKeyComponent({
  localeData,
}: ApiSecretKeyComponentProps): React.ReactElement {
  const [secretKey, setSecretKey] = React.useState('...');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  async function fetchSecretKey() {
    const key = await UserApis.getSecretKey();
    console.log(`[fetchSecretKey] key: ${key}`);
    setSecretKey(key);
    setIsLoading(false);
  }

  async function doRefreshSecretKey() {
    setIsLoading(true);
    const key = await UserApis.doRefreshSecretKey();
    console.log(`[doRefreshSecretKey] key: ${key}`);
    setSecretKey(key);
    Notification.success({
      title: 'Success',
      content: 'Secret key refreshed',
      duration: 3,
    });
    setIsLoading(false);
  }

  useEffect(() => {
    fetchSecretKey().then();
  }, []);

  return (
    <div className="w-full p-4 border border-gray-200 rounded-md">
      <div className={'font-bold'}>{localeData?.APISecretKey}</div>
      <div className="flex mt-4">
        <div style={{ width: '300px' }}>{localeData?.APISecretKey}:</div>
        <Input
          // mode="password"
          disabled={true}
          // contentEditable="false"
          defaultValue={secretKey}
          value={secretKey}
        ></Input>

        {/* Copy Button */}
        <Popover
          mouseEnterDelay={500}
          showArrow
          position={'top'}
          content={<p>{localeData?.ClickToCopy}</p>}
        >
          <button
            className={
              'ml-2 button px-2 rounded bg-gray-200 hover:bg-gray-300 content-center items-center flex whitespace-nowrap'
            }
            disabled={isLoading}
            onClick={() => {
              navigator.clipboard.writeText(secretKey).then(
                () => {
                  Notification.success({
                    title: 'Success',
                    content: localeData?.CopySuccessMessage,
                    duration: 3,
                  });
                },
                (err) => {
                  Notification.error({
                    title: 'Error',
                    content: localeData?.FailedToCopyMessage,
                    duration: 3,
                  });
                },
              );
            }}
          >
            <IconCopy />
            <span className="ml-2">{localeData?.Copy}</span>
          </button>
        </Popover>

        {/* Refresh Button */}
        <Popover
          mouseEnterDelay={500}
          showArrow
          position={'top'}
          content={<p>{localeData?.ClickToRefresh}</p>}
        >
          <button
            className={
              'ml-2 button px-2 rounded bg-gray-200 hover:bg-gray-300 content-center items-center flex whitespace-nowrap'
            }
            onClick={async () => {
              await doRefreshSecretKey();
            }}
          >
            <IconRefresh2 />
            <span className="ml-2">{localeData?.Refresh}</span>
          </button>
        </Popover>
      </div>

      <div className="text-red-500 text-xs font-bold mt-2 w-full">
        {localeData?.DoNotShareSecretKey}
      </div>
    </div>
  );
}

export default ApiSecretKeyComponent;
