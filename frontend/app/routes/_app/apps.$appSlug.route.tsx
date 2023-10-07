/* eslint-disable max-len */
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams
} from '@remix-run/react';
import type { App } from '@shared/types/app';
import {
  HomeIcon,
  ImageIcon,
  KeyRoundIcon,
  SettingsIcon,
  WalletIcon
} from 'lucide-react';
import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '~/components/primitives/Select';
import { useCustomQuery } from '~/hooks/useCustomQuery';

interface SidebarItem {
  to: string;
  label: string;
  icon: JSX.Element;
  header: string;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  { to: 'overview', label: 'Overview', icon: <HomeIcon className="h-[18px] w-[18px]" />, header: 'Overview' },
  { to: 'files', label: 'Files', icon: <ImageIcon className="h-[18px] w-[18px]" />, header: 'My Files', description: 'These are all of the files that have been uploaded via your uploader.' },
  { to: 'api-keys', label: 'API Keys', icon: <KeyRoundIcon className="h-[18px] w-[18px]" />, header: 'API Keys' },
  { to: 'plans', label: 'Plans', icon: <WalletIcon className="h-[18px] w-[18px]" />, header: 'Plans and Billings' },
  { to: 'settings', label: 'Settings', icon: <SettingsIcon className="h-[18px] w-[18px]" />, header: 'Settings' }
];

export default function Page() {
  const { pathname } = useLocation();
  const currentPath = sidebarItems.find(i=>i.to === pathname.split('/')[pathname.split('/').length - 1]);

  return (
    <>
      <div className="flex justify-center bg-white flex-grow">
        <div className="max-w-[1148px] w-full p-6 pt-10 flex flex-col gap-8">
          <div className="flex gap-10">
            <Sidebar />
            <div className="flex-grow flex flex-col gap-7">
              <div className='flex flex-col gap-2'>
                <h1 className="font-semibold text-2xl">{currentPath?.header}</h1>
                {currentPath?.description && <p className="text-black-8">{currentPath?.description}</p>}
              </div>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Sidebar() {
  return (
    <div className="flex-none w-[220px] flex flex-col">
      <SelectAppDropdown />
      <nav className="flex flex-col gap-[1px] mt-4">
        {sidebarItems.map(i=>(
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `${isActive ? 'text-black font-medium bg-black-2' : 'text-black-8 hover:bg-black-1'} h-9 rounded-[10px] px-[10px] flex gap-[10px] items-center`
            }
          >
            <span>{i.icon}</span><span>{i.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function SelectAppDropdown() {
  const { appSlug } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentPath = pathname.split('/')[pathname.split('/').length - 1];

  const { data: apps = [] } = useCustomQuery<Array<App & {id: string}>>({
    queryKey: ['apps'],
    queryFn: ()=>fetch('/resources/app').then(async (res) => res.json())
  });

  const currentRoute = apps?.find(i=>i.id === appSlug);

  const [currentAppName, setCurrentAppName] = useState(currentRoute?.name);

  function handleSelectChange(appId: string) {
    const newName = apps?.find(i=>i.id === appId)?.name || 'undefined';
    setCurrentAppName(newName);
    return navigate(`/apps/${appId}/${currentPath}`);
  }

  return (
    <Select
      defaultValue={currentRoute?.id}
      value={currentRoute?.id}
      onValueChange={(appId)=>handleSelectChange(appId)}
    >
      <SelectTrigger className="w-full">
        {currentAppName || currentRoute?.name}
      </SelectTrigger>
      <SelectContent>
        {apps.map(i=>(
          <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
