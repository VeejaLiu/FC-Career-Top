import { Button, LocaleConsumer, Spin } from '@douyinfe/semi-ui';
import { IconEmpty } from '@douyinfe/semi-icons-lab';

/**
 * No data component
 *
 * @constructor
 */
export function NoDataComponent() {
  return (
    <LocaleConsumer componentName="NoDataComponent">
      {(localeData: any, localeCode: string, dateFnsLocale: any) => (
        <div className="page-state text-gray-500">
          <div className="items-center justify-center flex flex-col">
            <IconEmpty className="mb-2" size={'extra-large'} />
            <div className="mt-2">
              {localeData.prefix}
              <span className="mx-0.5">
                <a
                  className="text-blue-500 hover:text-blue-700 hover:underline"
                  href="/get-started"
                >
                  {localeData.getStartedPage}
                </a>
              </span>
              {localeData.suffix}
            </div>
          </div>
        </div>
      )}
    </LocaleConsumer>
  );
}

export function LoadingComponent() {
  return (
    <div className="page-state" role="status" aria-label="Loading">
      <Spin size="large" />
    </div>
  );
}

export function LoadErrorComponent({ onRetry }: { onRetry: () => void }) {
  return (
    <LocaleConsumer componentName="AsyncState">
      {(locale: any) => (
        <div className="page-state" role="alert">
          <div>
            <p className="mb-4">{locale.error}</p>
            <Button onClick={onRetry}>{locale.retry}</Button>
          </div>
        </div>
      )}
    </LocaleConsumer>
  );
}
