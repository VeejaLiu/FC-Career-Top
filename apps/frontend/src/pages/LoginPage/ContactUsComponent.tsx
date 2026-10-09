import { IconGithubLogo, IconMailStroked1 } from '@douyinfe/semi-icons';
import { IconDiscord, IconTecentQQ } from '../../common/icons.tsx';

const contactLinks = [
  {
    label: 'Discord',
    href: 'https://discord.gg/aKfWAtbJ8F',
    text: 'https://discord.gg/aKfWAtbJ8F',
    icon: <IconDiscord classname="text-black" />,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/VeejaLiu/FIFA-Career-Dashboard-Frontend',
    text: 'VeejaLiu/FCT-Frontend',
    icon: <IconGithubLogo />,
  },
  {
    label: 'Email',
    href: 'mailto:support@fccareer.top',
    text: 'support@fccareer.top',
    icon: <IconMailStroked1 />,
  },
  {
    label: 'QQ',
    href: null,
    text: '974553280',
    icon: <IconTecentQQ />,
  },
];

export function ContactUsComponent() {
  return (
    <div className="mt-12 flex flex-col gap-3">
      {contactLinks.map((link, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="font-bold min-w-20 inline-block mr-2.5">
            {link.label}
          </span>
          <div className="flex items-center gap-2">
            {link.icon && (
              <span className="w-6 h-6 flex items-center justify-center">
                {link.icon}
              </span>
            )}
            {link.href ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.text}
              </a>
            ) : (
              <span>{link.text}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
