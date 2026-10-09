// src/app/components/Footer.tsx

const Footer = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="text-lg font-bold my-2">
        <span className="mx-2">Free</span>
        <span className="mx-2">Automatic</span>
        <span className="mx-2">Open-source</span>
      </div>
      <div className="text-sm text-gray-500">
        Copyright FCT 2024. All rights reserved
      </div>
    </div>
  );
};

export default Footer;
