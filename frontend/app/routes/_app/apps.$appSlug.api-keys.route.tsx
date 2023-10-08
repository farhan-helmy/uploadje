import { useNavigate, useParams } from '@remix-run/react';
import type { App } from '@shared/types/app';
import type { Image } from '@shared/types/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/primitives/Table';
import { useCustomQuery } from '~/hooks/useCustomQuery';

dayjs.extend(relativeTime);

export default function Page() {
  const { appSlug } = useParams();
  const navigate = useNavigate();

  const { data: apps = [], error } = useCustomQuery<Array<App & {id: string}>>({
    queryKey: ['apps'],
    queryFn: ()=>fetch('/resources/app').then(async (res) => res.json()).catch((err)=>{throw Error;})
  });

  if (error) {
    navigate('/login');
  }

  const currentRoute = apps && apps?.find(i=>i.id === appSlug);

  const { data: images = [] } = useCustomQuery<Image[]>({
    queryKey: ['images', currentRoute],
    queryFn: ()=>fetch('/resources/image', {
      headers: {
        'UPLOADJE_APP_ID': currentRoute!.appKey,
        'UPLOADJE_APP_SECRET': currentRoute!.appSecret,
      }
    }).then(async (res) => res.json())
  });

  return (
    <>
      <APICard />
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-lg">Active</h2>
      </div>
      <FilesTable images={images} />
    </>
  );
}

function APICard() {
  return (
    <div className="rounded-[14px] px-6 py-7 border border-black-5 min-h-[130px] flex gap-6">
      <div className='flex flex-col gap-1.5'>
        <p className="font-medium">Client ID</p>
        <div className='min-w-[266px] rounded-lg text-black-8 px-2 py-1 bg-black-4 font-mono'>
          <p>Hello</p>
        </div>
      </div>
      <div className="h-full w-[1px] bg-black-5"></div>
      <div className='flex flex-col gap-1.5 flex-grow'>
        <p className="font-medium">Quick copy</p>
        <div className='min-w-[266px] rounded-lg text-black-8 px-2 py-1 bg-black-4 font-mono'>
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
}

function FilesTable({ images }: {images: Image[]}) {
  return (
    <div>
      <Table className="appearance-none font-normal">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Date Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {images.map(image=>(
            <TableRow key={image.id}>
              <TableCell className="flex items-center gap-2 text-ellipsis whitespace-pre">
                <img
                  className="h-7 aspect-[3/2] rounded-lg object-cover border border-black-4"
                  src={image.path}
                  alt={image.path}
                />
                <span className="truncate underline">{image.path}</span>
              </TableCell>
              <TableCell className="min-w-[120px]">{image.size}</TableCell>
              <TableCell className="min-w-[160px] text-right">{dayjs().to(image.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
