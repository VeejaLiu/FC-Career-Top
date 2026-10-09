import { LocaleConsumer, Spin } from '@douyinfe/semi-ui';
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
        <div className="flex items-center justify-center w-full h-full text-gray-500">
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
    <div className="flex items-center justify-center w-full h-full">
      <Spin size="large" />
    </div>
  );
}
